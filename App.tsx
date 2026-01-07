
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageSelector from './components/ImageSelector';
import ResultCard from './components/ResultCard';
import CalibrationView from './components/CalibrationView';
import HistoryView from './components/HistoryView';
import ColorPickerTool from './components/ColorPickerTool';
import { analyzeColorFromImage } from './services/geminiService';
import { GeminiResponse, ColorAnalysisResult, CalibrationData } from './types';

type Tab = 'analyze' | 'history' | 'calibrate';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('analyze');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Persistence
  const [history, setHistory] = useState<ColorAnalysisResult[]>([]);
  const [calibration, setCalibration] = useState<CalibrationData | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('colormix_history');
    const savedCalibration = localStorage.getItem('colormix_calibration');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedCalibration) setCalibration(JSON.parse(savedCalibration));
  }, []);

  const saveToHistory = (result: ColorAnalysisResult) => {
    const newHistory = [
      { 
        ...result, 
        id: crypto.randomUUID(), 
        timestamp: Date.now(),
        originalImage: selectedImage!
      },
      ...history
    ];
    setHistory(newHistory);
    localStorage.setItem('colormix_history', JSON.stringify(newHistory));
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('colormix_history', JSON.stringify(newHistory));
  };

  const handleCalibrate = (base64: string) => {
    const data = { base64, timestamp: Date.now() };
    setCalibration(data);
    localStorage.setItem('colormix_calibration', JSON.stringify(data));
    setActiveTab('analyze');
  };

  const clearCalibration = () => {
    setCalibration(null);
    localStorage.removeItem('colormix_calibration');
  };

  const processImageAnalysis = async (targetBase64: string, patchBase64?: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeColorFromImage(targetBase64, calibration?.base64, patchBase64);
      setAnalysis(result);
    } catch (err: any) {
      setError('Ocorreu um erro ao analisar a cor. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = async (base64: string) => {
    const fullImg = `data:image/jpeg;base64,${base64}`;
    setSelectedImage(fullImg);
    // Initial analysis uses the whole image as dominant color
    processImageAnalysis(base64);
  };

  const handlePointPicked = (patchBase64: string) => {
    if (!selectedImage) return;
    const fullBase64 = selectedImage.split(',')[1];
    processImageAnalysis(fullBase64, patchBase64);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
  };

  const selectHistoryItem = (item: ColorAnalysisResult) => {
    setSelectedImage(item.originalImage!);
    setAnalysis({ results: [item] });
    setActiveTab('analyze');
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4">
        {activeTab === 'analyze' && (
          <>
            {!selectedImage && (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Análise de Cores
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Capture ou envie uma imagem para receber a formulação de tintas para polietileno.
                </p>
                {calibration && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-bold">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                    Calibração Ativa
                  </div>
                )}
              </div>
            )}

            <div className="space-y-8">
              {!selectedImage && (
                <ImageSelector onImageSelected={handleImageSelected} isLoading={isLoading} />
              )}

              {selectedImage && (
                <div className="flex flex-col items-center space-y-8">
                  <div className="w-full max-w-2xl relative">
                    <ColorPickerTool 
                      imageSrc={selectedImage} 
                      onPointSelected={handlePointPicked}
                      isLoading={isLoading}
                    />
                    {!isLoading && (
                      <button
                        onClick={handleReset}
                        className="absolute -top-4 -right-4 bg-white text-gray-500 rounded-full p-2 shadow-xl border border-gray-100 hover:bg-gray-100 transition-colors z-20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {isLoading && (
                    <div className="w-full max-w-2xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-gray-800 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Processando Amostra...</h3>
                      <p className="text-gray-500 mt-2 max-w-xs">Extraindo dados técnicos do ponto selecionado.</p>
                    </div>
                  )}

                  {error && (
                    <div className="w-full bg-red-50 border border-red-200 p-6 rounded-2xl text-red-700 flex items-center gap-3">
                      <span>{error}</span>
                      <button onClick={handleReset} className="ml-auto font-bold underline">Tentar novamente</button>
                    </div>
                  )}

                  {analysis && analysis.results.map((res, i) => (
                    <ResultCard 
                      key={i} 
                      result={res} 
                      onSave={saveToHistory} 
                      isSaved={history.some(h => h.timestamp === res.timestamp || (res.id && h.id === res.id))} 
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <HistoryView history={history} onDelete={deleteFromHistory} onSelect={selectHistoryItem} />
        )}

        {activeTab === 'calibrate' && (
          <CalibrationView 
            currentCalibration={calibration} 
            onCalibrate={handleCalibrate} 
            onClear={clearCalibration} 
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex justify-around items-center z-50">
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'analyze' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Analisar</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Histórico</span>
        </button>

        <button 
          onClick={() => setActiveTab('calibrate')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'calibrate' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Calibrar</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
