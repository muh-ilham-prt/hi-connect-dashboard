import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from '@/components/Snackbar'
import { http } from '@/helpers/http'
import {
  PermissionLoadState,
  PermissionMatrix,
  PermissionPageActions,
  PermissionPageHeader,
  PermissionSummary,
  apiPermsToSet,
  setToApiPerms,
} from '@/pages/User/Permission/components'

export default function UserPermission() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const [role, setRole] = useState(null)
  const [loadState, setLoadState] = useState('loading') // 'loading' | 'ok' | 'error'
  const [permissions, setPermissions] = useState([]) // flat string[]
  const [original, setOriginal] = useState([])       // for reset
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoadState('loading')
    http.get(`/role/${roleId}`)
      .then((res) => {
        const data = res.data
        const flat = [...apiPermsToSet(data.permissions ?? [])]
        setRole(data)
        setPermissions(flat)
        setOriginal(flat)
        setLoadState('ok')
      })
      .catch(() => setLoadState('error'))
  }, [roleId])

  async function handleSave() {
    setSaving(true)
    try {
      await http.post('/role/permission', {
        role_id: roleId,
        permissions: setToApiPerms(new Set(permissions)),
      })
      snackbar.success(`Izin berhasil diperbarui untuk ${role.name}`)
      navigate('/roles')
    } catch {
      // http.js shows snackbar
    } finally {
      setSaving(false)
    }
  }

  if (loadState !== 'ok' || !role) {
    return <PermissionLoadState loading={loadState === 'loading'} />
  }

  return (
    <div className="space-y-5">
      <PermissionPageHeader
        role={role}
        saving={saving}
        onReset={() => setPermissions([...original])}
        onSave={handleSave}
      />
      <PermissionSummary roleName={role.name} permissionCount={permissions.length} />
      <PermissionMatrix permissions={permissions} onChange={setPermissions} />
      <PermissionPageActions
        saving={saving}
        onCancel={() => navigate('/roles')}
        onSave={handleSave}
      />
    </div>
  )
}
