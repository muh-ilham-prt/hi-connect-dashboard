import { Icon } from "@iconify/react";
import OfficeProfile from "./OfficeProfile";
// ---- Office List using OfficeProfile Card ----
export default function OfficeProfileList({ offices, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-14 text-sm text-slate-500">
        <Icon
          icon="lucide:loader-2"
          width="20"
          className="animate-spin text-primary"
        />
        <span>Memuat daftar kantor...</span>
      </div>
    );
  }

  if (offices.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center">
        <Icon
          icon="lucide:building-2"
          width="36"
          height="36"
          className="mx-auto text-slate-300"
        />
        <p className="mt-2 font-semibold text-slate-800">
          Kantor tidak ditemukan
        </p>
        <p className="text-sm text-slate-500">
          Coba kata kunci lain atau tambahkan kantor baru.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {offices.map((office) => (
        <OfficeProfile
          key={office.id}
          office={office}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
