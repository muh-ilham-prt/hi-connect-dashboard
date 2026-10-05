import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import MapPicker from "@/components/MapPicker";
import RichTextEditor from "@/components/RichTextEditor";
import FileDropzone from "@/components/FileDropzone";
import { parseDocuments } from "@/helpers/office";

// ---- Office Form Modal (Add / Edit) ----

const WORKING_DAYS = [
  ["monday", "Senin"],
  ["tuesday", "Selasa"],
  ["wednesday", "Rabu"],
  ["thursday", "Kamis"],
  ["friday", "Jumat"],
  ["saturday", "Sabtu"],
  ["sunday", "Minggu"],
];

const EMPTY_FORM = {
  name: "",
  short: "",
  address: "",
  website: "",
  branch_number: "",
  is_main: false,
  latitude: "-6.3171809",
  longitude: "106.6871455",
  radius: "10",
  radius_unit: "meter",
  vision: "",
  mission: "",
  help_center: "",
  standard_operation: "",
  working_days: WORKING_DAYS.slice(0, 5).map(([key]) => key),
  support_documents: [], // array of {name,size,type,url?,key?,_file?}
  checkin_time: "08:00",
  max_check_in_time: "08:00",
  checkout_time: "17:00",
  max_check_out_time: "17:00",
};

const TABS = [
  { id: "info", label: "Informasi", icon: "lucide:building-2" },
  { id: "location", label: "Lokasi", icon: "lucide:map-pin" },
  { id: "hours", label: "Jam Kerja", icon: "lucide:clock" },
  {
    id: "company",
    label: "Perusahaan",
    icon: "lucide:file-text",
    optional: true,
  },
];

