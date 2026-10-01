import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Icon } from '@iconify/react'

const navItems = [
  { to: '/dashboard', label: 'Analytics', icon: 'lucide:layout-dashboard' },
  { to: '/employees', label: 'Employees', icon: 'lucide:users' },
  { to: '/attendance', label: 'Attendance', icon: 'lucide:calendar-check' },
  { to: '/leave', label: 'Leave requests', icon: 'lucide:calendar-off' },
]

const settingsItems = [
  { to: '/office', label: 'Office', icon: 'lucide:building-2' },
]

export default function Layout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const logout = () => { localStorage.removeItem('token'); navigate('/') }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Mobile scrim */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-primary text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="grid size-10 place-items-center rounded-xl bg-white text-primary">
            <Icon icon="lucide:fingerprint" width="24" height="24" />
          </span>
          <span className="text-lg font-extrabold">Hi-Connect</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 text-sm font-medium" aria-label="Main">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive ? 'bg-secondary' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon icon={icon} width="18" />
              {label}
            </NavLink>
          ))}

          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg px-3 py-2.5 text-white/75 hover:bg-white/10 hover:text-white [&::-webkit-details-marker]:hidden">
              <Icon icon="lucide:settings" width="18" />
              Settings
              <Icon icon="lucide:chevron-down" width="16" className="ml-auto transition-transform group-open:rotate-180" />
            </summary>
            <div className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-3">
              {settingsItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      isActive ? 'bg-secondary' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon icon={icon} width="16" />
                  {label}
                </NavLink>
              ))}
            </div>
          </details>
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
          <div className="relative hidden max-w-xs flex-1 sm:block">
            <Icon icon="lucide:search" width="16" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search employees"
              aria-label="Search employees"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
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
