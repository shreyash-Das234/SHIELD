import React from "react";

const Card = ({ children, title, extra }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border">
      {title && (
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {extra && <div>{extra}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};

export default Card;