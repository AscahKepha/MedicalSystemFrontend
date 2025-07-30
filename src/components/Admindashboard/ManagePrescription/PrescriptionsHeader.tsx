// src/components/prescriptions/PrescriptionsHeader.tsx
import React from 'react';

interface PrescriptionsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PrescriptionsHeader: React.FC<PrescriptionsHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <>
      <h1 className="text-4xl font-extrabold text-center text-green-500 mb-8">
        <i className="fas fa-prescription-bottle-alt mr-3 text-green-500"></i>
        Prescriptions Administration
      </h1>
      <div className="flex justify-end items-center mb-6">
        <input
          type="text"
          placeholder="Search prescriptions by notes or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 w-full sm:max-w-xs"
        />
      </div>
    </>
  );
};

export default PrescriptionsHeader;