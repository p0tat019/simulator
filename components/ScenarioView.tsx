import React from 'react';
import { GameState, Choice } from '../types';
import AgentProfile from './AgentProfile';
import StatBar from './StatBar';

interface ScenarioViewProps {
  gameState: GameState;
  onChoose: (choice: Choice) => void;
}

const ScenarioView: React.FC<ScenarioViewProps> = ({ gameState, onChoose }) => {
  const { team, stats, currentScenario, turn, language } = gameState;

  if (!currentScenario) {
    return <div className="text-center p-8">Loading scenario...</div>;
  }
  
  const agentInFocus = team.find(agent => agent.name === currentScenario.agentInFocus);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white text-center">
          {language === 'ko' ? `턴 ${turn} / 5` : `Turn ${turn} of 5`}
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <StatBar label="Morale" value={stats.morale} />
          <StatBar label="Productivity" value={stats.productivity} />
          <StatBar label="Cooperation" value={stats.cooperation} />
        </div>
      </header>

      <main className="bg-slate-800 rounded-xl shadow-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
             {agentInFocus && <AgentProfile agent={agentInFocus} isFocus={true} />}
             <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {team.filter(a => a.name !== currentScenario.agentInFocus).map(agent => (
                    <div key={agent.name} className="bg-slate-700/50 p-3 rounded-lg flex items-center gap-3">
                         <img src={agent.avatarUrl} alt={agent.name} className="w-10 h-10 rounded-full" />
                         <div>
                            <p className="font-bold text-sm text-white">{agent.name}</p>
                            <p className="text-xs text-sky-300">{agent.personality}</p>
                         </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-sky-400 mb-2">{currentScenario.title}</h3>
            <p className="text-slate-300 mb-6 whitespace-pre-wrap">{currentScenario.description}</p>
            
            <div className="space-y-3">
              <p className="font-semibold text-white">{language === 'ko' ? "어떻게 하시겠습니까?" : "What do you do?"}</p>
              {currentScenario.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoose(choice)}
                  className="w-full text-left p-4 bg-slate-700 rounded-lg hover:bg-sky-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScenarioView;
