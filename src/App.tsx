import { Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import LoginPage from './pages/LoginPage'
import ThemeChooserPage from './pages/ThemeChooserPage'
import ListsOverviewPage from './pages/ListsOverviewPage'
import ListPage from './pages/ListPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import { UpdateToast } from './components/UpdateToast'

export default function App() {
  return (
    <>
    <UpdateToast />
    <Routes>
      {/* public */}
      <Route path="/login" element={<LoginPage />} />

      {/* protected */}
      <Route
        path="/welcome"
        element={
          <RequireAuth>
            <ThemeChooserPage />
          </RequireAuth>
        }
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <ListsOverviewPage />
          </RequireAuth>
        }
      />
      <Route
        path="/list/:listId"
        element={
          <RequireAuth>
            <ListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/analytics"
        element={
          <RequireAuth>
            <AnalyticsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />

      {/* fallbacks */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </>
  )
}
