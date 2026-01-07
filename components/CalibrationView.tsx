
import React, { useRef } from 'react';
import { CalibrationData } from '../types';

interface CalibrationViewProps {
  currentCalibration: CalibrationData | null;
  onCalibrate: (base64: string) => void;
  onClear: () => void;
}

const CalibrationView: React.FC<CalibrationViewProps> = ({ currentCalibration, onCalibrate, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onCalibrate(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calibração de Sensor</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Para garantir a máxima precisão nas cores, fotografe uma superfície <strong>branca pura ou cinza neutro</strong> sob a mesma iluminação que você usará para analisar suas amostras.
        </p>

        {currentCalibration ? (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={`data:image/jpeg;base64,${currentCalibration.base64}`} 
                className="w-full h-full object-cover" 
                alt="Referência de calibração"
              />
              <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Calibrado
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => inputRef.current?.click()}
                className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                Recalibrar
              </button>
              <button 
                onClick={onClear}
                className="px-6 py-4 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => inputRef.current?.click()}
            className="border-4 border-dashed border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group"
          >
            <div className="bg-gray-100 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2" />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-800">Clique para Calibrar</p>
            <p className="text-gray-500 text-sm mt-1">Capture uma folha branca agora</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
      </div>
    </div>
  );
};

export default CalibrationView;
