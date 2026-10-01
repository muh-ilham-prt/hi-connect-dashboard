import Layout from './Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Employees from './pages/Employees'
import Leave from './pages/Leave'
import Office from './pages/Office'
import NotFound from './pages/NotFound'

// All routes of the app live here.
export default [
  { path: '/', element: <Login /> },
  {
    element: <Layout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/attendance', element: <Attendance /> },
      { path: '/employees', element: <Employees /> },
      { path: '/leave', element: <Leave /> },
      { path: '/office', element: <Office /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
