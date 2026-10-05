import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "@/components/Pagination";
import { useSnackbar } from "@/components/Snackbar";
import { http } from "@/helpers/http";
import {
  PermitTypeTable,
  PermitTypeFormModal,
  DeletePermitTypeModal,
  PermitTypeHeader,
  PermitTypeSearch,
  PermitTypeListState,
} from "@/pages/PermitType/components";

const PAGE_SIZE = 10;
const EMPTY_META = { page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 };

export default function PermitType() {
  const snackbar = useSnackbar();
  const [permitTypes, setPermitTypes] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPermitType, setEditingPermitType] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingPermitType, setDeletingPermitType] = useState(null);
  const debounceRef = useRef(null);

  const fetchPermitTypes = useCallback(async (p, keyword) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE });
      if (keyword?.trim()) params.set("keyword", keyword.trim());
      const res = await http.get(`/permit-type?${params}`);
      const items = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? [];
      const paginationMeta = res?.data?.data?.meta ??
        res?.data?.meta ?? {
          page: p,
          per_page: PAGE_SIZE,
          total: items.length,
          last_page: 1,
        };
      setPermitTypes(items);
      setMeta(paginationMeta);
    } catch {
      // http.js shows the snackbar
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermitTypes(page, query);
  }, [fetchPermitTypes, page]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function handleQueryChange(value) {
    setQuery(value);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPermitTypes(1, value), 400);
  }

  async function handleSave(formData) {
    try {
      if (editingPermitType) {
        await http.put(`/permit-type/${editingPermitType.id}`, formData);
        snackbar.success("Jenis izin diperbarui");
      } else {
        await http.post("/permit-type", formData);
        snackbar.success("Jenis izin ditambahkan");
      }
      setFormOpen(false);
      fetchPermitTypes(page, query);
    } catch {
      // http.js shows the snackbar
    }
  }

  async function handleDelete() {
    if (!deletingPermitType) return;
    try {
      await http.delete(`/permit-type/${deletingPermitType.id}`);
      snackbar.success("Jenis izin dihapus");
      setDeleteOpen(false);
      const nextPage = permitTypes.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) fetchPermitTypes(nextPage, query);
    } catch {
      // http.js shows the snackbar
    }
  }

  return (
    <div className="space-y-5">
      <PermitTypeHeader
        total={meta.total}
        onAdd={() => {
          setEditingPermitType(null);
          setFormOpen(true);
        }}
      />
      <PermitTypeSearch query={query} onChange={handleQueryChange} />

      <section className="rounded-xl border border-slate-200 bg-white">
        {permitTypes.length === 0 ? (
          <PermitTypeListState
            loading={loading}
            total={permitTypes.length}
            onClear={() => handleQueryChange("")}
          />
        ) : (
          <PermitTypeTable
            permitTypes={permitTypes}
            onEdit={(item) => {
              setEditingPermitType(item);
              setFormOpen(true);
            }}
            onDelete={(item) => {
              setDeletingPermitType(item);
              setDeleteOpen(true);
            }}
          />
        )}
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

      <PermitTypeFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        permitType={editingPermitType}
      />
      <DeletePermitTypeModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        permitType={deletingPermitType}
      />
    </div>
  );
}

