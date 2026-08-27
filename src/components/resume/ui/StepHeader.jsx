import React from "react";

const StepHeader = ({ title, description }) => {
  return (
    <div className="mb-8 border-b border-gray-100 pb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-2 text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StepHeader;
