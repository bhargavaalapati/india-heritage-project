// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 
import statesData from './data/statesData.json';
import stateCapitals from './data/stateCapitals.json';
import './index.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- It's often better to have the router outside the providers */}
      <AuthProvider> {/* <-- 2. WRAP WITH AUTHPROVIDER */}
        <AppProvider statesData={statesData} stateCapitals={stateCapitals} API_KEY={API_KEY}>
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);