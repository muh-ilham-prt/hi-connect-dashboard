import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useSnackbar } from "@/components/Snackbar";
import { http } from "@/helpers/http";
import {
  AudienceSelector,
  NotificationComposer,
  NotificationHistory,
  NotificationModals,
  NotificationPreview,
} from "./components";

// ponytail: UI-only notification mockup. Replace with backend push/notification API when ready.
const AUDIENCE_OPTIONS = [
  {
    id: "all",
    label: "Semua Karyawan",
    desc: "Kirim ke semua karyawan terdaftar",
    icon: "lucide:users",
  },
  {
    id: "division",
    label: "Berdasarkan Divisi",
    desc: "Kirim hanya ke divisi yang dipilih",
    icon: "lucide:briefcase",
  },
  {
    id: "individual",
    label: "Karyawan Tertentu",
    desc: "Pilih penerima secara individual",
    icon: "lucide:user-check",
  },
];
const FALLBACK_DIVISIONS = [
  "Engineering",
  "Operasional",
  "Penjualan",
  "Keuangan",
  "Dukungan Pelanggan",
  "Sumber Daya Manusia",
];

const getRecords = (response) => {
  const payload = response?.data?.data;
  return Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? [];
};

const getDivisionName = (division) =>
  typeof division === "string" ? division : division?.name ?? division?.title ?? "";

const mapDivisions = (records) => records.map(getDivisionName).filter(Boolean);

const mapEmployee = (employee) => ({
  ...employee,
  division: getDivisionName(employee.division ?? employee.detail?.division),
});

const FALLBACK_EMPLOYEES = [
  {
    id: 1,
    name: "Siti Rahmawati",
    division: "Operasional",
    email: "siti.rahmawati@hik.co.id",
  },
  {
    id: 2,
    name: "Budi Santoso",
    division: "Engineering",
    email: "budi.santoso@hik.co.id",
  },
  {
    id: 3,
    name: "Rina Wulandari",
    division: "Penjualan",
    email: "rina.wulandari@hik.co.id",
  },
  {
    id: 4,
    name: "Agus Prasetyo",
    division: "Keuangan",
    email: "agus.prasetyo@hik.co.id",
  },
  {
    id: 5,
    name: "Dewi Lestari",
    division: "Dukungan Pelanggan",
    email: "dewi.lestari@hik.co.id",
  },
  {
    id: 6,
    name: "Fajar Nugroho",
    division: "Sumber Daya Manusia",
    email: "fajar.nugroho@hik.co.id",
  },
];
const TEMPLATES = [
  {
    id: "announcement",
    title: "Pengumuman Perusahaan",
    body: "Rekan-rekan, harap perhatikan rapat seluruh perusahaan yang dijadwalkan besok.",
    type: "announcement",
  },
  {
    id: "reminder",
    title: "Pengingat Kehadiran / Absen Masuk",
    body: "Jangan lupa mengisi kehadiran harian dan melengkapi catatan shift hari ini.",
    type: "reminder",
  },
  {
    id: "holiday",
    title: "Pemberitahuan Hari Libur Nasional",
    body: "Dalam rangka hari libur nasional yang akan datang, kantor akan tutup pada hari Jumat.",
    type: "alert",
  },
];

const getNotificationRecords = (response) => {
  const payload = response?.data?.data;
  return Array.isArray(payload)
    ? payload
    : (payload?.data ?? payload?.items ?? []);
};

const mapHistory = (records) =>
  records.map((item) => ({
    ...item,
    body: item.context ?? "",
    audience: `${item.employee_notifications?.length ?? 0} Karyawan Terpilih`,
    terkirimAt: item.terkirim_at ?? item.schedule ?? item.created_at,
    recipientCount: item.employee_notifications?.length ?? 0,
    status: item.delivery_status ?? item.status,
    type: String(item.type ?? "").toLowerCase(),
  }));

