import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import OneLastSmilePage from './pages/OneLastSmilePage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { AtmosphereProvider } from './context/AtmosphereContext.jsx';
import { PuzzleProvider } from './context/PuzzleContext.jsx';
import AtmosphereLayer from './components/AtmosphereLayer.jsx';
import PuzzleReveal from './components/PuzzleReveal.jsx';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AtmosphereProvider>
        <PuzzleProvider>
          <BrowserRouter>
            <AtmosphereLayer />
            <PuzzleReveal />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/onelastsmile" element={<OneLastSmilePage />} />
              <Route path="*" element={<App />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </PuzzleProvider>
      </AtmosphereProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
