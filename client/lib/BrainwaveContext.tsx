import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for brainwave data
export type BrainwaveData = {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
  bpm?: number | null;
  genre?: string | null;
};

// Default brainwave data
const defaultBrainwaveData: BrainwaveData = {
  delta: 0,
  theta: 0,
  alpha: 0,
  beta: 0,
  gamma: 0,
  bpm: null,
  genre: null
};

// Create the context with a default undefined value
type BrainwaveContextType = {
  brainwaveData: BrainwaveData;
  updateBrainwaveData: (newData: Partial<BrainwaveData>) => void;
  processingStatus: 'idle' | 'loading' | 'success' | 'error';
  statusMessage: string;
  setProcessingStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
  setStatusMessage: (message: string) => void;
};

const BrainwaveContext = createContext<BrainwaveContextType | undefined>(undefined);

// Provider component
export const BrainwaveProvider = ({ children }: { children: ReactNode }) => {
  const [brainwaveData, setBrainwaveData] = useState<BrainwaveData>(defaultBrainwaveData);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Update brainwave data with partial data
  const updateBrainwaveData = (newData: Partial<BrainwaveData>) => {
    setBrainwaveData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <BrainwaveContext.Provider value={{ 
      brainwaveData, 
      updateBrainwaveData, 
      processingStatus, 
      statusMessage, 
      setProcessingStatus, 
      setStatusMessage 
    }}>
      {children}
    </BrainwaveContext.Provider>
  );
};

// Custom hook to use the brainwave context
export const useBrainwave = () => {
  const context = useContext(BrainwaveContext);
  if (context === undefined) {
    throw new Error('useBrainwave must be used within a BrainwaveProvider');
  }
  return context;
};
