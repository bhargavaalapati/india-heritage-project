import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import indiaGeo from "../IndianData/Indian_States.json";

import { MapContainer, ZoomControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const idToAbbreviation = {
  "1": "AN", "2": "AP", "3": "AR", "4": "AS", "5": "BR", "6": "CH", "7": "CT",
  "8": "DN", "9": "DD", "10": "DL", "11": "GA", "12": "GJ", "13": "HR", "14": "HP",
  "15": "JK", "16": "JH", "17": "KA", "18": "KL", "19": "LD", "20": "MP", "21": "MH",
  "22": "MN", "23": "ML", "24": "MZ", "25": "NL", "26": "OR", "27": "PY", "28": "PB",
  "29": "RJ", "30": "SK", "31": "TN", "32": "TS", "33": "TR", "34": "UP", "35": "UK",
  "36": "WB", "37": "LA"
};

const stateColors = {
    "Andaman and Nicobar": "#f87171",
    "Andhra Pradesh": "#60a5fa",
    "Arunachal Pradesh": "#34d399",
    "Assam": "#facc15",
    "Bihar": "#9333ea",
    "Chandigarh": "#f472b6",
    "Chhattisgarh": "#14b8a6",
    "Dadra and Nagar Haveli and Daman and Diu": "#f97316",
    "Delhi": "#e5e7eb",
    "Goa": "#a3e635",
    "Gujarat": "#34d399",
    "Haryana": "#f87171",
    "Himachal Pradesh": "#60a5fa",
    "Jammu and Kashmir": "#e5e7eb",
    "Jharkhand": "#facc15",
    "Karnataka": "#9333ea",
    "Kerala": "#f472b6",
    "Lakshadweep": "#14b8a6",
    "Madhya Pradesh": "#f97316",
    "Maharashtra": "#a3e635",
    "Manipur": "#34d399",
    "Meghalaya": "#60a5fa",
    "Mizoram": "#f87171",
    "Nagaland": "#9333ea",
    "Odisha": "#f472b6",
    "Puducherry": "#facc15",
    "Punjab": "#a3e635",
    "Rajasthan": "#3b82f6",
    "Sikkim": "#f97316",
    "Tamil Nadu": "#22c55e",
    "Telangana": "#f87171",
    "Tripura": "#60a5fa",
    "Uttar Pradesh": "#9333ea",
    "Uttarakhand": "#facc15",
    "West Bengal": "#f472b6",
    "Daman and Diu": "#e5e7eb",
    "Ladakh": "#60a5fa",
};

const IndiaMap = ({ onStateHover, onStateLeave, hoveredStateName, hoveredStateWeather, mousePosition }) => {
  const [geoData, setGeoData] = useState(null);
  const navigate = useNavigate();
  const [isHoveringDisabled, setIsHoveringDisabled] = useState(false);
  const disabledStates = ["OR"];

  const [zoom, setZoom] = useState(1);
  const initialLeafletZoom = 5;

  const MapEvents = () => {
    const map = useMapEvents({
      zoomend: () => {
        const newZoom = Math.pow(2, map.getZoom() - initialLeafletZoom);
        setZoom(newZoom);
      },
    });
    return null;
  };

  useEffect(() => {
    setGeoData(indiaGeo);
  }, []);

  const handleHoverStart = (geo, e) => {
    const stateName = geo.properties.NAME_1;
    const stateId = idToAbbreviation[geo.properties.ID_1];
    const isDisabled = disabledStates.includes(stateId);

    setIsHoveringDisabled(isDisabled);

    if (isDisabled) {
      onStateHover(null, stateName);
      gsap.to(e.target, { scale: 1.05, zIndex: 10, duration: 0.2 });
    } else {
      onStateHover(stateId, stateName);
      gsap.to(e.target, { scale: 1.05, fill: "#3b82f6", zIndex: 10, duration: 0.2 });
    }
  };
  
  const handleHoverEnd = (e, stateName, isDisabled) => {
    onStateLeave();
    setIsHoveringDisabled(false);

    gsap.to(e.target, {
      scale: 1,
      fill: isDisabled ? "#d1d5db" : stateColors[stateName] || "#e5e7eb",
      zIndex: 1,
      duration: 0.2,
    });
  };

  const handleStateClick = (geo) => {
    const stateId = idToAbbreviation[geo.properties.ID_1];
    navigate(`/state/${stateId}`);
  };

  if (!geoData) {
    return <div className="text-center p-6 text-gray-500">Loading map...</div>;
  }

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center"
      onMouseLeave={onStateLeave}
    >
      {hoveredStateName && (
        <div
          className="fixed z-[2000] p-3 bg-white shadow-lg rounded-md pointer-events-none transition-transform duration-100"
          style={{ top: mousePosition.y + 10, left: mousePosition.x + 10 }}
        >
          <h4 className="font-bold text-lg">{hoveredStateName}</h4>
          {isHoveringDisabled ? (
            <p>This state page is coming soon!</p>
          ) : hoveredStateWeather ? (
            <div>
              <p>Temp: {Math.round(hoveredStateWeather.main.temp)}°C</p>
              <p>Condition: {hoveredStateWeather.weather[0].description}</p>
            </div>
          ) : (
            <p>Fetching weather...</p>
          )}
        </div>
      )}
      
      <MapContainer
        center={[22.5, 82.8]}
        zoom={initialLeafletZoom}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        attributionControl={false}
      >
        <MapEvents />
        <ZoomControl position="topright" />
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1000, center: [82.8, 22.5] }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup center={[82.8, 22.5]} zoom={zoom}>
                <Geographies geography={indiaGeo}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const stateId = idToAbbreviation[geo.properties.ID_1];
                      const isDisabled = disabledStates.includes(stateId);
                      const stateName = geo.properties.NAME_1;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => !isDisabled && handleStateClick(geo)}
                          onMouseEnter={(e) => handleHoverStart(geo, e)}
                          onMouseLeave={(e) => handleHoverEnd(e, stateName, isDisabled)}
                          style={{
                            default: {
                              fill: isDisabled ? "#d1d5db" : stateColors[stateName] || "#e5e7eb",
                              stroke: "#9ca3af",
                              strokeWidth: 0.5,
                              outline: "none",
                              cursor: isDisabled ? "not-allowed" : "pointer",
                            },
                            pressed: {
                              fill: "#1d4ed8",
                              outline: "none"
                            },
                            // --- This line is added to handle the focus outline ---
                            focus: {
                              outline: "none"
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
        </div>
      </MapContainer>
    </div>
  );
};

export default IndiaMap;