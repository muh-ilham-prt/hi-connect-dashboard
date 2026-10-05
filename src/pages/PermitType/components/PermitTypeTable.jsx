import { Icon } from "@iconify/react";

export default function PermitTypeTable({ permitTypes, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-135 text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Nama</th>
            <th className="px-3 py-3 font-semibold">Deskripsi</th>
            <th className="px-3 py-3 font-semibold">Dibuat</th>
            <th className="px-5 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {permitTypes.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50/70 transition-colors"
            >
              <td className="px-5 py-3">
                <p className="font-semibold text-slate-800">{item.name}</p>
              </td>
              <td className="px-3 py-3 text-xs text-slate-600 max-w-xs">
                <p className="line-clamp-2">{item.description || "-"}</p>
              </td>
              <td className="px-3 py-3 text-xs text-slate-600">
                {item.created_at
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(item.created_at))
                  : "-"}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  {!item.is_system && (
                    <>
                      <button
                        onClick={() => onEdit(item)}
                        className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                        aria-label={`Ubah ${item.name}`}
                        title="Ubah jenis izin"
                      >
                        <Icon icon="lucide:pencil" width="16" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Hapus ${item.name}`}
                        title="Hapus jenis izin"
                      >
                        <Icon icon="lucide:trash-2" width="16" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

