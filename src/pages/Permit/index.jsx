import { useCallback, useEffect, useRef, useState } from "react";
import { useSnackbar } from "@/components/Snackbar";
import Pagination from "@/components/Pagination";
import { http } from "@/helpers/http";
import {
  LeaveSummaryCards,
  LeaveFilter,
  LeaveTable,
  PermitDetailModal,
  PermitHeader,
  RejectModal,
  downloadPdf,
} from "@/pages/Permit/components";

const PAGE_SIZE = 8;
const STATUSES = ["Pending", "Approved", "Rejected"];
const EMPTY_META = { page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 };

function unpackList(res) {
  const root = res?.data ?? res;
  const payload = root?.data ?? root;
  return {
    items: Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [],
    meta: payload?.meta ?? root?.meta ?? EMPTY_META,
  };
}

export default function Permit() {
  const snackbar = useSnackbar();
  const [permits, setPermits] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [counts, setCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rejecting, setRejecting] = useState(null);
  const [detailRequest, setDetailRequest] = useState(null);
  const debounceRef = useRef(null);

  const fetchPermits = useCallback(async (p, keyword, statusFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        per_page: String(PAGE_SIZE),
      });
      if (keyword?.trim()) params.set("keyword", keyword.trim());
      if (statusFilter) params.set("status", statusFilter);
      const res = await http.get(`/permit?${params}`);
      const { items, meta: responseMeta } = unpackList(res);
      setPermits(items);
      setMeta({ ...EMPTY_META, ...responseMeta, page: p, per_page: PAGE_SIZE });
    } catch {
      // http.js shows the snackbar
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        STATUSES.map(async (s) => {
          const res = await http.get(
            `/permit?per_page=1&status=${encodeURIComponent(s)}`,
          );
          const { meta: responseMeta } = unpackList(res);
          return [s, responseMeta.total ?? 0];
        }),
      );
      setCounts(Object.fromEntries(results));
    } catch {
      // http.js shows the snackbar
    }
  }, []);

  useEffect(() => {
    fetchPermits(page, query, status);
  }, [fetchPermits, page, query, status]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function handleQueryChange(value) {
    setQuery(value);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPermits(1, value, status), 400);
  }

  function handleStatusChange(value) {
    setStatus(value);
    setPage(1);
  }

  async function updateStatus(id, newStatus) {
    try {
      await http.patch(`/permit/${id}/status`, { status: newStatus });
      const statusLabels = { Approved: "disetujui", Rejected: "ditolak" };
      snackbar.success(
        `Permohonan izin ${statusLabels[newStatus] ?? newStatus.toLowerCase()}`,
      );
      await Promise.all([fetchPermits(page, query, status), fetchCounts()]);
      return true;
    } catch {
      return false;
    }
  }

  async function handleApprove(id) {
    await updateStatus(id, "Approved");
  }

  async function handleReject() {
    if (!rejecting) return;
    const employeeName = rejecting.employee?.name || "employee";
    const updated = await updateStatus(rejecting.id, "Rejected");
    if (updated) {
      snackbar.info("Alasan penolakan tidak disimpan oleh API saat ini.");
      setRejecting(null);
    }
    return employeeName;
  }

  function handleDownload(request) {
    try {
      downloadPdf(request);
      snackbar.info(
        "Gunakan dialog cetak untuk menyimpan permohonan sebagai PDF",
      );
    } catch {
      snackbar.error(
        "Dialog cetak tidak dapat dibuka. Periksa pengaturan pop-up lalu coba lagi.",
      );
    }
  }

  function handleClearFilters() {
    clearTimeout(debounceRef.current);
    setQuery("");
    setStatus("");
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <PermitHeader />

      <LeaveSummaryCards
        counts={counts}
        activeStatus={status}
        onSelectStatus={handleStatusChange}
      />

      <LeaveFilter
        query={query}
        onQueryChange={handleQueryChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      <section className="rounded-xl border border-slate-200 bg-white">
        <LeaveTable
          requests={permits}
          loading={loading}
          onApprove={handleApprove}
          onReject={setRejecting}
          onViewDetail={setDetailRequest}
          onDownloadPdf={handleDownload}
          onClearFilters={handleClearFilters}
        />
        {meta.total > 0 && (
          <Pagination
            page={meta.page}
            totalPages={meta.last_page}
            totalItems={meta.total}
            pageSize={meta.per_page}
            onPageChange={setPage}
          />
        )}
      </section>

      <RejectModal
        isOpen={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        onConfirm={handleReject}
        request={rejecting}
      />

      <PermitDetailModal
        isOpen={Boolean(detailRequest)}
        onClose={() => setDetailRequest(null)}
        request={detailRequest}
      />
    </div>
  );
}

