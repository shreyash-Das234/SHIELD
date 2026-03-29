import React from "react";

const LogsTable = ({ data = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">Security Logs</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Type</th>
            <th className="p-3">Message</th>
            <th className="p-3">Severity</th>
            <th className="p-3">Time</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((log, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{log.type}</td>
                <td className="p-3">{log.message}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      log.severity === "high"
                        ? "bg-red-500"
                        : log.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {log.severity}
                  </span>
                </td>
                <td className="p-3">{log.time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No logs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;