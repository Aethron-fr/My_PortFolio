import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import OneLastSmilePage from './pages/OneLastSmilePage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { AtmosphereProvider } from './context/AtmosphereContext.jsx';
import AtmosphereLayer from './components/AtmosphereLayer.jsx';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AtmosphereProvider>
        <BrowserRouter>
          <AtmosphereLayer />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/onelastsmile" element={<OneLastSmilePage />} />
            <Route path="*" element={<App />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </AtmosphereProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
