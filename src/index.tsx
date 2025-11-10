import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import './index.css';

const OFFERS_COUNT = 5;

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App offersCount={OFFERS_COUNT} />
    </React.StrictMode>
  );
}
