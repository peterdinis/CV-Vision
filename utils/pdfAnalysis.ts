import { AnalysisResult } from "@/types/heroTypes";

export const parseAnalysis = (text: string): AnalysisResult => {
  const prosMatch = text.match(/Pros:\s*([\s\S]*?)(?=Cons:|Tips:|$)/i);
  const consMatch = text.match(/Cons:\s*([\s\S]*?)(?=Pros:|Tips:|$)/i);
  const tipsMatch = text.match(/Tips:\s*([\s\S]*?)(?=Pros:|Cons:|$)/i);

  const extractList = (block?: string) =>
    block
      ? block
          .split('\n')
          .map((line) => line.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean)
      : [];

  return {
    pros: extractList(prosMatch?.[1]),
    cons: extractList(consMatch?.[1]),
    tips: extractList(tipsMatch?.[1]),
  };
};