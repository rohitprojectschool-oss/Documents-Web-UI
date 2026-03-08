import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import createAppMachine from './machine';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Invoices from '../pages/Invoices/Invoices';
import Customers from '../pages/Customers/Customers';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import Users from '../pages/Users/Users';

function AppContent() {
  const [state] = useMachine(createAppMachine());

  // Future: handle 'login', 'unauthorized', 'maintenance' states here
  if (!state.matches('home')) return null;

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="customers" element={<Customers />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
