// src/context/AppContext.jsx
import React from 'react';
import { AppContext } from './useAppContext.js';

export const AppProvider = ({ children, statesData, stateCapitals, API_KEY }) => {
  const value = {
    statesData,
    stateCapitals,
    API_KEY,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};