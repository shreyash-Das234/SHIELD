import React from "react";

const GeoMap = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Traffic by Location</h3>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between bg-gray-100 p-2 rounded"
          >
            <span>{item.country}</span>
            <span className="font-semibold">{item.requests}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeoMap;