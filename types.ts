
export interface MixingRecipeItem {
  baseColor: string;
  percentage: number;
}

export interface ColorAnalysisResult {
  id?: string;
  colorName: string;
  hexCode?: string; // Código hexadecimal para visualização
  pantone?: string; // Código Pantone correspondente
  clientName?: string;
  isPure: boolean;
  mixingRecipe?: MixingRecipeItem[];
  totalPercentage?: number;
  timestamp?: number;
  originalImage?: string;
}

export interface GeminiResponse {
  results: ColorAnalysisResult[];
}

export interface CalibrationData {
  base64: string;
  timestamp: number;
}
