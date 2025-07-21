import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthProvider';

import CallDetail from './pages/CallDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Upload from './pages/Upload';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>     
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/calls/:id" element={<CallDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
