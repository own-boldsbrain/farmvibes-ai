import { atom } from 'jotai';

export const mmgdCapacityAtom = atom<number>(9.0);

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources: Array<{ uri: string; title: string }>;
}

export const terminalHistoryAtom = atom<ChatMessage[]>([
  { 
    role: 'model', 
    text: 'Sistema de IA Gemini Online. Digite uma consulta técnica ou use os atalhos abaixo para iniciar a auditoria do SIN.',
    sources: [] 
  }
]);

export const activeScenarioReportAtom = atom<string | null>(null);
export const promptInputAtom = atom<string>('');
export const useGoogleGroundingAtom = atom<boolean>(true);
export const isAiGeneratingAtom = atom<boolean>(false);
export const isScenarioReportGeneratingAtom = atom<boolean>(false);
