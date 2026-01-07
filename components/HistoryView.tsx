
import React, { useState } from 'react';
import { ColorAnalysisResult } from '../types';

interface HistoryViewProps {
  history: ColorAnalysisResult[];
  onDelete: (id: string) => void;
  onSelect: (result: ColorAnalysisResult) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onDelete, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    item.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.colorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (history.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Histórico Vazio</h3>
        <p className="text-gray-500 mt-2">As cores que você salvar aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por cliente ou cor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-12 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredHistory.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
          >
            <div className="flex h-36">
              <div className="w-1/3 h-full relative">
                <img src={item.originalImage} className="w-full h-full object-cover" alt={item.colorName} />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col mb-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Cliente</span>
                    <h4 className="font-bold text-gray-900 truncate pr-6 leading-tight">
                      {item.clientName || 'Não informado'}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    Cor: <span className="font-medium text-gray-700">{item.colorName}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(item.timestamp!).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold uppercase rounded">
                    {item.isPure ? 'Pura' : 'Mistura'}
                  </div>
                  <button 
                    onClick={() => onSelect(item)}
                    className="text-xs font-bold text-gray-800 hover:underline"
                  >
                    Ver Receita
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onDelete(item.id!)}
              className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <p className="text-center text-gray-400 mt-8 italic">Nenhum registro encontrado para esta busca.</p>
      )}
    </div>
  );
};

export default HistoryView;