export default function Notification() {
  const snackbar = useSnackbar();
  const [audience, setAudience] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState(FALLBACK_DIVISIONS);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchEmployees, setSearchEmployees] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("PUBLISH");
  const [type, setType] = useState("announcement");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([http.get("/notification"), http.get("/employee?per_page=100"), http.get("/division?per_page=100")])
      .then(([notificationResponse, employeeResponse, divisionResponse]) => {
        if (!active) return;
        const records = getNotificationRecords(notificationResponse);
        const employeeRows = getRecords(employeeResponse);
        const divisionRows = getRecords(divisionResponse);
        setHistory(mapHistory(records));
        setDivisions(mapDivisions(divisionRows));
        setEmployees(
          Array.isArray(employeeRows)
            ? employeeRows.map(mapEmployee)
            : [],
        );
      })
      .catch(() => {
        if (active) {
          setHistory([]);
          setEmployees(FALLBACK_EMPLOYEES);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const toggle = (value, setter) =>
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  const recipientCount =
    audience === "all"
      ? employees.length
      : audience === "division"
        ? employees.filter((employee) =>
            selectedDivisions.includes(
              employee.division ?? employee.detail?.division?.name,
            ),
          ).length
        : selectedEmployees.length;
  const filteredEmployees = employees.filter((employee) =>
    employee.name?.toLowerCase().includes(searchEmployees.toLowerCase()),
  );

  function applyTemplate(template) {
    setTitle(template.title);
    setBody(template.body);
    setType(template.type);
    snackbar.success(`Templat diterapkan: ${template.title}`);
  }

  function handleSend() {
    if (!title.trim()) return snackbar.error("Judul notifikasi wajib diisi");
    if (!body.trim()) return snackbar.error("Isi pesan notifikasi wajib diisi");
    if (audience === "division" && selectedDivisions.length === 0)
      return snackbar.error("Pilih setidaknya satu divisi");
    if (audience === "individual" && selectedEmployees.length === 0)
      return snackbar.error("Pilih setidaknya satu karyawan");
    if (scheduleEnabled && !scheduleDate)
      return snackbar.error("Pilih tanggal dan waktu pengiriman");
    setConfirmOpen(true);
  }

  async function confirmSend() {
    setSending(true);
    setConfirmOpen(false);
    const recipientIds =
      audience === "all"
        ? employees.map((employee) => employee.id)
        : audience === "division"
          ? employees
              .filter((employee) =>
                selectedDivisions.includes(employee.division),
              )
              .map((employee) => employee.id)
          : selectedEmployees;
    try {
      await http.post("/notification", {
        employees: recipientIds,
        type: type.toUpperCase(),
        title: title.trim(),
        context: body.trim(),
        schedule: scheduleEnabled ? new Date(scheduleDate).toISOString() : null,
        status,
      });
      const response = await http.get("/notification");
      setHistory(mapHistory(getNotificationRecords(response)));
      setTitle("");
      setBody("");
      setSelectedDivisions([]);
      setSelectedEmployees([]);
      setScheduleEnabled(false);
      setScheduleDate("");
      setStatus("PUBLISH");
      snackbar.success(status === "DRAFT" ? "Notifikasi berhasil disimpan sebagai draf!" : "Notifikasi berhasil dikirim ke penerima!");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">
          Kirim Notifikasi
        </h1>
        <p className="text-sm text-slate-500">
          Kirim notifikasi push dan peringatan langsung ke Karyawan.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-base font-bold text-primary">
              <Icon icon="lucide:send" width="18" className="text-secondary" />
              Tulis Notifikasi
            </h2>
            <div className="mt-5 space-y-5">
              <AudienceSelector
                options={AUDIENCE_OPTIONS}
                divisions={divisions}
                audience={audience}
                selectedDivisions={selectedDivisions}
                selectedEmployees={selectedEmployees}
                employees={employees}
                filteredEmployees={filteredEmployees}
                searchEmployees={searchEmployees}
                onAudienceChange={setAudience}
                onDivisionToggle={(value) =>
                  toggle(value, setSelectedDivisions)
                }
                onEmployeeToggle={(value) =>
                  toggle(value, setSelectedEmployees)
                }
                onEmployeeSearch={setSearchEmployees}
              />
              <NotificationComposer
                type={type}
                title={title}
                body={body}
                scheduleEnabled={scheduleEnabled}
                scheduleDate={scheduleDate}
                status={status}
                templates={TEMPLATES}
                recipientCount={recipientCount}
                sending={sending}
                onTypeChange={setType}
                onTitleChange={setTitle}
                onBodyChange={setBody}
                onScheduleChange={setScheduleEnabled}
                onScheduleDateChange={setScheduleDate}
                onStatusChange={setStatus}
                onTemplateApply={applyTemplate}
                onSubmit={handleSend}
              />
            </div>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <NotificationPreview title={title} body={body} />
          <NotificationHistory
            history={history}
            search={searchHistory}
            onSearch={setSearchHistory}
            onSelect={setSelectedDetail}
          />
        </div>
      </div>
      <NotificationModals
        confirmOpen={confirmOpen}
        selectedDetail={selectedDetail}
        recipientCount={recipientCount}
        title={title}
        body={body}
        onConfirmClose={() => setConfirmOpen(false)}
        onConfirm={confirmSend}
        onDetailClose={() => setSelectedDetail(null)}
      />
    </div>
  );
}

