import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import './index.css';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
