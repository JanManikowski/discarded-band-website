import React from 'react';
import ReactDOM from 'react-dom/client';
// Self-hosted fonts (no requests to Google): Cinzel for headings, menu and
// buttons (it echoes the logo's lettering), Source Sans 3 for all other text.
import '@fontsource-variable/cinzel';
import '@fontsource-variable/source-sans-3';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
