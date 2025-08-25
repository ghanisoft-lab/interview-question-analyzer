// Initialize Gemini API client
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

  const { jd, chatHistory, roleTitle, action } = req.body;

  if (!jd || !roleTitle) {
    return res.status(400).json({ error: 'Job description and role title are required for the interview.' });
  }

  try {
    let newChatHistory = [...chatHistory];
    let aiResponseContent = '';

    if (action === 'start') {
      // Start a new interview
      const prompt = `You are an AI interviewer for a "${roleTitle}" role. Based on the following job description, ask the first interview question. Focus on a general opening question or a key technical/behavioral aspect.
      
      Job Description:
      "${jd}"

      Begin by greeting the candidate and asking your first question.
      `;

      newChatHistory.push({ role: 'user', parts: [{ text: prompt }] });

      const payload = {
        contents: newChatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      };

      const result = await callGeminiWithBackoff(payload);
      aiResponseContent = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a question at this time.";
      newChatHistory = [{ role: 'ai', text: aiResponseContent }]; // Reset history to just the AI's response for cleanliness

    } else if (action === 'continue') {
      // Continue the interview with user's answer
      // The chatHistory already contains the user's last answer and previous AI questions.
      const lastUserMessage = chatHistory[chatHistory.length - 1]?.text;
      const conversationContext = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model', // Gemini API expects 'model' for AI responses
        parts: [{ text: msg.text }]
      }));

      const promptForFeedbackAndNextQuestion = `You are an AI interviewer for a "${roleTitle}" role. The candidate just responded to the previous question: "${lastUserMessage}".
      
      First, provide brief, constructive feedback on their answer.
      Second, ask a relevant follow-up question or the next question in the interview sequence.
      Ensure the feedback and next question are based on the context of the job description and previous conversation.
      
      Job Description:
      "${jd}"
      `;

      // Add the system prompt to the conversation context
      conversationContext.unshift({ role: 'user', parts: [{ text: promptForFeedbackAndNextQuestion }] });

      const payload = {
        contents: conversationContext,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      };

      const result = await callGeminiWithBackoff(payload);
      aiResponseContent = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate feedback or a new question.";
      newChatHistory.push({ role: 'ai', text: aiResponseContent });
    } else {
      return res.status(400).json({ error: 'Invalid action for interview.' });
    }

    res.status(200).json({ chatHistory: newChatHistory });

  } catch (error) {
    console.error('Interview API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to conduct mock interview.' });
  }
}
