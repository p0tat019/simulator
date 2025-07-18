
import React from 'react';
import { Agent } from '../types';
import { PERSONALITY_DESCRIPTIONS } from '../constants';

interface AgentProfileProps {
    agent: Agent;
    isFocus?: boolean;
}

const AgentProfile: React.FC<AgentProfileProps> = ({ agent, isFocus = false }) => {
    return (
        <div className={`p-4 rounded-lg flex flex-col items-center text-center transition-all duration-300 ${isFocus ? 'bg-sky-800/50 scale-105 shadow-lg' : 'bg-slate-800'}`}>
            <img src={agent.avatarUrl} alt={agent.name} className="w-20 h-20 rounded-full mb-3 border-4 border-slate-600" />
            <h3 className="font-bold text-lg text-white">{agent.name}</h3>
            <p className="text-sm text-sky-400 font-medium">{agent.personality}</p>
            <p className="text-xs text-slate-400 mt-2">{PERSONALITY_DESCRIPTIONS[agent.personality]}</p>
        </div>
    );
};

export default AgentProfile;
