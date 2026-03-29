import React from "react";
import Button from "../common/Button";

const BlockedIPsTable = ({ data = [], onUnblock }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">Blocked IPs</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">IP Address</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Blocked At</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.ip}</td>
                <td className="p-3">{item.reason}</td>
                <td className="p-3">{item.blockedAt}</td>
                <td className="p-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onUnblock(item.ip)}
                  >
                    Unblock
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No blocked IPs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BlockedIPsTable;