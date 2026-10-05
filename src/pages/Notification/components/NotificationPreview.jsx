export default function NotificationPreview({ title, body }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">Pratinjau Push Seluler</h3>
    <div className="mt-3 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-4 text-white shadow-inner">
      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400"><span className="font-medium">HI CONNECT</span><span>sekarang</span></div>
      <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs"><div className="flex items-start gap-3"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold text-white shadow-sm">HI</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-white">{title.trim() || 'Judul Notifikasi'}</p><p className="mt-0.5 line-clamp-3 text-xs leading-relaxed text-slate-300">{body.trim() || 'Pratinjau pesan notifikasi akan tampil di sini secara langsung.'}</p></div></div></div>
    </div>
  </div>
}
