import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Erro na renderização:", error);
  root.render(
    <div className="p-4 text-red-500">
      <h1>Erro na aplicação</h1>
      <p>{error.message}</p>
    </div>
  );
}