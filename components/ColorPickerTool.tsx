
import React, { useRef, useState, useEffect } from 'react';

interface ColorPickerToolProps {
  imageSrc: string;
  onPointSelected: (patchBase64: string) => void;
  isLoading: boolean;
}

const ColorPickerTool: React.FC<ColorPickerToolProps> = ({ imageSrc, onPointSelected, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magnifierCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, show: false });

  // Magnifier config
  const ZOOM = 3;
  const MAGNIFIER_SIZE = 120;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Adjust canvas to container width keeping aspect ratio
      const containerWidth = containerRef.current?.offsetWidth || 400;
      const scale = containerWidth / img.width;
      canvas.width = containerWidth;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [imageSrc]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPicking || isLoading) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, show: true });
    updateMagnifier(x, y);
  };

  const updateMagnifier = (x: number, y: number) => {
    const magCanvas = magnifierCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!magCanvas || !mainCanvas) return;
    const magCtx = magCanvas.getContext('2d');
    if (!magCtx) return;

    magCtx.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
    
    // Draw zoomed area
    const sourceSize = MAGNIFIER_SIZE / ZOOM;
    magCtx.drawImage(
      mainCanvas,
      x - sourceSize / 2,
      y - sourceSize / 2,
      sourceSize,
      sourceSize,
      0,
      0,
      MAGNIFIER_SIZE,
      MAGNIFIER_SIZE
    );

    // Draw crosshair
    magCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    magCtx.lineWidth = 1;
    magCtx.beginPath();
    magCtx.moveTo(MAGNIFIER_SIZE / 2, 0);
    magCtx.lineTo(MAGNIFIER_SIZE / 2, MAGNIFIER_SIZE);
    magCtx.moveTo(0, MAGNIFIER_SIZE / 2);
    magCtx.lineTo(MAGNIFIER_SIZE, MAGNIFIER_SIZE / 2);
    magCtx.stroke();
    
    // Inner dot
    magCtx.fillStyle = 'red';
    magCtx.beginPath();
    magCtx.arc(MAGNIFIER_SIZE / 2, MAGNIFIER_SIZE / 2, 2, 0, Math.PI * 2);
    magCtx.fill();
  };

  const handlePointClick = () => {
    if (!isPicking || isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a high-res patch for the AI (200x200 pixels around the point)
    const patchSize = 150;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = patchSize;
    tempCanvas.height = patchSize;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(
      canvas,
      mousePos.x - patchSize / 2,
      mousePos.y - patchSize / 2,
      patchSize,
      patchSize,
      0,
      0,
      patchSize,
      patchSize
    );

    const base64 = tempCanvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    onPointSelected(base64);
    setIsPicking(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div 
        ref={containerRef}
        className={`relative cursor-crosshair rounded-3xl overflow-hidden border-4 border-white shadow-2xl transition-all ${isPicking ? 'ring-4 ring-gray-800 ring-offset-4' : ''}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setMousePos(p => ({ ...p, show: false }))}
        onClick={handlePointClick}
      >
        <canvas ref={canvasRef} className="block w-full h-auto" />
        
        {isPicking && mousePos.show && (
          <div 
            className="absolute pointer-events-none rounded-full border-4 border-white shadow-xl overflow-hidden"
            style={{
              left: mousePos.x - MAGNIFIER_SIZE / 2,
              top: mousePos.y - MAGNIFIER_SIZE - 20, // Offset above the point
              width: MAGNIFIER_SIZE,
              height: MAGNIFIER_SIZE,
              zIndex: 100
            }}
          >
            <canvas 
              ref={magnifierCanvasRef} 
              width={MAGNIFIER_SIZE} 
              height={MAGNIFIER_SIZE} 
            />
          </div>
        )}

        {isPicking && (
          <div className="absolute top-4 left-4 right-4 bg-gray-900/80 text-white py-2 px-4 rounded-full text-center text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            Clique no ponto exato para extrair a cor
          </div>
        )}
      </div>

      <div className="flex gap-3 w-full max-w-md">
        {!isPicking ? (
          <button
            onClick={() => setIsPicking(true)}
            disabled={isLoading}
            className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Usar Conta-gotas
          </button>
        ) : (
          <button
            onClick={() => setIsPicking(false)}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all shadow-md"
          >
            Cancelar Seleção
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorPickerTool;
