// src/utils/weather.js
const weatherCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetchWeather = async (cityName, API_KEY) => {
  if (weatherCache[cityName] && (Date.now() - weatherCache[cityName].timestamp < CACHE_DURATION)) {
    //console.log("Fetching from cache:", cityName);
    return weatherCache[cityName].data;
  }

  if (!cityName || !API_KEY) return null;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    if (response.ok) {
      const data = await response.json();
      weatherCache[cityName] = { data, timestamp: Date.now() };
      return data;
    }
  } catch (err) {
    console.error("Error fetching weather:", err.message);
  }
  return null;
};