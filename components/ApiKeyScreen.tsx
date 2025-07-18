import React, { useState } from 'react';

interface ApiKeyScreenProps {
    onKeySubmit: (key: string) => void;
}

const translations = {
    en: {
        title: "Enter Your API Key",
        description: "To play, this simulator needs a Google Gemini API key. Your key is stored only in your browser and is never sent to our servers.",
        getYourKey: "Get your free API key from Google AI Studio",
        placeholder: "Paste your API key here",
        saveButton: "Save and Start",
        error: "Please enter a valid API key.",
    },
    ko: {
        title: "API 키를 입력하세요",
        description: "시뮬레이터를 플레이하려면 Google Gemini API 키가 필요합니다. API 키는 브라우저에만 저장되며, 저희 서버로 전송되지 않습니다.",
        getYourKey: "Google AI Studio에서 무료 API 키 받기",
        placeholder: "API 키를 여기에 붙여넣으세요",
        saveButton: "저장하고 시작하기",
        error: "유효한 API 키를 입력해주세요.",
    }
}


const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySubmit }) => {
    const [apiKey, setApiKey] = useState('');
    const [lang, setLang] = useState<'en' | 'ko'>('en');
    const [error, setError] = useState('');
    const t = translations[lang];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim().length < 10) { // Basic validation
            setError(t.error);
            return;
        }
        onKeySubmit(apiKey.trim());
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 animate-fade-in">
            <div className="absolute top-4 right-4">
                <button onClick={() => setLang('en')} className={`px-3 py-1 text-sm rounded-l-md ${lang === 'en' ? 'bg-sky-600 text-white' : 'bg-slate-700'}`}>EN</button>
                <button onClick={() => setLang('ko')} className={`px-3 py-1 text-sm rounded-r-md ${lang === 'ko' ? 'bg-sky-600 text-white' : 'bg-slate-700'}`}>KO</button>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-white mb-4">{t.title}</h1>
                <p className="text-slate-300 mb-6">{t.description}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => {
                            setApiKey(e.target.value);
                            setError('');
                        }}
                        placeholder={t.placeholder}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        aria-label="API Key Input"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-sky-300"
                    >
                        {t.saveButton}
                    </button>
                </form>

                <div className="mt-6">
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline"
                    >
                        {t.getYourKey}
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ApiKeyScreen;