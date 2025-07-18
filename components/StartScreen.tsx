import React, { useState } from 'react';
import { Language, Difficulty } from '../types';

interface StartScreenProps {
  onStart: (options: { language: Language; difficulty: Difficulty }) => void;
}

const translations = {
  en: {
    title: "Team Dynamics Simulator",
    description: "Welcome, Project Manager. Your mission is to lead a diverse team to successfully complete a critical project. Your decisions will shape team morale, productivity, and the ultimate outcome. Can you navigate the challenges of teamwork?",
    language: "Language",
    difficulty: "Difficulty",
    easy: "Easy",
    normal: "Normal",
    hard: "Hard",
    begin: "Begin Simulation"
  },
  ko: {
    title: "팀 역학 시뮬레이터",
    description: "프로젝트 매니저님, 환영합니다. 당신의 임무는 다양한 팀을 이끌고 중요한 프로젝트를 성공적으로 완료하는 것입니다. 당신의 결정이 팀의 사기, 생산성, 그리고 최종 결과를 결정합니다. 팀워크의 어려움을 헤쳐나갈 수 있습니까?",
    language: "언어",
    difficulty: "난이도",
    easy: "쉬움",
    normal: "보통",
    hard: "어려움",
    begin: "시뮬레이션 시작"
  }
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const t = translations[language];

  const SettingButton = ({ label, value, selectedValue, onClick, className = '' }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${selectedValue === value ? 'bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
        } ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
        {t.title}
      </h1>
      <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
        {t.description}
      </p>

      <div className="w-full max-w-md mx-auto space-y-6 mb-10">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-slate-200">{t.language}</label>
          <div className="grid grid-cols-2 gap-3">
            <SettingButton label="English" value="en" selectedValue={language} onClick={setLanguage} />
            <SettingButton label="한국어" value="ko" selectedValue={language} onClick={setLanguage} />
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-slate-200">{t.difficulty}</label>
          <div className="grid grid-cols-3 gap-3">
            <SettingButton label={t.easy} value="easy" selectedValue={difficulty} onClick={setDifficulty} />
            <SettingButton label={t.normal} value="normal" selectedValue={difficulty} onClick={setDifficulty} />
            <SettingButton label={t.hard} value="hard" selectedValue={difficulty} onClick={setDifficulty} />
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart({ language, difficulty })}
        className="px-8 py-4 bg-sky-600 text-white font-bold text-lg rounded-lg hover:bg-sky-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300"
      >
        {t.begin}
      </button>
    </div>
  );
};

export default StartScreen;
