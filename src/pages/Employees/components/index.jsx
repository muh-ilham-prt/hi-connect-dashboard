import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import SearchSelect from "@/components/SearchSelect";
import StatusBadge from "@/components/StatusBadge";
import InitialsAvatar, { initials } from "@/components/InitialsAvatar";
import { http } from "@/helpers/http";
import {
  formatCurrencyInput,
  formatRupiah,
  parseCurrencyInput,
} from "@/helpers/currency";

export const DEPTS = [
  "Operations",
  "Sales",
  "Finance",
  "Engineering",
  "Customer support",
];
export const LOCS = [
  "Head office",
  "Branch Depok",
  "Warehouse A",
  "Warehouse B",
  "Remote",
];
export const STATUSES = ["Active", "On leave", "Inactive"];
const STATUS_LABELS = {
  active: "Aktif",
  Active: "Aktif",
  inactive: "Nonaktif",
  Inactive: "Nonaktif",
  on_leave: "Cuti",
  "On leave": "Cuti",
};

export { initials };

export const formatCode = (id) => `HC-${String(id).padStart(4, "0")}`;

export function EmployeeFilter({ query, onQueryChange }) {
  return (
    <div className="relative max-w-sm">
      <Icon
        icon="lucide:search"
        width="16"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Cari berdasarkan nama, NIP, atau email"
        aria-label="Cari karyawan"
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
      />
    </div>
  );
}

export function EmployeeTable({
  employees,
  loading,
  onEdit,
  onView,
  onDelete,
  onClearFilters,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
        <Icon
          icon="lucide:loader-2"
          width="20"
          className="animate-spin text-primary"
        />
        <span>Memuat karyawan...</span>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <Icon
          icon="lucide:users-round"
          width="36"
          height="36"
          className="mx-auto text-slate-300"
        />
        <p className="mt-2 font-semibold text-slate-800">
          Karyawan tidak ditemukan
        </p>
        <p className="text-sm text-slate-500">
          Coba kata kunci lain atau hapus filter.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
        >
          Hapus filter
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-250 text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Karyawan</th>
            <th className="px-3 py-3 font-semibold">NIP</th>
            <th className="px-3 py-3 font-semibold">Email</th>
            <th className="px-3 py-3 font-semibold">Telepon</th>
            <th className="px-3 py-3 font-semibold">Perusahaan</th>
            <th className="px-3 py-3 font-semibold">Divisi</th>
            <th className="px-3 py-3 font-semibold">Jabatan</th>
            <th className="px-3 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={emp.name} />
                  <p className="truncate font-semibold text-slate-800">
                    {emp.name}
                  </p>
                </div>
              </td>
              <td className="px-3 py-3 text-slate-700">
                {emp.detail?.nip ?? "-"}
              </td>
              <td className="px-3 py-3 text-slate-700">{emp.email ?? "-"}</td>
              <td className="px-3 py-3 text-slate-700">
                {emp.detail?.phone ?? "-"}
              </td>
              <td className="px-3 py-3 text-slate-700">
                {emp.detail?.company?.short ?? "-"}
              </td>
              <td className="px-3 py-3 text-slate-700">
                {emp.detail?.division?.name ?? "-"}
              </td>
              <td className="px-3 py-3 text-slate-700">
                {emp.detail?.job_title ?? "-"}
              </td>
              <td className="px-3 py-3">
                <StatusBadge
                  status={emp.detail?.status ?? ""}
                  label={
                    STATUS_LABELS[emp.detail?.status] ??
                    emp.detail?.status ??
                    "-"
                  }
                />
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onView(emp)}
                    className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                    aria-label={`Lihat detail ${emp.name}`}
                    title="Lihat detail"
                  >
                    <Icon icon="lucide:eye" width="16" />
                  </button>
                  <button
                    onClick={() => onEdit(emp)}
                    className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                    aria-label={`Ubah ${emp.name}`}
                  >
                    <Icon icon="lucide:pencil" width="16" />
                  </button>
                  <button
                    onClick={() => onDelete(emp)}
                    className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label={`Hapus ${emp.name}`}
                  >
                    <Icon icon="lucide:trash-2" width="16" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BENEFITS = [
  { key: "bpjs", label: "BPJS" },
  { key: "meal", label: "Uang makan", amountLabel: "Nominal uang makan" },
  {
    key: "transport",
    label: "Uang transport",
    amountLabel: "Nominal uang transport",
  },
  { key: "bonus", label: "Bonus" },
];

const EMPTY_BENEFITS = {
  bpjs: false,
  meal: { enabled: false, amount: "" },
  transport: { enabled: false, amount: "" },
  bonus: false,
};

const EMPTY_FORM = {
  // Basic
  name: "",
  email: "",
  password: "",
  pin: "",
  salary: "",
  benefits: EMPTY_BENEFITS,
  nip: "",
  nik: "",
  leader_id: "",
  division_id: "",
  company_id: "",
  job_title: "",
  gender: "",
  phone: "",
  address: "",
  npwp: "",
  can_wfh: false,
  photo: "",
  paid_leave_quota: "",
  status: "active",
  account_bank: "",
  account_name: "",
  account_number: "",
};

const TABS = [
  "Dasar",
  "Pekerjaan",
  "Kompensasi",
  "Identitas",
  "Kontak",
  "Bank",
];

const TAB_FIELDS = {
  Dasar: ["name", "email", "password", "pin"],
  Pekerjaan: [
    "company_id",
    "division_id",
    "job_title",
    "leader_id",
    "status",
    "can_wfh",
    "paid_leave_quota",
    "photo",
  ],
  Kompensasi: ["salary", "benefits.meal.amount", "benefits.transport.amount"],
  Identitas: ["nip", "nik", "npwp", "gender"],
  Kontak: ["phone", "address"],
  Bank: ["account_bank", "account_name", "account_number"],
};

function useApiSelect(endpoint) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search(kw) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: 1, per_page: 100 });
      if (kw?.trim()) params.set("keyword", kw.trim());
      const res = await http.get(`${endpoint}?${params}`);
      const data = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? [];
      setOptions(
        Array.isArray(data)
          ? data.map((item) => ({
              value: item.id,
              label: item.short ? `${item.short} — ${item.name}` : item.name,
            }))
          : [],
      );
    } catch {
      // http.js shows toast; keep existing options
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search("");
  }, [endpoint]);

  return { options, loading, search };
}

