import { Icon } from "@iconify/react";
import { mapLink, missionLines, parseDocuments, parseHost, radiusText, sanitizeRichText } from "@/helpers/office";
// ---- Main Office Profile Card ----
export default function OfficeProfile({ office, onEdit, onDelete }) {
  if (!office) return null;

  const missions = missionLines(office.mission);
  const lat = parseFloat(office.latitude ?? office.lat ?? 0);
  const lng = parseFloat(office.longitude ?? office.lng ?? 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary text-xl font-black tracking-wider text-white shadow-sm">
            {office.short || "KP"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-primary">{office.name}</h2>
              {(office.isMain || office.is_main) && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Kantor Utama
                </span>
              )}
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 leading-relaxed">
              {office.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(office)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Icon icon="lucide:pencil" width="14" />
            Ubah
          </button>
          {onDelete && !(office.isMain || office.is_main) && (
            <button
              type="button"
              onClick={() => onDelete(office)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <Icon icon="lucide:trash-2" width="14" />
              Hapus
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Icon icon="lucide:map-pin" width="14" className="text-primary" />
            Area check-in
          </div>
          <p className="mt-1 font-semibold text-slate-800 text-sm">
            Radius {radiusText(office)}
          </p>
          {lat !== 0 && lng !== 0 && (
            <a
              href={mapLink(lat, lng)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-secondary hover:underline"
            >
              {lat.toFixed(5)}, {lng.toFixed(5)}
              <Icon icon="lucide:external-link" width="12" />
            </a>
          )}
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Icon icon="lucide:globe" width="14" className="text-primary" />
            Situs web
          </div>
          {office.website ? (
            <a
              href={office.website}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate font-semibold text-secondary text-sm hover:underline"
            >
              {parseHost(office.website)}
            </a>
          ) : (
            <p className="mt-1 font-semibold text-slate-800 text-sm">-</p>
          )}
          <span className="mt-1 block text-xs text-slate-400">
            Domain resmi
          </span>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Icon icon="lucide:hash" width="14" className="text-primary" />
            Nomor cabang
          </div>
          <p className="mt-1 font-semibold text-slate-800 text-sm">
            {office.branchNumber ?? office.branch_number ?? "-"}
          </p>
          <span className="mt-1 block text-xs text-slate-400">Kode lokasi</span>
        </div>
      </div>

      {(office.vision || office.mission) && (
        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 md:grid-cols-2">
          {office.vision && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Icon icon="lucide:eye" width="14" className="text-primary" />
                Visi
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {office.vision}
              </p>
            </div>
          )}
          {office.mission && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Icon
                  icon="lucide:target"
                  width="14"
                  className="text-primary"
                />
                Misi
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {missions.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                    <span>{m}.</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Help center, SOP, Support documents */}
      {(office.helpCenter ||
        office.help_center ||
        office.standardOperation ||
        office.standard_operation ||
        office.supportDocuments ||
        office.support_documents) && (
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          {(office.helpCenter || office.help_center) &&
            (office.helpCenter || office.help_center) !== "-" && (
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Icon
                    icon="lucide:headphones"
                    width="14"
                    className="text-primary"
                  />
                  Pusat bantuan
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {office.helpCenter ?? office.help_center}
                </p>
              </div>
            )}
          {(office.standardOperation || office.standard_operation) && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Icon
                  icon="lucide:book-open"
                  width="14"
                  className="text-primary"
                />
                Prosedur operasional standar
              </h3>
              {/* Sanitized via DOMParser allowlist before rendering */}
              <div
                className="prose prose-sm mt-2 max-w-none text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(
                    office.standardOperation ?? office.standard_operation,
                  ),
                }}
              />
            </div>
          )}
          {(() => {
            const docs = parseDocuments(
              office.supportDocuments ?? office.support_documents ?? "",
            );
            if (!docs.length) return null;
            return (
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Icon
                    icon="lucide:paperclip"
                    width="14"
                    className="text-primary"
                  />
                  Dokumen pendukung
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {docs.map((doc, i) => (
                    <li
                      key={doc.key ?? i}
                      className="flex items-center gap-2.5"
                    >
                      <Icon
                        icon="lucide:file-text"
                        width="15"
                        className="shrink-0 text-primary"
                      />
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-secondary hover:underline truncate"
                        >
                          {doc.name}
                        </a>
                      ) : (
                        <span className="text-sm text-slate-600 truncate">
                          {doc.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}

