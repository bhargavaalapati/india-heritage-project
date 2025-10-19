// src/components/SkeletonLoader.jsx
import React from "react";

const SkeletonLoader = ({ type = "card" }) => {
  switch (type) {
    case "page":
      return (
        <div className="p-6 w-full animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-48 bg-gray-300 rounded-lg mt-6"></div>
        </div>
      );

    case "card":
    default:
      return (
        <div className="p-4 border rounded-lg shadow animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 rounded mt-4"></div>
        </div>
      );
  }
};

export default SkeletonLoader;
