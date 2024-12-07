import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg max-w-sm w-full m-4 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-4">
            Berhasil!
          </h3>
          <p className="text-gray-600 mb-6">
            {message || 'Data berhasil disimpan'}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;