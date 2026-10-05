import { Icon } from "@iconify/react";

export default function NotificationComposer({
  type,
  title,
  body,
  scheduleEnabled,
  scheduleDate,
  status,
  templates,
  recipientCount,
  sending,
  onTypeChange,
  onTitleChange,
  onBodyChange,
  onScheduleChange,
  onScheduleDateChange,
  onStatusChange,
  onTemplateApply,
  onSubmit,
}) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Jenis Notifikasi
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: "announcement",
              label: "Pengumuman",
              icon: "lucide:megaphone",
            },
            { id: "reminder", label: "Pengingat", icon: "lucide:bell" },
            {
              id: "alert",
              label: "Peringatan / Mendesak",
              icon: "lucide:triangle-alert",
            },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onTypeChange(option.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${type === option.id ? "bg-primary text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon icon={option.icon} width="14" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Judul <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="mis. Pembaruan Relokasi Kantor"
          maxLength={100}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          <span>Buat singkat dan jelas untuk pratinjau layar kunci.</span>
          <span>{title.length}/100</span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Isi Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="Tulis isi lengkap notifikasi push di sini..."
          maxLength={500}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          <span>
            Format akan disesuaikan otomatis untuk notifikasi seluler.
          </span>
          <span>{body.length}/500</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(event) => onScheduleChange(event.target.checked)}
              className="rounded text-secondary focus:ring-secondary"
            />
            <span>Jadwalkan Pengiriman</span>
          </label>
          <input
            disabled={!scheduleEnabled}
            type="datetime-local"
            value={scheduleDate}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(event) => onScheduleDateChange(event.target.value)}
            aria-label="Tanggal dan waktu pengiriman"
            className={`mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 ${scheduleEnabled ? "bg-white" : "bg-gray-300"}`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
          >
            <option value="PUBLISH">PUBLISH</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
          Templat Cepat
        </span>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateApply(template)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition hover:border-secondary hover:text-secondary"
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-500">
          Perkiraan penerima:{" "}
          <span className="font-bold text-primary">
            {recipientCount} Karyawan
          </span>
        </div>
        <button
          type="button"
          disabled={sending}
          onClick={onSubmit}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50"
        >
          {sending ? (
            <>
              <Icon
                icon="lucide:loader-2"
                width="16"
                className="animate-spin"
              />
              {status === "DRAFT" ? "Menyimpan..." : "Mengirim..."}
            </>
          ) : (
            <>
              <Icon icon={status === "DRAFT" ? "lucide:save" : "lucide:send"} width="16" />
              {status === "DRAFT" ? "Simpan" : "Kirim Sekarang"}
            </>
          )}
        </button>
      </div>
    </>
  );
}

