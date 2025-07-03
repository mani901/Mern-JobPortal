import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-16">
      <div
        className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
