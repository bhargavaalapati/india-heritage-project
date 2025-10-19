// src/hooks/useAnimateOnce.js

import { useState, useEffect } from 'react';

/**
 * A custom hook to determine if a component should animate.
 * Animation only runs once per browser session for a given key.
 * @param {string} key - A unique key to identify the component in sessionStorage.
 * @returns {boolean} - Returns true if the component should animate, false otherwise.
 */
const useAnimateOnce = (key) => {
  const sessionKey = `hasAnimated_${key}`;

  // Check sessionStorage only on the initial render to decide if we should animate.
  const getInitialState = () => {
    // If the flag is NOT set in sessionStorage, we should animate.
    return !sessionStorage.getItem(sessionKey);
  };

  const [shouldAnimate, setShouldAnimate] = useState(getInitialState);

  // After the component has rendered (and animated), set the flag
  // in sessionStorage so it doesn't animate again.
  useEffect(() => {
    if (shouldAnimate) {
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [shouldAnimate, sessionKey]);

  return shouldAnimate;
};

export default useAnimateOnce;