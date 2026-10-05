import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import menus from '@/assets/menu.json'
import { http } from '@/helpers/http'
import logo from '@/assets/logo-transparent.png'
function NavItem({ item, onNavigate }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-secondary' : 'text-white/75 hover:bg-white/10 hover:text-white'
    }`

  if (item.disabled) {
    return (
      <div
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40"
      >
        <Icon icon={item.icon} width="18" />
        <span>{item.name}</span>
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
          Dalam proses
        </span>
      </div>
    )
  }

  if (item.children?.length) {
    return (
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white [&::-webkit-details-marker]:hidden">
          <Icon icon={item.icon} width="18" />
          {item.name}
          <Icon icon="lucide:chevron-down" width="16" className="ml-auto transition-transform group-open:rotate-180" />
        </summary>
        <div className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-3">
          {item.children.map((child) => (
            <NavLink key={child.id} to={child.url} onClick={onNavigate} className={linkClass}>
              <Icon icon={child.icon} width="16" />
              {child.name}
            </NavLink>
          ))}
        </div>
      </details>
    )
  }

  return (
    <NavLink to={item.url} onClick={onNavigate} className={linkClass}>
      <Icon icon={item.icon} width="18" />
      {item.name}
    </NavLink>
  )
}

export default function Layout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)
  const logout = async () => {
    try {
      await http.get('/auth/logout')
    } catch {
      // Clear local auth even if the server cannot revoke the session.
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Mobile scrim */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-primary text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-6">
          <img src={logo} alt="Hi-Connect" className="size-10 rounded-xl object-contain bg-white" />
          <span className="text-lg font-extrabold">Hi-Connect</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Main">
          {menus.map((item) => (
            <NavItem key={item.id} item={item} onNavigate={closeSidebar} />
          ))}
        </nav>

        <button
          onClick={logout}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          <Icon icon="lucide:log-out" width="18" />
          Sign out
        </button>
      </aside>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Icon icon="lucide:menu" width="20" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Notifications">
              <Icon icon="lucide:bell" width="20" />
            </button>
            <span className="grid size-9 place-items-center rounded-full bg-secondary-soft text-sm font-bold text-primary" aria-label="Signed in as HR admin">
              HR
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
