import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'

export default function ResetPasswordModal({ isOpen, onClose, onConfirm, user }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setError('')
    }
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    if (!password.trim()) {
      setError('Masukkan kata sandi baru.')
      return
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }
    onConfirm(password)
  }

  if (!user) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset kata sandi" maxWidth="max-w-sm">
      <p className="text-sm text-slate-500">
        Atur kata sandi baru untuk <span className="font-semibold text-slate-800">{user.name}</span>.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Kata sandi baru</label>
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
          autoComplete="new-password"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
            error ? 'border-red-400' : 'border-slate-300 focus:border-secondary'
          }`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition-colors">
            Reset kata sandi
          </button>
        </div>
      </form>
    </Modal>
  )
}
