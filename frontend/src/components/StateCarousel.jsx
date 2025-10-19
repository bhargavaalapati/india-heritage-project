// src/components/StateCarousel.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const StateCarousel = ({ stateData, onClose, weatherData, isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`
      fixed inset-0 flex flex-col justify-end items-center z-[1000] transition-opacity duration-500
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div 
        className={`
          relative w-full transition-all duration-500 ease-in-out
          ${isExpanded ? 'h-full' : 'h-[50vh]'}
        `}
      >
        <div className="absolute top-0 w-full h-full flex flex-col rounded-t-3xl shadow-2xl bg-white p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{stateData?.name || "State Details"}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {isExpanded ? "Minimize" : "Expand"}
              </button>
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
              >
                ✕
              </button>
            </div>
          </div>
          
          {weatherData && (
            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-lg my-4">
              <h3 className="text-xl font-semibold">{weatherData.name} Weather</h3>
              <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
              <p>Condition: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
          )}

          <Swiper
            direction="vertical"
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            modules={[Navigation, Pagination, Keyboard, Mousewheel]}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {stateData?.carousel.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div 
                  className="w-full h-full bg-cover bg-center text-white relative"
                  style={{ backgroundImage: `url(${item.src})` }}
                >
                  <div className="absolute inset-0 p-4 bg-black bg-opacity-40 flex flex-col justify-end">
                    <p className="text-lg font-semibold">{item.caption}</p>
                    <p className="text-sm">{stateData.summary}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default StateCarousel;