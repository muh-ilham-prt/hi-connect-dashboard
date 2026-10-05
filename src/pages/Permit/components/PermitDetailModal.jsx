import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import InitialsAvatar from "@/components/InitialsAvatar";
import { attachmentUrls, isImageUrl } from "@/helpers/attachment";
import ProtectedImage from "./ProtectedImage";
import { fullDate, workingDays } from "@/helpers/dates";
import { STATUS_LABELS } from "./statuses";

export function PermitDetailModal({ isOpen, onClose, request }) {
  if (!request) return null;

  const startValue = request.startDate || request.start_date;
  const endValue = request.endDate || request.end_date || startValue;
  const startDate = startValue ? new Date(startValue) : null;
  const endDate = endValue ? new Date(endValue) : null;
  const validRange =
    startDate &&
    endDate &&
    !Number.isNaN(startDate.getTime()) &&
    !Number.isNaN(endDate.getTime());
  const employeeName = request.employee?.name || "Tidak diketahui";
  const files = attachmentUrls(
    request.file_supports ||
      request.fileSupports ||
      request.imageUrl ||
      request.image_url,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail permohonan izin"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <InitialsAvatar name={employeeName} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {employeeName}
              </p>
              <p className="truncate text-sm text-slate-500">
                {request.employee?.email || "Email tidak tersedia"}
              </p>
            </div>
          </div>
          <StatusBadge
            status={request.status}
            label={
              STATUS_LABELS[request.status] ??
              request.status ??
              "Tidak diketahui"
            }
          />
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Jenis izin
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">
              {request.type?.name || "Izin"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lama izin
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">
              {validRange
                ? `${workingDays(startDate, endDate)} hari kerja`
                : "-"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tanggal izin
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">
              {validRange
                ? `${fullDate.format(startDate)}${startDate.getTime() !== endDate.getTime() ? ` – ${fullDate.format(endDate)}` : ""}`
                : "-"}
            </dd>
          </div>
          {request.id && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nomor permohonan
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-slate-600">
                {request.id}
              </dd>
            </div>
          )}
        </dl>

        {files.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bukti pendukung ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((url, index) => {
                const isImage = isImageUrl(url);
                return isImage ? (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <ProtectedImage
                      src={url}
                      alt={`Bukti pendukung ${index + 1} permohonan ${employeeName}`}
                      className="max-h-72 w-full object-contain transition group-hover:opacity-90"
                    />
                    <span className="flex items-center justify-center gap-1.5 border-t border-slate-200 px-3 py-2 text-xs font-semibold text-primary">
                      <Icon icon="lucide:external-link" width="13" />
                      Buka gambar asli
                    </span>
                  </a>
                ) : (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-slate-100"
                  >
                    <Icon icon="lucide:paperclip" width="16" />
                    <span className="truncate">
                      {decodeURIComponent(url.split("/").pop() || "Lampiran")}
                    </span>
                    <Icon
                      icon="lucide:external-link"
                      width="13"
                      className="ml-auto shrink-0"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Alasan permohonan
          </h3>
          <p className="mt-2 whitespace-pre-wrap wrap-break-word rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            {request.reason || "Tidak ada alasan yang dicantumkan."}
          </p>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
