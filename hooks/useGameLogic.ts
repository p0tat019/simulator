import { useState, useCallback } from 'react';
import { GameState, Choice, Difficulty, Language } from '../types';
import { INITIAL_TEAM, INITIAL_STATS, MAX_TURNS } from '../constants';
import { getInitialScenario, processPlayerChoice } from '../services/geminiService';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'start_screen',
    team: INITIAL_TEAM,
    stats: INITIAL_STATS,
    currentScenario: null,
    turn: 0,
    feedback: null,
    language: 'en',
    difficulty: 'normal'
  });
  const [isLoading, setIsLoading] = useState(false);

  const startGame = useCallback(async (options: { language: Language; difficulty: Difficulty }) => {
    setIsLoading(true);

    let initialCooperation = 70;
    if (options.difficulty === 'easy') initialCooperation = 85;
    if (options.difficulty === 'hard') initialCooperation = 55;

    const startingStats = { ...INITIAL_STATS, cooperation: initialCooperation };

    setGameState({
        status: 'in_progress',
        team: INITIAL_TEAM,
        stats: startingStats,
        currentScenario: null,
        turn: 1,
        feedback: null,
        language: options.language,
        difficulty: options.difficulty
    });
    const firstScenario = await getInitialScenario(INITIAL_TEAM, startingStats, options.language);
    setGameState(prev => ({ ...prev, currentScenario: firstScenario }));
    setIsLoading(false);
  }, []);

  const handleChoice = useCallback(async (choice: Choice) => {
    if (!gameState.currentScenario) return;
    setIsLoading(true);

    const result = await processPlayerChoice(
      gameState.team,
      gameState.stats,
      gameState.currentScenario,
      choice,
      gameState.turn,
      MAX_TURNS,
      gameState.language
    );

    const newMorale = Math.max(0, Math.min(100, gameState.stats.morale + result.statChanges.morale));
    const newProductivity = Math.max(0, Math.min(100, gameState.stats.productivity + result.statChanges.productivity));
    const newCooperation = Math.max(0, Math.min(100, gameState.stats.cooperation + result.statChanges.cooperation));
    
    // Show feedback first
    setGameState(prev => ({
        ...prev,
        status: 'show_feedback',
        feedback: {
            message: `${result.agentResponse}\n\n${result.feedback}`,
            statChanges: result.statChanges
        },
        stats: { morale: newMorale, productivity: newProductivity, cooperation: newCooperation },
    }));

    // After a delay, move to the next turn or end the game
    setTimeout(() => {
        if (result.isFinalScenario || gameState.turn >= MAX_TURNS) {
            setGameState(prev => ({ ...prev, status: 'end_screen' }));
        } else {
            setGameState(prev => ({
                ...prev,
                status: 'in_progress',
                currentScenario: result.nextScenario,
                turn: prev.turn + 1,
                feedback: null,
            }));
        }
        setIsLoading(false);
    }, 4000); // 4 seconds to read feedback
    
  }, [gameState]);

  const restartGame = () => {
    setGameState({
      status: 'start_screen',
      team: INITIAL_TEAM,
      stats: INITIAL_STATS,
      currentScenario: null,
      turn: 0,
      feedback: null,
      language: 'en',
      difficulty: 'normal'
    });
  };

  return { gameState, isLoading, startGame, handleChoice, restartGame };
};
