import React from "react";

const TrafficTable = ({ data = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">Live Traffic</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">IP Address</th>
            <th className="p-3">Path</th>
            <th className="p-3">Method</th>
            <th className="p-3">Status</th>
            <th className="p-3">Time</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.ip}</td>
                <td className="p-3">{item.path}</td>
                <td className="p-3">{item.method}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No traffic data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrafficTable;