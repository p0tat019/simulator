import React from 'react';
import { GameState } from '../types';
import { ReplayIcon, SettingsIcon } from './icons';

interface EndScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onClearKey: () => void;
}

const endScreenText = {
  en: {
    outstanding: {
      title: "Outstanding Success!",
      message: "Incredible leadership! You've fostered a highly motivated and productive team, delivering exceptional results ahead of schedule. Your ability to balance team needs with project goals is commendable."
    },
    successful: {
      title: "Project Successful",
      message: "Good work, manager. The project is complete, and the team is in a decent state. There were some bumps along the road, but you navigated them effectively to reach the goal."
    },
    barely: {
      title: "Project Barely Finished",
      message: "You crossed the finish line, but it wasn't pretty. The team is feeling the strain, and project quality may have suffered. Reflect on key decisions to improve next time."
    },
    failure: {
      title: "Project Failure",
      message: "Unfortunately, the project has failed. A combination of low morale and poor productivity derailed progress. It's a tough outcome, but a valuable learning experience."
    },
    finalStats: "Final Stats:",
    morale: "Morale",
    productivity: "Productivity",
    cooperation: "Cooperation",
    playAgain: "Play Again",
    changeKey: "Change API Key",
  },
  ko: {
    outstanding: {
      title: "엄청난 성공!",
      message: "놀라운 리더십입니다! 동기 부여가 잘 되고 생산적인 팀을 만들어, 예정보다 앞서 뛰어난 결과를 만들어 냈습니다. 팀의 필요와 프로젝트 목표 사이의 균형을 맞추는 능력이 훌륭합니다."
    },
    successful: {
      title: "프로젝트 성공",
      message: "수고하셨습니다, 매니저님. 프로젝트가 완료되었고 팀 상태도 양호합니다. 약간의 어려움이 있었지만, 목표 달성을 위해 효과적으로 대처했습니다."
    },
    barely: {
      title: "가까스로 프로젝트 완료",
      message: "결승선은 넘었지만, 과정이 순탄치 않았습니다. 팀은 지쳐있고 프로젝트 품질도 저하되었을 수 있습니다. 다음에는 더 나은 결과를 위해 주요 결정들을 다시 생각해 보세요."
    },
    failure: {
      title: "프로젝트 실패",
      message: "안타깝게도 프로젝트가 실패했습니다. 낮은 사기와 생산성 저하가 진행을 방해했습니다. 힘든 결과지만, 값진 학습 경험이 될 것입니다."
    },
    finalStats: "최종 통계:",
    morale: "사기",
    productivity: "생산성",
    cooperation: "협조성",
    playAgain: "다시 플레이",
    changeKey: "API 키 변경",
  }
}

const EndScreen: React.FC<EndScreenProps> = ({ gameState, onRestart, onClearKey }) => {
  const { stats, language } = gameState;
  const t = endScreenText[language];
  const averageScore = (stats.morale + stats.productivity + stats.cooperation) / 3;

  let outcome = t.failure;

  if (averageScore > 80 && stats.morale > 70 && stats.productivity > 70) {
    outcome = t.outstanding;
  } else if (averageScore > 60) {
    outcome = t.successful;
  } else if (averageScore > 40) {
    outcome = t.barely;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 mb-4">{outcome.title}</h1>
        <p className="text-lg text-slate-300 mb-6">{outcome.message}</p>
        
        <div className="my-6 space-y-2 text-slate-200">
            <p className="text-xl font-semibold text-white">{t.finalStats}</p>
            <p className="text-lg">
                <span className="font-bold text-green-400">{t.morale}:</span> {stats.morale}%
            </p>
            <p className="text-lg">
                <span className="font-bold text-yellow-400">{t.productivity}:</span> {stats.productivity}%
            </p>
            <p className="text-lg">
                <span className="font-bold text-sky-400">{t.cooperation}:</span> {stats.cooperation}%
            </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ReplayIcon className="w-6 h-6" />
              {t.playAgain}
            </button>
             <button
              onClick={onClearKey}
              className="px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-500 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-slate-400 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <SettingsIcon className="w-6 h-6" />
              {t.changeKey}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;