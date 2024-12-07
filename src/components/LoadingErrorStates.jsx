import React from 'react';

export const LoadingState = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600">Memuat data...</p>
      </div>
    </div>
  );
};

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 my-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
          <svg 
            className="w-8 h-8 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Terjadi Kesalahan</h3>
          <p className="mt-1 text-gray-500">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
};