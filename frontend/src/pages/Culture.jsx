import { useState } from "react";
import cultureData from "../data/cultureData.json";
import { FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE_CULTURE = 6; // Adjust as needed

export default function Culture() {
  const { indian_culture } = cultureData;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(indian_culture.cultural_elements[0].name);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const activeSection = indian_culture.cultural_elements.find(
    (sec) => sec.name === activeTab
  );

  const filteredItems = activeSection.data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for culture
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE_CULTURE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE_CULTURE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE_CULTURE);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 hidden sm:block">
          🎭 Indian Culture
        </h1>
        {/* Search Bar */}
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="text-gray-600 mb-8 leading-relaxed text-center max-w-3xl mx-auto space-y-4">
        <p>{indian_culture.definition}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {indian_culture.cultural_elements.map((section) => (
          <button
            key={section.name}
            onClick={() => {
              setActiveTab(section.name);
              setSearchTerm("");
              setCurrentPage(1); // Reset to first page on tab change
            }}
            className={`px-4 py-2 rounded-full font-medium transition 
              ${activeTab === section.name 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {activeSection.name}
        </h2>
        {currentItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No items found for "{searchTerm}".
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {currentItems.map((item, i) => (
              <div
                key={i}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {item.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal / Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="rounded-lg mb-4 w-full object-cover"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
            <p className="text-gray-700">{selectedItem.why}</p>
            <p className="text-gray-500 text-sm mt-3 italic">
              📅 {selectedItem.when}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}