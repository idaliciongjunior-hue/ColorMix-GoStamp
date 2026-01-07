
import React, { useRef, useState } from 'react';

interface ImageSelectorProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageSelected(base64.split(',')[1]); // Remove data:image/jpeg;base64,
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Camera Option */}
        <button
          disabled={isLoading}
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">Tirar Foto</span>
          <p className="text-sm text-gray-500 text-center mt-1">Capture a cor diretamente com sua câmera</p>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </button>

        {/* Upload Option */}
        <button
          disabled={isLoading}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">Carregar Imagem</span>
          <p className="text-sm text-gray-500 text-center mt-1">Envie uma foto da sua galeria</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </button>
      </div>
    </div>
  );
};

export default ImageSelector;
