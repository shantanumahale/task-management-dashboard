import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import Dashboard from './pages/Dashboard';
import StatusPage from './pages/StatusPage';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/status/:status" element={<StatusPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
