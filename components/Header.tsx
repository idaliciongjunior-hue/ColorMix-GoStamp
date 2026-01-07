
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-6 px-4 shadow-sm mb-8">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="bg-gray-800 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">ColorMix GoStamp</h1>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Laboratório de Tintas para Polietileno</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
