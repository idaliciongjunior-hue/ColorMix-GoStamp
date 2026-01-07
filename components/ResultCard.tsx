
import React, { useState } from 'react';
import { ColorAnalysisResult } from '../types';

interface ResultCardProps {
  result: ColorAnalysisResult;
  onSave?: (result: ColorAnalysisResult) => void;
  isSaved?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onSave, isSaved }) => {
  const [clientName, setClientName] = useState('');

  const handleSave = () => {
    if (onSave) {
      onSave({ ...result, clientName: clientName.trim() || 'Cliente não identificado' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto w-full">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Análise Técnica</h3>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              🎯 {result.colorName}
              {result.pantone && (
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono font-bold border border-gray-200">
                  {result.pantone}
                </span>
              )}
            </h2>
          </div>
        </div>

        {!isSaved && onSave && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <label htmlFor="clientName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Identificar para Histórico
            </label>
            <div className="flex gap-2">
              <input
                id="clientName"
                type="text"
                placeholder="Nome do Cliente (ex: Gráfica ABC)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
              />
              <button 
                onClick={handleSave}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-900 transition-all flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Salvar Cor
              </button>
            </div>
          </div>
        )}

        {isSaved && (
          <div className="mb-6 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold">Esta cor já está salva no seu histórico.</span>
          </div>
        )}

        {result.isPure ? (
          <div className="bg-gray-50 border-l-4 border-gray-800 p-6 rounded-r-xl mb-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Tipo: Cor pura para polietileno</p>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  🖨️ Não é necessária mistura de tintas. Utilize a tinta padrão direto do reservatório.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧪</span>
                <h4 className="text-lg font-bold text-gray-900">Mistura recomendada (tinta para polietileno):</h4>
              </div>
              
              <div className="space-y-3">
                {result.mixingRecipe?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-800 text-lg uppercase tracking-wide">
                       - {item.baseColor}
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-xl">{item.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center px-2">
                <span className="text-gray-500 font-bold uppercase text-sm tracking-widest">📌 Total da Formulação</span>
                <span className="text-2xl font-black text-gray-900">100%</span>
              </div>
            </div>
          </div>
        )}

        {/* Pré-visualização da Cor Final */}
        {result.hexCode && (
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Amostra Visual da Cor Final</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div 
                className="w-full sm:w-32 h-24 rounded-xl shadow-inner border border-black/5"
                style={{ backgroundColor: result.hexCode }}
              ></div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gray-900 font-bold text-lg">{result.colorName}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <code className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-mono">
                    {result.hexCode}
                  </code>
                  {result.pantone && (
                    <code className="text-xs bg-gray-800 text-white px-2 py-1 rounded font-mono font-bold">
                      {result.pantone}
                    </code>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Esta é uma representação digital aproximada da cor final no polietileno.</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-100 rounded-xl flex items-start gap-3 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            * Nota: As porcentagens são calculadas considerando a opacidade do pigmento e o comportamento da resina de polietileno. Recomenda-se um teste em pequena escala antes da produção total.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
