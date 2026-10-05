import { Icon } from "@iconify/react";

export default function PermitTypeHeader({ total, onAdd }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Jenis Izin</h1>
        <p className="text-sm text-slate-500">{total} jenis izin terdaftar</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
      >
        <Icon icon="lucide:plus" width="18" />
        Tambah jenis izin
      </button>
    </div>
  );
}

