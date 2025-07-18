import { GoogleGenAI, Type } from "@google/genai";
import { Agent, Choice, GeminiTurnResponse, Scenario, TeamStats, Language } from '../types';

let ai: GoogleGenAI | null = null;

export function initializeAi(apiKey: string) {
    if (!apiKey) {
        throw new Error("API Key is required to initialize the AI service.");
    }
    ai = new GoogleGenAI({ apiKey });
}

export function isAiInitialized(): boolean {
    return ai !== null;
}


const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    feedback: { type: Type.STRING, description: "Brief, insightful feedback for the player about their last choice. (e.g., 'Great choice, this fostered collaboration.')" },
    agentResponse: { type: Type.STRING, description: "Dialogue from the agent(s) reacting to the player's choice. Should be from the perspective of the characters." },
    statChanges: {
      type: Type.OBJECT,
      properties: {
        morale: { type: Type.INTEGER, description: "The change in team morale, from -20 to +20." },
        productivity: { type: Type.INTEGER, description: "The change in team productivity, from -20 to +20." },
        cooperation: { type: Type.INTEGER, description: "The change in team cooperation, from -20 to +20." }
      },
      required: ["morale", "productivity", "cooperation"]
    },
    nextScenario: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A concise, engaging title for the next scenario." },
        description: { type: Type.STRING, description: "A detailed description of the new situation the team faces. This should be a natural progression from the last event." },
        agentInFocus: { type: Type.STRING, description: "The name of the agent primarily involved in this new scenario (must be one of the team members)." },
        choices: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING, description: "A concise, actionable choice for the player." }
            },
            required: ["id", "text"]
          },
          minItems: 2,
          maxItems: 3
        }
      },
      required: ["title", "description", "agentInFocus", "choices"]
    },
    isFinalScenario: { type: Type.BOOLEAN, description: "Set to true only if this is the final turn of the game. Otherwise, false." }
  },
  required: ["feedback", "agentResponse", "statChanges", "nextScenario", "isFinalScenario"]
};

function buildBasePrompt(team: Agent[], stats: TeamStats, language: Language): string {
  const teamDescriptions = team.map(a => `- ${a.name} (${a.personality}): ${a.personality}`).join('\n');
  return `
You are a game master for a team project management simulation.
Your goal is to create a realistic and engaging story of a team working on a project.
All your responses, including all text in the JSON output, must be in ${language === 'ko' ? 'Korean' : 'English'}.

THE TEAM:
${teamDescriptions}

CURRENT TEAM STATUS:
- Morale: ${stats.morale}/100
- Productivity: ${stats.productivity}/100
- Cooperation: ${stats.cooperation}/100 (This reflects how well the team works together. Low cooperation leads to friction and misunderstandings. High cooperation leads to synergy.)

Your task is to process the player's decision and generate the next turn of the game.
You must respond ONLY with a valid JSON object matching the provided schema. Do not include any other text or markdown formatting.
`;
}


export async function getInitialScenario(team: Agent[], stats: TeamStats, language: Language): Promise<Scenario> {
  if (!ai) {
      throw new Error("AI Service not initialized. Please set an API Key.");
  }
  const prompt = `
${buildBasePrompt(team, stats, language)}

This is the start of the game. Create an interesting opening scenario for the team. It should be a common workplace situation that requires a manager's input.
The 'agentInFocus' must be one of the team members.
The entire response and all its fields must be in ${language === 'ko' ? 'Korean' : 'English'}.
`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA.properties.nextScenario,
        }
    });

    const jsonText = response.text.trim();
    const scenario = JSON.parse(jsonText);
    return scenario as Scenario;
  } catch (error) {
    console.error("Error fetching initial scenario:", error);
    // Return a fallback scenario on error
    return {
      title: language === 'ko' ? "예상치 못한 다운타임" : "Unexpected Downtime",
      description: language === 'ko' ? "메인 서버가 다운되어 팀의 작업이 중단되었습니다. 최우선 과제는 무엇입니까?" : "The main server has crashed, and the team is blocked. What is the first priority?",
      agentInFocus: "Alex",
      choices: [
        { id: 1, text: language === 'ko' ? "임시방편이라도 좋으니 빠른 해결책에 집중한다." : "Focus on getting a temporary fix, no matter how scrappy." },
        { id: 2, text: language === 'ko' ? "이 시간을 다른 프로젝트 아이디어를 브레인스토밍하는 데 사용한다." : "Let's use this time to brainstorm other project ideas." },
      ]
    };
  }
}

export async function processPlayerChoice(
  team: Agent[],
  stats: TeamStats,
  scenario: Scenario,
  choice: Choice,
  turn: number,
  maxTurns: number,
  language: Language
): Promise<GeminiTurnResponse> {
  if (!ai) {
      throw new Error("AI Service not initialized. Please set an API Key.");
  }
  const isFinalTurn = turn >= maxTurns - 1;

  const prompt = `
${buildBasePrompt(team, stats, language)}

PREVIOUS SCENARIO:
- Title: ${scenario.title}
- Situation: ${scenario.description}
- Player's Choice: "${choice.text}"

Based on the player's choice, generate the outcome and the next scenario.
- The 'agentResponse' should reflect how the characters would realistically react.
- The 'statChanges' should logically follow from the choice's impact.
- The 'nextScenario' should be a consequence of the previous events.
- Since this is turn ${turn + 1} of ${maxTurns}, set 'isFinalScenario' to ${isFinalTurn}.
- The entire response and all its fields must be in ${language === 'ko' ? 'Korean' : 'English'}.
`;
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as GeminiTurnResponse;

  } catch (error) {
    console.error("Error processing player choice:", error);
    // Graceful fallback
    const fallbackText = {
        feedback: language === 'ko' ? "예기치 않은 오류가 발생했습니다. 시뮬레이션은 기본 경로로 진행됩니다." : "An unexpected error occurred. The simulation will proceed with a default path.",
        agentResponse: `${scenario.agentInFocus}: ` + (language === 'ko' ? "음, 예상치 못했네요. 다음 작업으로 넘어가죠." : "Well, that was unexpected. Let's just move on to the next task."),
        nextTitle: language === 'ko' ? "프로젝트 보고" : "Project Debrief",
        nextDescription: language === 'ko' ? "프로젝트가 결론에 도달했습니다. 보고 회의를 열 시간입니다." : "The project has reached its conclusion. It's time to hold a debrief meeting.",
        choice1: language === 'ko' ? "잘된 점에 집중하기" : "Focus on what went well.",
        choice2: language === 'ko' ? "잘못된 점에 집중하기" : "Focus on what went wrong.",
    }
    return {
        feedback: fallbackText.feedback,
        agentResponse: fallbackText.agentResponse,
        statChanges: { morale: -5, productivity: -5, cooperation: -5 },
        nextScenario: {
            title: fallbackText.nextTitle,
            description: fallbackText.nextDescription,
            agentInFocus: "Alex",
            choices: [{id: 1, text: fallbackText.choice1}, {id: 2, text: fallbackText.choice2}]
        },
        isFinalScenario: true
    };
  }
}