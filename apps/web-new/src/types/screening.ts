// Shared types for mental health screening components

export interface ScreeningResult {
  totalScore: number;
  answers: number[];
  interpretation: string;
  severity: string;
  recommendations: string[];
  screeningType?: 'PHQ-9' | 'GAD-7' | 'GHQ-12';
}

export interface Question {
  id: number;
  text: string;
  textTamil?: string;
  textHindi?: string;
}

export interface ScreeningOption {
  value: number;
  label: string;
  tamil: string;
  hindi: string;
}

export interface ScreeningProps {
  language?: string;
  onComplete: (result: ScreeningResult) => void;
  onCancel?: () => void;
}