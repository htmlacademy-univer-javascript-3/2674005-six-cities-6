import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { offers } from './mocks/offers';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App offers={offers} />
    </React.StrictMode>
  );
}
