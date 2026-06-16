import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import OneLastSmilePage from './pages/OneLastSmilePage.jsx';
import OneLastSmileCaseStudy from './pages/OneLastSmileCaseStudy.jsx';
import OneLastSmileShowcase from './pages/OneLastSmileShowcase.jsx';
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { AtmosphereProvider } from './context/AtmosphereContext.jsx';
import { PuzzleProvider } from './context/PuzzleContext.jsx';
import AtmosphereLayer from './components/AtmosphereLayer.jsx';
import PuzzleReveal from './components/PuzzleReveal.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AtmosphereProvider>
        <PuzzleProvider>
          {/* INFO-004: Analytics moved inside BrowserRouter for consistent route tracking */}
          <BrowserRouter>
            <Analytics />
            <ScrollToTop />
            <AtmosphereLayer />
            <PuzzleReveal />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/onelastsmile" element={<OneLastSmilePage />} />
              <Route path="/journey/onelastsmile" element={<OneLastSmileShowcase />} />
              <Route path="/case-study/onelastsmile" element={<OneLastSmileCaseStudy />} />
              {/* BUG-013: Real 404 page instead of silently rendering App */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PuzzleProvider>
      </AtmosphereProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silent failure — PWA is an enhancement, not required
    });
  });
}
