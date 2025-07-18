import React, { useState, useEffect } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import StartScreen from './components/StartScreen';
import ScenarioView from './components/ScenarioView';
import EndScreen from './components/EndScreen';
import ApiKeyScreen from './components/ApiKeyScreen';
import { LoadingSpinner, MoraleIcon, ProductivityIcon, CooperationIcon } from './components/icons';
import { Language } from './types';
import { initializeAi, isAiInitialized } from './services/geminiService';

const feedbackLabels: Record<Language, { morale: string, productivity: string, cooperation: string }> = {
    en: { morale: "Morale", productivity: "Productivity", cooperation: "Cooperation" },
    ko: { morale: "사기", productivity: "생산성", cooperation: "협조성" },
}

const FeedbackOverlay: React.FC<{
    feedback: { message: string; statChanges: { morale: number; productivity: number; cooperation: number } };
    language: Language;
}> = ({ feedback, language }) => {
    const { morale, productivity, cooperation } = feedback.statChanges;
    const labels = feedbackLabels[language];
    
    const renderStatChange = (val: number, Icon: React.ElementType, label: string, color: string) => {
        if (val === 0) return null;
        const sign = val > 0 ? '+' : '';
        return (
            <div className={`flex items-center gap-1 font-bold text-lg ${color}`}>
                <Icon className="w-6 h-6" />
                <span>{label}: {sign}{val}%</span>
            </div>
        );
    }
    
    return (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg text-center">
                <p className="text-slate-300 whitespace-pre-wrap mb-4">{feedback.message}</p>
                <div className="flex flex-col items-center justify-center gap-2 mt-4">
                    {renderStatChange(morale, MoraleIcon, labels.morale, morale > 0 ? 'text-green-400' : 'text-red-400')}
                    {renderStatChange(productivity, ProductivityIcon, labels.productivity, productivity > 0 ? 'text-green-400' : 'text-red-400')}
                    {renderStatChange(cooperation, CooperationIcon, labels.cooperation, cooperation > 0 ? 'text-green-400' : 'text-red-400')}
                </div>
            </div>
        </div>
    )
}

const App: React.FC = () => {
  const { gameState, isLoading, startGame, handleChoice, restartGame } = useGameLogic();
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (apiKey && !isAiInitialized()) {
      try {
        initializeAi(apiKey);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize AI with provided key:", error);
        alert("Invalid API Key. Please provide a valid key.");
        // Clear the bad key
        localStorage.removeItem('gemini-api-key');
        setApiKey(null);
        setIsInitialized(false);
      }
    } else if (isAiInitialized()) {
        setIsInitialized(true);
    }
  }, [apiKey]);

  const handleKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey(null);
    setIsInitialized(false);
    restartGame(); // Go back to start screen logic which will be intercepted
  };
  
  if (!apiKey || !isInitialized) {
      return (
         <div className="relative min-h-screen w-full flex items-center justify-center">
            <ApiKeyScreen onKeySubmit={handleKeySubmit} />
         </div>
      );
  }

  const renderContent = () => {
    switch (gameState.status) {
      case 'start_screen':
        return <StartScreen onStart={startGame} />;
      case 'in_progress':
      case 'show_feedback': // Render scenario view underneath feedback
        if (gameState.currentScenario) {
          return <ScenarioView gameState={gameState} onChoose={handleChoice} />;
        }
        // This shows while the initial scenario is loading
        return null;
      case 'end_screen':
        return <EndScreen gameState={gameState} onRestart={restartGame} onClearKey={handleClearKey} />;
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {(isLoading && gameState.status !== 'show_feedback') && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
                <LoadingSpinner className="w-12 h-12 text-sky-500 mx-auto" />
                <p className="mt-4 text-lg font-semibold">
                  {gameState.language === 'ko' ? 'AI가 생각 중입니다...' : 'AI is thinking...'}
                </p>
            </div>
        </div>
      )}
      {gameState.status === 'show_feedback' && gameState.feedback && (
         <FeedbackOverlay feedback={gameState.feedback} language={gameState.language}/>
      )}
      <div className="w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;