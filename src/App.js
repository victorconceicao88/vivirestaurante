import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { Suspense } from 'react';

// Carregamento lazy para melhor tratamento de erros
const ClientPage = React.lazy(() => import('./pages/ClientPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    console.error('Auth error:', error);
    return <div className="min-h-screen flex items-center justify-center text-red-500">
      Erro no sistema. Recarregue a página.
    </div>;
  }

  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<ClientPage />} />
          <Route 
            path="/admin" 
            element={user ? <AdminPage /> : <Navigate to="/login" replace state={{ from: 'admin' }} />} 
          />
          <Route 
            path="/login" 
            element={!user ? <LoginPage /> : <Navigate to="/admin" replace />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;