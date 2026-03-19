// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GeneralPages } from './utils/pageLinks';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {GeneralPages.map(({ component: Component, path }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;