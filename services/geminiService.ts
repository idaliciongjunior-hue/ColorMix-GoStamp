
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const SYSTEM_PROMPT = `Você é um especialista em ciência das cores e técnico de impressão industrial especializado em tintas para polietileno (PE).
Sua tarefa é analisar a cor de um ponto específico selecionado pelo usuário e determinar as cores de tinta exatas, porcentagens de mistura e a correspondência Pantone.

REGRAS DE ANÁLISE:
1. O usuário fornecerá uma imagem completa e uma "amostra aproximada" (patch) do ponto exato que ele deseja reproduzir.
2. Forneça um código hexadecimal (hexCode) que melhor represente a cor final observada.
3. IDENTIFICAÇÃO PANTONE: Forneça o código Pantone (Solid Coated) mais próximo da cor analisada (ex: Pantone 485 C).
4. Use a imagem de calibração (se houver) para balanço de branco.
5. Ignore brilhos especulares e foque na cor base do pigmento no ponto indicado.
6. Determine se a cor no ponto é PURA ou MISTURADA.
7. RESTRICÇÃO DE CORES: Baseie a composição EXCLUSIVAMENTE nas seguintes cores base:
   - Branco
   - Preto
   - Amarelo
   - Vermelho
   - Azul
   Não utilize outras cores como Verde, Laranja ou Violeta na formulação; estas devem ser obtidas através da mistura das 5 bases acima.
8. O Branco é fundamental para opacidade em PE.
9. As porcentagens devem somar 100%.

SAÍDA:
Retorne um objeto JSON seguindo o esquema. Responda em Português do Brasil.`;

export const analyzeColorFromImage = async (
  targetBase64: string, 
  calibrationBase64?: string,
  samplePatchBase64?: string
): Promise<GeminiResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: targetBase64,
      },
    }
  ];

  if (samplePatchBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: samplePatchBase64,
      },
    });
    parts.push({
      text: "A imagem acima é um zoom do ponto exato que selecionei. Analise especificamente esta cor para a mistura de tintas PE e identifique o Pantone.",
    });
  }

  if (calibrationBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: calibrationBase64,
      },
    });
    parts.push({
      text: "Use esta referência de calibração para ajustar o balanço de cores antes de analisar o ponto selecionado.",
    });
  }

  parts.push({
    text: "Forneça a receita técnica de tinta para polietileno para a cor selecionada, utilizando apenas as bases: Branco, Preto, Amarelo, Vermelho e Azul. Identifique também o código Pantone correspondente e inclua um código hexadecimal representativo.",
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                colorName: { type: Type.STRING },
                hexCode: { type: Type.STRING, description: "Código hexadecimal da cor (ex: #FF5733)" },
                pantone: { type: Type.STRING, description: "Código Pantone correspondente (ex: Pantone 286 C)" },
                isPure: { type: Type.BOOLEAN },
                mixingRecipe: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      baseColor: { type: Type.STRING },
                      percentage: { type: Type.NUMBER }
                    },
                    required: ["baseColor", "percentage"]
                  }
                },
                totalPercentage: { type: Type.NUMBER }
              },
              required: ["colorName", "isPure", "hexCode", "pantone"]
            }
          }
        },
        required: ["results"]
      }
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data as GeminiResponse;
  } catch (error) {
    console.error("Erro ao analisar:", error);
    throw new Error("Erro na interpretação técnica da cor.");
  }
};
