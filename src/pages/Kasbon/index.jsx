import { Icon } from '@iconify/react'

export default function Kasbon() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Kasbon</h1>
        <p className="text-sm text-slate-500">Kelola pengajuan dan pembayaran kasbon karyawan.</p>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center">
        <Icon icon="lucide:hand-coins" width="40" className="mx-auto text-slate-300" />
        <p className="mt-3 font-semibold text-slate-800">Belum ada data kasbon</p>
        <p className="mt-1 text-sm text-slate-500">Data kasbon akan tampil di sini setelah tersedia.</p>
      </section>
    </div>
  )
}