function inputCls(hasErr) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${hasErr ? "border-red-400" : "border-slate-300 focus:border-secondary"}`;
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function EmployeeFormModal({ isOpen, onClose, onSave, employee }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const leader = useApiSelect("/employee");
  const division = useApiSelect("/division");
  const company = useApiSelect("/company");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      // http.upload targets ${VITE_API_URL}/dashboard/v1, so the path is relative to it.
      const res = await http.upload("/general/upload", fd);
      const uploaded = res?.data?.data ?? res?.data ?? null;
      if (uploaded?.url) set("photo", uploaded.url);
    } catch {
      // http.js shows the error snackbar
    } finally {
      setUploadingPhoto(false);
    }
  }

  useEffect(() => {
    const benefits = employee?.benefits ?? {};
    setForm(
      employee
        ? {
            ...EMPTY_FORM,
            ...employee,
            benefits: {
              ...EMPTY_BENEFITS,
              ...benefits,
              meal: { ...EMPTY_BENEFITS.meal, ...benefits.meal },
              transport: { ...EMPTY_BENEFITS.transport, ...benefits.transport },
            },
          }
        : EMPTY_FORM,
    );
    setErrors({});
    setTab(0);
  }, [employee, isOpen]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Nama lengkap karyawan wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Masukkan alamat email yang valid.";
    if (!employee && !form.password) errs.password = "Kata sandi wajib diisi.";
    if (form.password && form.password.length < 6)
      errs.password = "Kata sandi minimal 6 karakter.";
    if (
      form.salary !== "" &&
      (!Number.isFinite(Number(form.salary)) || Number(form.salary) < 0)
    )
      errs.salary = "Gaji harus berupa angka positif.";
    for (const key of ["meal", "transport"]) {
      const benefit = form.benefits[key];
      if (
        benefit.enabled &&
        (benefit.amount === "" ||
          !Number.isFinite(Number(benefit.amount)) ||
          Number(benefit.amount) < 0)
      )
        errs[`benefits.${key}.amount`] = "Masukkan nominal yang valid.";
    }
    if (!form.division_id) errs.division_id = "Divisi wajib dipilih.";
    if (!form.nip.trim()) errs.nip = "NIP wajib diisi.";
    if (!form.nik.trim()) errs.nik = "NIK wajib diisi.";
    if (!form.job_title.trim()) errs.job_title = "Jabatan wajib diisi.";
    if (!form.gender) errs.gender = "Silakan pilih jenis kelamin.";
    if (!form.address.trim()) errs.address = "Alamat wajib diisi.";
    if (!form.status) errs.status = "Status wajib dipilih.";
    if (!form.account_bank.trim()) errs.account_bank = "Nama bank wajib diisi.";
    if (!form.account_name.trim())
      errs.account_name = "Nama pemilik rekening wajib diisi.";
    if (!form.account_number.trim())
      errs.account_number = "Nomor rekening wajib diisi.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const errKeys = Object.keys(errs);
      const idx = TABS.findIndex((t) =>
        TAB_FIELDS[t].some((f) => errKeys.includes(f)),
      );
      if (idx !== -1) setTab(idx);
      return;
    }

    const payload = { ...form };
    if (employee && !payload.password) delete payload.password;
    if (payload.salary !== "") payload.salary = Number(payload.salary);
    else delete payload.salary;
    payload.benefits = Object.fromEntries(
      BENEFITS.map(({ key }) => {
        const value = payload.benefits[key];
        if (key === "meal" || key === "transport") {
          return [
            key,
            {
              enabled: value.enabled,
              amount: value.enabled ? Number(value.amount) : null,
            },
          ];
        }
        return [key, value];
      }),
    );
    if (payload.paid_leave_quota !== "")
      payload.paid_leave_quota = Number(payload.paid_leave_quota);
    else delete payload.paid_leave_quota;
    if (!payload.leader_id) payload.leader_id = null;
    if (!payload.company_id) payload.company_id = null;

    onSave(payload);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Ubah karyawan" : "Tambah karyawan"}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
          {TABS.map((t, i) => {
            const tabHasError = TAB_FIELDS[t].some((f) => errors[f]);
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(i)}
                className={`shrink-0 flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${tab === i ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"} ${tabHasError ? 'after:ml-1 after:content-["•"] after:text-red-500' : ""}`}
              >
                {t}
                {tabHasError && <span className="ml-1 text-red-500">•</span>}
              </button>
            );
          })}
        </div>

        {tab === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama lengkap" required error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputCls(errors.name)}
              />
            </Field>
            <Field label="Email kerja" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls(errors.email)}
              />
            </Field>
            <Field
              label={employee ? "Kata sandi baru" : "Kata sandi"}
              required={!employee}
              error={errors.password}
            >
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={employee ? "Biarkan kosong jika tidak diubah" : ""}
                className={inputCls(errors.password)}
                autoComplete="new-password"
              />
            </Field>
            <Field label="PIN" error={errors.pin}>
              <input
                type="password"
                value={form.pin}
                onChange={(e) => set("pin", e.target.value)}
                placeholder="Opsional"
                className={inputCls(errors.pin)}
                autoComplete="new-password"
              />
            </Field>
          </div>
        )}

        {tab === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Perusahaan" error={errors.company_id}>
              <SearchSelect
                value={form.company_id}
                onChange={(v) => set("company_id", v)}
                options={company.options}
                loading={company.loading}
                placeholder="Cari perusahaan..."
                onSearch={company.search}
              />
            </Field>
            <Field label="Divisi" required error={errors.division_id}>
              <SearchSelect
                value={form.division_id}
                onChange={(v) => set("division_id", v)}
                options={division.options}
                loading={division.loading}
                placeholder="Cari divisi..."
                onSearch={division.search}
              />
            </Field>
            <Field label="Jabatan" required error={errors.job_title}>
              <input
                value={form.job_title}
                onChange={(e) => set("job_title", e.target.value)}
                className={inputCls(errors.job_title)}
              />
            </Field>
            <Field label="Atasan / Leader" error={errors.leader_id}>
              <SearchSelect
                value={form.leader_id}
                onChange={(v) => set("leader_id", v)}
                options={leader.options}
                loading={leader.loading}
                placeholder="Cari karyawan..."
                onSearch={leader.search}
              />
            </Field>
            <Field label="Status" required error={errors.status}>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className={inputCls(errors.status)}
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </Field>
            <Field label="Kuota cuti" error={errors.paid_leave_quota}>
              <input
                type="number"
                min="0"
                value={form.paid_leave_quota}
                onChange={(e) => set("paid_leave_quota", e.target.value)}
                className={inputCls(errors.paid_leave_quota)}
              />
            </Field>
            <Field label="Foto" error={errors.photo}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                disabled={uploadingPhoto}
                onChange={handlePhotoChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-secondary-soft file:px-2 file:py-1 file:text-xs file:font-semibold file:text-primary focus:outline-none disabled:opacity-60"
              />
              {uploadingPhoto && (
                <p className="mt-1 text-xs text-slate-500">
                  Mengunggah gambar...
                </p>
              )}
              {form.photo && !uploadingPhoto && (
                <p className="mt-1 truncate text-xs text-slate-500">
                  Gambar terunggah
                </p>
              )}
            </Field>
            <label className="flex items-center gap-3 pt-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.can_wfh}
                onChange={(e) => set("can_wfh", e.target.checked)}
                className="size-4 rounded accent-secondary"
              />
              Dapat absen diluar kantor
            </label>
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-5">
            <Field label="Gaji" error={errors.salary}>
              <input
                type="text"
                inputMode="numeric"
                value={formatCurrencyInput(form.salary)}
                onChange={(e) =>
                  set("salary", parseCurrencyInput(e.target.value))
                }
                className={inputCls(errors.salary)}
                placeholder="Rp 0"
                aria-label="Gaji dalam rupiah"
              />
            </Field>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">
                Tunjangan
              </legend>
              <div className="space-y-3">
                {BENEFITS.map((benefit) => {
                  const amountBenefit =
                    benefit.key === "meal" || benefit.key === "transport";
                  const checked = amountBenefit
                    ? form.benefits[benefit.key].enabled
                    : form.benefits[benefit.key];
                  return (
                    <div
                      key={benefit.key}
                      className="rounded-lg border border-slate-200 p-3"
                    >
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            set("benefits", {
                              ...form.benefits,
                              [benefit.key]: amountBenefit
                                ? {
                                    ...form.benefits[benefit.key],
                                    enabled: e.target.checked,
                                  }
                                : e.target.checked,
                            })
                          }
                          className="size-4 rounded accent-secondary"
                        />
                        {benefit.label}
                      </label>
                      {amountBenefit && checked && (
                        <Field
                          label={benefit.amountLabel}
                          error={errors[`benefits.${benefit.key}.amount`]}
                        >
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formatCurrencyInput(
                              form.benefits[benefit.key].amount,
                            )}
                            onChange={(e) =>
                              set("benefits", {
                                ...form.benefits,
                                [benefit.key]: {
                                  ...form.benefits[benefit.key],
                                  amount: parseCurrencyInput(e.target.value),
                                },
                              })
                            }
                            className={`${inputCls(errors[`benefits.${benefit.key}.amount`])} mt-2`}
                            aria-label={benefit.amountLabel}
                            placeholder="Rp 0"
                          />
                        </Field>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>
        )}

        {tab === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="NIP" required error={errors.nip}>
              <input
                value={form.nip}
                onChange={(e) => set("nip", e.target.value)}
                className={inputCls(errors.nip)}
              />
            </Field>
            <Field label="NIK" required error={errors.nik}>
              <input
                value={form.nik}
                onChange={(e) => set("nik", e.target.value)}
                className={inputCls(errors.nik)}
              />
            </Field>
            <Field label="NPWP" error={errors.npwp}>
              <input
                value={form.npwp}
                onChange={(e) => set("npwp", e.target.value)}
                className={inputCls(errors.npwp)}
              />
            </Field>
            <Field label="Jenis kelamin" required error={errors.gender}>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className={inputCls(errors.gender)}
              >
                <option value="">Pilih...</option>
                <option value="man">Laki-laki</option>
                <option value="woman">Perempuan</option>
              </select>
            </Field>
          </div>
        )}
        {tab === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telepon" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputCls(errors.phone)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Alamat" required error={errors.address}>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={inputCls(errors.address)}
                />
              </Field>
            </div>
          </div>
        )}
        {tab === 5 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama bank" required error={errors.account_bank}>
              <input
                value={form.account_bank}
                onChange={(e) => set("account_bank", e.target.value)}
                className={inputCls(errors.account_bank)}
              />
            </Field>
            <Field
              label="Nama pemilik rekening"
              required
              error={errors.account_name}
            >
              <input
                value={form.account_name}
                onChange={(e) => set("account_name", e.target.value)}
                className={inputCls(errors.account_name)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field
                label="Nomor rekening"
                required
                error={errors.account_number}
              >
                <input
                  value={form.account_number}
                  onChange={(e) => set("account_number", e.target.value)}
                  className={inputCls(errors.account_number)}
                />
              </Field>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {TABS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTab(i)}
                className={`size-2 rounded-full transition-colors ${i === tab ? "bg-primary" : "bg-slate-200 hover:bg-slate-300"}`}
                aria-label={`Buka tab ${TABS[i]}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {tab > 0 && (
              <button
                type="button"
                onClick={() => setTab((t) => t - 1)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Kembali
              </button>
            )}
            {tab < TABS.length - 1 ? (
              <button
                type="button"
                onClick={() => setTab((t) => t + 1)}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition-colors"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition-colors"
              >
                {employee ? "Simpan perubahan" : "Tambah karyawan"}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export function EmployeeDetailModal({ isOpen, onClose, employee }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!isOpen || !employee?.id) return;
    let active = true;
    setProfile(null);
    setError(false);
    setActiveTab(0);
    setLoading(true);
    http
      .get(`/employee/${employee.id}`)
      .then((res) => {
        if (active) setProfile(res?.data?.data ?? res?.data ?? res);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, employee?.id]);

  if (!employee) return null;
  const data = profile ?? employee;
  const detail = data.detail ?? {};
  const sections = [
    [
      "Informasi dasar",
      [
        ["ID karyawan", data.id],
        ["Nama lengkap", data.name],
        ["Email kerja", data.email],
      ],
    ],
    [
      "Pekerjaan",
      [
        ["Perusahaan", detail.company?.name ?? detail.company?.short],
        ["Divisi", detail.division?.name],
        ["Jabatan", detail.job_title],
        ["Atasan / Leader", detail.leader?.name],
        ["Status", STATUS_LABELS[detail.status] ?? detail.status],
        [
          "Dapat absen di luar kantor",
          detail.can_wfh == null ? null : detail.can_wfh ? "Ya" : "Tidak",
        ],
        ["Kuota cuti", detail.paid_leave_quota],
        ["Sisa kuota cuti", detail.paid_leave_remain],
      ],
    ],
    [
      "Kompensasi",
      [
        ["Gaji", detail.salary == null ? null : formatRupiah(detail.salary)],
        ["BPJS", detail.benefits?.bpjs ? "Ya" : "Tidak"],
        [
          "Uang makan",
          detail.benefits?.meal?.enabled
            ? formatRupiah(detail.benefits.meal.amount)
            : "Tidak",
        ],
        [
          "Uang transport",
          detail.benefits?.transport?.enabled
            ? formatRupiah(detail.benefits.transport.amount)
            : "Tidak",
        ],
        ["Bonus", detail.benefits?.bonus ? "Ya" : "Tidak"],
      ],
    ],
    [
      "Identitas",
      [
        ["NIP", detail.nip],
        ["NIK", detail.nik],
        ["NPWP", detail.npwp],
        [
          "Jenis kelamin",
          detail.gender === "man"
            ? "Laki-laki"
            : detail.gender === "woman"
              ? "Perempuan"
              : detail.gender,
        ],
      ],
    ],
    [
      "Kontak",
      [
        ["Telepon", detail.phone],
        ["Alamat", detail.address],
      ],
    ],
    [
      "Rekening bank",
      [
        ["Nama bank", detail.account_bank],
        ["Nama pemilik rekening", detail.account_name],
        ["Nomor rekening", detail.account_number],
      ],
    ],
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail karyawan"
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
          <Icon
            icon="lucide:loader-2"
            width="20"
            className="animate-spin text-primary"
          />
          Memuat detail karyawan...
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <Icon
            icon="lucide:circle-alert"
            width="32"
            className="mx-auto text-red-400"
          />
          <p className="mt-2 font-semibold text-slate-800">
            Detail karyawan gagal dimuat
          </p>
          <p className="text-sm text-slate-500">
            Tutup lalu buka kembali untuk mencoba lagi.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            {detail.photo ? (
              <img
                src={detail.photo}
                alt={`Foto ${data.name}`}
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <InitialsAvatar
                name={data.name}
                size="size-14"
                className="text-base"
              />
            )}
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-800">
                {data.name}
              </h3>
              <p className="text-sm text-slate-500">
                {detail.job_title ?? "-"}
              </p>
              <div className="mt-2">
                <StatusBadge
                  status={detail.status ?? ""}
                  label={STATUS_LABELS[detail.status] ?? detail.status ?? "-"}
                />
              </div>
            </div>
          </div>
          <div
            className="my-5 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1"
            role="tablist"
            aria-label="Detail karyawan"
          >
            {sections.map(([title], index) => (
              <button
                key={title}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                onClick={() => setActiveTab(index)}
                className={`shrink-0 flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${activeTab === index ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {title}
              </button>
            ))}
          </div>
          <section role="tabpanel" aria-label={sections[activeTab][0]}>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {sections[activeTab][1].map(([label, value]) => (
                <div
                  key={label}
                  className={label === "Alamat" ? "sm:col-span-2" : ""}
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </dt>
                  <dd className="mt-1 wrap-break-word text-sm text-slate-700">
                    {value === 0 ? 0 : value || "-"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, employee }) {
  if (!employee) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus karyawan?"
      maxWidth="max-w-sm"
    >
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-slate-800">{employee.name}</span> (
        {formatCode(employee.id)}) akan dihapus dari daftar karyawan. Tindakan
        ini tidak dapat dibatalkan.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Hapus karyawan
        </button>
      </div>
    </Modal>
  );
}

