import { GoogleGenerativeLanguageServiceClient } from '@google-generative-ai/google-generative-ai';

// Initialize Gemini API client
// The API key will be provided by the Canvas environment for local execution
// For Vercel deployment, ensure GEMINI_API_KEY is set in environment variables
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE"; 
const MODEL_NAME = 'gemini-2.5-flash-preview-05-20'; // Using the flash model

// Utility function for exponential backoff
const callGeminiWithBackoff = async (payload, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 429 && i < retries - 1) { // Too Many Requests
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential increase
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error(`Attempt ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jd, resumeText } = req.body;

  if (!jd) {
    return res.status(400).json({ error: 'Job description is required.' });
  }

  try {
    // --- 1. Extract Role Insights ---
    const insightsPrompt = `
      Analyze the following job description and extract the key information.
      Return the output as a JSON object with the following structure:
      {
        "roleTitle": "Exact Job Title from JD",
        "requiredSkills": ["skill1", "skill2", ...],
        "tools": ["tool1", "tool2", ...],
        "softSkills": ["soft skill1", "soft skill2", ...]
      }

      Job Description:
      "${jd}"
    `;

    const insightsPayload = {
      contents: [{ role: 'user', parts: [{ text: insightsPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "OBJECT",
            properties: {
                "roleTitle": { "type": "STRING" },
                "requiredSkills": { "type": "ARRAY", "items": { "type": "STRING" } },
                "tools": { "type": "ARRAY", "items": { "type": "STRING" } },
                "softSkills": { "type": "ARRAY", "items": { "type": "STRING" } }
            },
            propertyOrdering: ["roleTitle", "requiredSkills", "tools", "softSkills"]
        }
      },
    };

    const insightsResult = await callGeminiWithBackoff(insightsPayload);
    const insightsText = insightsResult.candidates?.[0]?.content?.parts?.[0]?.text;
    const insights = insightsText ? JSON.parse(insightsText) : {
      roleTitle: 'Unknown Role',
      requiredSkills: [],
      tools: [],
      softSkills: []
    };


    // --- 2. Generate Interview Questions & Sample Answers ---
    const questionsPrompt = `
      Based on the job description and the extracted role: "${insights.roleTitle}", generate a diverse set of interview questions across technical, behavioral, situational, and culture-fit categories. For each question, provide a brief answer framework and a sample answer. Ensure answers are ATS-friendly.

      Return the output as a JSON object with the following structure:
      {
        "technical": [
          {"id": "uuid1", "question": "...", "answerFramework": "...", "sampleAnswer": "..."},
          ...
        ],
        "behavioral": [
          {"id": "uuid2", "question": "...", "answerFramework": "STAR method: ...", "sampleAnswer": "..."},
          ...
        ],
        "situational": [
          {"id": "uuid3", "question": "...", "answerFramework": "...", "sampleAnswer": "..."},
          ...
        ],
        "cultureFit": [
          {"id": "uuid4", "question": "...", "answerFramework": "...", "sampleAnswer": "..."},
          ...
        ]
      }
      Ensure each question has a unique 'id' (a simple string is fine).

      Job Description:
      "${jd}"
      
      Extracted Role Title: ${insights.roleTitle}
      Required Skills: ${insights.requiredSkills.join(', ')}
      Tools: ${insights.tools.join(', ')}
      Soft Skills: ${insights.softSkills.join(', ')}
    `;

    const questionsPayload = {
      contents: [{ role: 'user', parts: [{ text: questionsPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "technical": {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "id": { "type": "STRING" },
                  "question": { "type": "STRING" },
                  "answerFramework": { "type": "STRING" },
                  "sampleAnswer": { "type": "STRING" }
                }
              }
            },
            "behavioral": {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "id": { "type": "STRING" },
                  "question": { "type": "STRING" },
                  "answerFramework": { "type": "STRING" },
                  "sampleAnswer": { "type": "STRING" }
                }
              }
            },
            "situational": {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "id": { "type": "STRING" },
                  "question": { "type": "STRING" },
                  "answerFramework": { "type": "STRING" },
                  "sampleAnswer": { "type": "STRING" }
                }
              }
            },
            "cultureFit": {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "id": { "type": "STRING" },
                  "question": { "type": "STRING" },
                  "answerFramework": { "type": "STRING" },
                  "sampleAnswer": { "type": "STRING" }
                }
              }
            }
          }
        }
      },
    };

    const questionsResult = await callGeminiWithBackoff(questionsPayload);
    const questionsText = questionsResult.candidates?.[0]?.content?.parts?.[0]?.text;
    const questions = questionsText ? JSON.parse(questionsText) : {
      technical: [],
      behavioral: [],
      situational: [],
      cultureFit: []
    };


    // --- 3. Skill Gap Analysis (placeholder for now) ---
    // In a full implementation, you'd parse resumeText here and compare skills.
    // For this demo, it's a simple placeholder or a basic recommendation.
    const skillGaps = []; // Placeholder for actual skill gap analysis
    if (insights.requiredSkills && insights.requiredSkills.length > 0) {
      // Simulate a generic recommendation if no resume is provided
      skillGaps.push({
        skill: "ITIL Knowledge",
        recommendation: "Consider a LinkedIn Learning or Coursera course on ITIL Foundation for career advancement in service management."
      });
      skillGaps.push({
        skill: "Advanced Data Analytics",
        recommendation: "Explore certifications in SQL, Python for Data Analysis, or Tableau to strengthen your analytical skills."
      });
    }

    res.status(200).json({ insights, questions, skillGaps });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process job description.' });
  }
}