// Which tab each validated field lives on (used to jump to the first error).
const FIELD_TAB = {
  name: "info",
  short: "info",
  address: "info",
  website: "info",
  latitude: "location",
  longitude: "location",
  radius: "location",
};

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
    hasError ? "border-red-400" : "border-slate-300 focus:border-secondary"
  }`;

function Field({
  id,
  label,
  required,
  optional,
  error,
  hint,
  className = "",
  children,
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
        {optional && (
          <span className="font-normal text-slate-400"> (opsional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function OfficeFormModal({
  isOpen,
  onClose,
  onSave,
  office,
  hasMainOffice,
  onGeolocateFail,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [tab, setTab] = useState("info");
  const searchTimeoutRef = useRef(null);
  const manualLocationRef = useRef(null);

  async function searchLocationByAddress(addr) {
    const q = addr?.trim();
    if (!q || q.length < 3) return;
    setSearchingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        setForm((f) => ({
          ...f,
          latitude: parseFloat(item.lat).toFixed(7),
          longitude: parseFloat(item.lon).toFixed(7),
        }));
      }
    } catch {
      // Ignore geocoding network errors silently
    } finally {
      setSearchingAddress(false);
    }
  }

  function handleAddressChange(val) {
    setForm((f) => ({ ...f, address: val }));
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchLocationByAddress(val);
    }, 700);
  }

  useEffect(() => () => clearTimeout(searchTimeoutRef.current), []);

  useEffect(() => {
    if (office) {
      setForm({
        name: office.name ?? "",
        short: office.short ?? "",
        address: office.address ?? "",
        website: office.website ?? "",
        branch_number: office.branchNumber ?? office.branch_number ?? "",
        is_main: Boolean(office.isMain || office.is_main),
        latitude: String(office.latitude ?? office.lat ?? "-6.3171809"),
        longitude: String(office.longitude ?? office.lng ?? "106.6871455"),
        radius: String(office.radius ?? "10"),
        radius_unit: office.radiusUnit ?? office.radius_unit ?? "meter",
        vision: office.vision ?? "",
        mission: office.mission ?? "",
        help_center: office.helpCenter ?? office.help_center ?? "",
        standard_operation:
          office.standardOperation ?? office.standard_operation ?? "",
        working_days: Array.isArray(office.working_days)
          ? office.working_days
          : WORKING_DAYS.slice(0, 5).map(([key]) => key),
        support_documents: parseDocuments(
          office.supportDocuments ?? office.support_documents ?? "",
        ),
        checkin_time:
          office.checkinTime ??
          office.checkin_time ??
          office.check_in_time ??
          "08:00",
        max_check_in_time:
          office.maxCheckinTime ?? office.max_check_in_time ?? "08:00",
        checkout_time:
          office.checkoutTime ??
          office.checkout_time ??
          office.check_out_time ??
          "17:00",
        max_check_out_time:
          office.maxCheckoutTime ?? office.max_check_out_time ?? "17:00",
      });
    } else {
      setForm({ ...EMPTY_FORM, is_main: !hasMainOffice });
    }
    setErrors({});
    setGeoLoading(false);
    setTab("info");
  }, [office, isOpen, hasMainOffice]);

  function revealManualLocation() {
    if (manualLocationRef.current) manualLocationRef.current.open = true;
  }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      onGeolocateFail?.("Fitur lokasi tidak didukung oleh peramban Anda.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(7),
          longitude: pos.coords.longitude.toFixed(7),
        }));
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        onGeolocateFail?.(err.message || "Lokasi Anda tidak dapat diperoleh.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Nama kantor wajib diisi.";
    if (!form.short.trim()) next.short = "Nama singkat wajib diisi.";
    else if (form.short.trim().length > 10)
      next.short = "Maksimal 10 karakter.";

    if (!form.address.trim()) next.address = "Alamat wajib diisi.";

    if (form.website.trim() && !/^https?:\/\//i.test(form.website.trim())) {
      next.website = "Situs web harus diawali dengan http:// atau https://";
    }

    const latNum = parseFloat(form.latitude);
    if (form.latitude === "" || isNaN(latNum) || latNum < -90 || latNum > 90) {
      next.latitude = "Nilai lintang harus antara -90 dan 90.";
    }

    const lngNum = parseFloat(form.longitude);
    if (
      form.longitude === "" ||
      isNaN(lngNum) ||
      lngNum < -180 ||
      lngNum > 180
    ) {
      next.longitude = "Nilai bujur harus antara -180 dan 180.";
    }

    const radNum = parseFloat(form.radius);
    if (isNaN(radNum) || radNum <= 0) {
      next.radius = "Radius harus berupa angka positif.";
    }

    setErrors(next);
    if (next.latitude || next.longitude) revealManualLocation();

    const firstError = Object.keys(next)[0];
    if (firstError) setTab(FIELD_TAB[firstError]);

    return !firstError;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        short: form.short.trim().toUpperCase(),
        address: form.address.trim(),
        website: form.website.trim() || null,
        branch_number:
          form.branch_number !== "" ? Number(form.branch_number) : null,
        is_main: form.is_main,
        latitude: form.latitude,
        longitude: form.longitude,
        radius: String(form.radius),
        radius_unit: form.radius_unit,
        vision: form.vision.trim(),
        mission: form.mission.trim(),
        help_center: form.help_center.trim() || "-",
        standard_operation: form.standard_operation.trim() || null,
        working_days: form.working_days,
        support_documents: form.support_documents,
        checkin_time: form.checkin_time,
        max_check_in_time: form.max_check_in_time,
        checkout_time: form.checkout_time,
        max_check_out_time: form.max_check_out_time,
      });
    } catch {
      // Parent shows the error; keep the modal and form values intact.
    } finally {
      setSaving(false);
    }
  }

  const tabHasError = (id) =>
    Object.keys(errors).some((key) => FIELD_TAB[key] === id);

  function handleTabKeyDown(e) {
    const index = TABS.findIndex((item) => item.id === tab);
    let nextIndex = index;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft")
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    else return;
    e.preventDefault();
    setTab(TABS[nextIndex].id);
    document.getElementById(`office-tab-${TABS[nextIndex].id}`)?.focus();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={office ? "Ubah data kantor" : "Tambah kantor"}
      maxWidth="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={saving}
        className="flex flex-col"
      >
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Bagian formulir kantor"
          onKeyDown={handleTabKeyDown}
          className="flex gap-1 border-b border-slate-200"
        >
          {TABS.map((item) => {
            const active = tab === item.id;
            const hasError = tabHasError(item.id);
            return (
              <button
                key={item.id}
                id={`office-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`office-panel-${item.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(item.id)}
                className={`relative -mb-px inline-flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon icon={item.icon} width="16" />
                {item.label}
                {item.optional && (
                  <span className="hidden text-xs font-normal text-slate-400 sm:inline">
                    (opsional)
                  </span>
                )}
                {hasError && (
                  <span
                    className="size-2 rounded-full bg-red-500"
                    role="img"
                    aria-label="Ada isian yang perlu diperbaiki"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Panels (kept mounted so values and editors keep their state) */}
        <div className="max-h-[58vh] min-h-80 overflow-y-auto px-1 py-5">
          {/* Tab 1: Informasi */}
          <div
            role="tabpanel"
            id="office-panel-info"
            aria-labelledby="office-tab-info"
            hidden={tab !== "info"}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field
                id="office-name"
                label="Nama kantor"
                required
                error={errors.name}
                className="sm:col-span-2"
              >
                <input
                  id="office-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Contoh: PT Himalaya Indo Karya"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "office-name-error" : undefined
                  }
                  className={inputClass(errors.name)}
                />
              </Field>

              <Field
                id="office-short"
                label="Nama singkat"
                required
                error={errors.short}
                hint="Maks. 10 karakter."
              >
                <input
                  id="office-short"
                  value={form.short}
                  maxLength={10}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, short: e.target.value }))
                  }
                  placeholder="Contoh: HIK"
                  aria-invalid={Boolean(errors.short)}
                  aria-describedby={
                    errors.short ? "office-short-error" : "office-short-hint"
                  }
                  className={`${inputClass(errors.short)} uppercase`}
                />
              </Field>
            </div>

            <Field
              id="office-address"
              label="Alamat lengkap"
              required
              error={errors.address}
              hint="Peta di tab Lokasi akan mengikuti alamat ini."
            >
              <textarea
                id="office-address"
                rows={3}
                value={form.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Contoh: Jl. Jenderal Sudirman No. 10, Jakarta Pusat"
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address
                    ? "office-address-error"
                    : "office-address-hint"
                }
                className={inputClass(errors.address)}
              />
              {searchingAddress && (
                <span
                  className="mt-1 flex items-center gap-1 text-xs text-secondary"
                  role="status"
                >
                  <Icon
                    icon="lucide:loader-2"
                    width="12"
                    className="animate-spin"
                  />
                  Mencari alamat di peta…
                </span>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id="office-website"
                label="Situs web"
                optional
                error={errors.website}
              >
                <input
                  id="office-website"
                  type="url"
                  value={form.website}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, website: e.target.value }))
                  }
                  placeholder="https://contoh.com"
                  aria-invalid={Boolean(errors.website)}
                  aria-describedby={
                    errors.website ? "office-website-error" : undefined
                  }
                  className={inputClass(errors.website)}
                />
              </Field>

              <Field id="office-branch" label="Nomor cabang" optional>
                <input
                  id="office-branch"
                  type="number"
                  min="0"
                  value={form.branch_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, branch_number: e.target.value }))
                  }
                  placeholder="Contoh: 1"
                  className={inputClass(false)}
                />
              </Field>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <input
                type="checkbox"
                checked={form.is_main}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_main: e.target.checked }))
                }
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-secondary"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-700">
                  Jadikan kantor utama
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                  Menggantikan kantor utama yang digunakan saat ini.
                </span>
              </span>
            </label>
          </div>

          {/* Tab 2: Lokasi */}
          <div
            role="tabpanel"
            id="office-panel-location"
            aria-labelledby="office-tab-location"
            hidden={tab !== "location"}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-xs leading-relaxed text-slate-500">
                Letakkan penanda di kantor. Karyawan dapat check-in saat berada
                di dalam lingkaran.
              </p>
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={geoLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-secondary/30 bg-secondary-soft px-3 py-2 text-xs font-semibold text-primary transition hover:bg-secondary/15 disabled:opacity-50"
              >
                <Icon
                  icon={geoLoading ? "lucide:loader-2" : "lucide:locate-fixed"}
                  width="14"
                  className={geoLoading ? "animate-spin" : ""}
                />
                {geoLoading ? "Mencari lokasi…" : "Gunakan lokasi saya"}
              </button>
            </div>

            {/* Mount the map only while this tab is visible: map libraries measure
                their container on mount and render blank/misaligned when hidden. */}
            {isOpen && tab === "location" && (
              <MapPicker
                lat={form.latitude}
                lng={form.longitude}
                radius={form.radius}
                radiusUnit={form.radius_unit}
                onChange={({ lat, lng }) => {
                  setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
                }}
              />
            )}

            <Field
              id="office-radius"
              label="Jarak check-in dari kantor"
              required
              error={errors.radius}
              hint="Lingkaran pada peta menunjukkan batas area check-in."
            >
              <div className="flex gap-2">
                <input
                  id="office-radius"
                  type="number"
                  min="1"
                  step="any"
                  value={form.radius}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, radius: e.target.value }))
                  }
                  aria-invalid={Boolean(errors.radius)}
                  aria-describedby={
                    errors.radius ? "office-radius-error" : "office-radius-hint"
                  }
                  className={`min-w-0 flex-1 ${inputClass(errors.radius)}`}
                />
                <label className="sr-only" htmlFor="office-radius-unit">
                  Satuan jarak
                </label>
                <select
                  id="office-radius-unit"
                  value={form.radius_unit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, radius_unit: e.target.value }))
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                >
                  <option value="meter">Meter</option>
                  <option value="kilometer">Kilometer</option>
                </select>
              </div>
            </Field>

            <details
              ref={manualLocationRef}
              className="rounded-lg border border-slate-200 bg-slate-50"
            >
              <summary className="cursor-pointer px-3.5 py-3 text-sm font-semibold text-slate-600 hover:text-primary">
                Atur titik lokasi secara manual
              </summary>
              <div className="grid grid-cols-1 gap-3 border-t border-slate-200 p-3.5 sm:grid-cols-2">
                <Field
                  id="office-latitude"
                  label="Lintang"
                  error={errors.latitude}
                >
                  <input
                    id="office-latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, latitude: e.target.value }))
                    }
                    placeholder="-6.3171809"
                    aria-invalid={Boolean(errors.latitude)}
                    aria-describedby={
                      errors.latitude ? "office-latitude-error" : undefined
                    }
                    className={inputClass(errors.latitude)}
                  />
                </Field>
                <Field
                  id="office-longitude"
                  label="Bujur"
                  error={errors.longitude}
                >
                  <input
                    id="office-longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, longitude: e.target.value }))
                    }
                    placeholder="106.6871455"
                    aria-invalid={Boolean(errors.longitude)}
                    aria-describedby={
                      errors.longitude ? "office-longitude-error" : undefined
                    }
                    className={inputClass(errors.longitude)}
                  />
                </Field>
              </div>
            </details>
          </div>

          {/* Tab 3: Jam Kerja */}
          <div
            role="tabpanel"
            id="office-panel-hours"
            aria-labelledby="office-tab-hours"
            hidden={tab !== "hours"}
            className="space-y-5"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-700">
                Jam kerja kantor
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Tentukan jadwal dan batas waktu absensi karyawan di kantor ini.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Waktu masuk
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id="office-checkin"
                  label="Check-in"
                  hint="Waktu mulai karyawan dapat check-in."
                >
                  <input
                    id="office-checkin"
                    type="time"
                    value={form.checkin_time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, checkin_time: e.target.value }))
                    }
                    className={inputClass(false)}
                  />
                </Field>
                <Field
                  id="office-max-checkin"
                  label="Batas check-in"
                  hint="Batas akhir karyawan dapat check-in."
                >
                  <input
                    id="office-max-checkin"
                    type="time"
                    value={form.max_check_in_time}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        max_check_in_time: e.target.value,
                      }))
                    }
                    className={inputClass(false)}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Waktu pulang
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id="office-checkout"
                  label="Check-out"
                  hint="Waktu mulai karyawan dapat check-out."
                >
                  <input
                    id="office-checkout"
                    type="time"
                    value={form.checkout_time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, checkout_time: e.target.value }))
                    }
                    className={inputClass(false)}
                  />
                </Field>
                <Field
                  id="office-max-checkout"
                  label="Batas check-out"
                  hint="Batas akhir karyawan dapat check-out."
                >
                  <input
                    id="office-max-checkout"
                    type="time"
                    value={form.max_check_out_time}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        max_check_out_time: e.target.value,
                      }))
                    }
                    className={inputClass(false)}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Tab 4: Perusahaan (opsional) */}
          <div
            role="tabpanel"
            id="office-panel-company"
            aria-labelledby="office-tab-company"
            hidden={tab !== "company"}
            className="space-y-4"
          >
            <p className="text-xs leading-relaxed text-slate-500">
              Bagian ini opsional. Isi hanya jika karyawan perlu melihat
              informasi ini.
            </p>

            <Field id="office-vision" label="Visi">
              <textarea
                id="office-vision"
                rows={2}
                value={form.vision}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vision: e.target.value }))
                }
                placeholder="Pernyataan visi perusahaan"
                className={inputClass(false)}
              />
            </Field>

            <Field id="office-mission" label="Misi">
              <textarea
                id="office-mission"
                rows={3}
                value={form.mission}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mission: e.target.value }))
                }
                placeholder="Tulis satu poin misi per baris"
                className={inputClass(false)}
              />
            </Field>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-700">
                Hari kerja
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WORKING_DAYS.map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.working_days.includes(key)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          working_days: event.target.checked
                            ? [...current.working_days, key]
                            : current.working_days.filter((day) => day !== key),
                        }))
                      }
                      className="size-4 rounded accent-secondary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <Field
              id="office-help"
              label="Kontak bantuan"
              hint="Nomor telepon, email, atau alamat situs bantuan karyawan."
            >
              <input
                id="office-help"
                type="text"
                value={form.help_center}
                onChange={(e) =>
                  setForm((f) => ({ ...f, help_center: e.target.value }))
                }
                placeholder="Contoh: 021-12345678 atau bantuan@perusahaan.com"
                className={inputClass(false)}
              />
            </Field>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Prosedur operasional standar (SOP)
              </span>
              <RichTextEditor
                value={form.standard_operation}
                onChange={(html) =>
                  setForm((f) => ({ ...f, standard_operation: html }))
                }
                placeholder="Tulis kebijakan dan panduan yang perlu diketahui karyawan..."
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Dokumen pendukung
              </span>
              <FileDropzone
                files={form.support_documents}
                onChange={(docs) =>
                  setForm((f) => ({ ...f, support_documents: docs }))
                }
                uploading={saving}
              />
              <p className="mt-1 text-xs text-slate-500">
                PDF, DOC, DOCX, XLS, atau XLSX. Maksimal 10 MB per berkas.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {saving && (
              <Icon
                icon="lucide:loader-2"
                width="15"
                className="animate-spin"
              />
            )}
            {saving
              ? "Menyimpan…"
              : office
                ? "Simpan perubahan"
                : "Simpan kantor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
