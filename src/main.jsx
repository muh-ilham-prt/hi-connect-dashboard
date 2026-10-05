import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { SnackbarProvider } from '@/components/Snackbar'
import routes from '@/routes'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      <RouterProvider router={createHashRouter(routes)} />
    </SnackbarProvider>
  </StrictMode>,
)
