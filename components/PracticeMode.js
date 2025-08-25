import React, { useState, useEffect, useRef } from 'react';

// PracticeMode component for interactive AI mock interviews
const PracticeMode = ({ jd, roleTitle }) => {
  const [chatHistory, setChatHistory] = useState([]); // Stores the conversation
  const [userAnswer, setUserAnswer] = useState(''); // Current user input
  const [interviewLoading, setInterviewLoading] = useState(false); // Loading state for AI responses
  const chatEndRef = useRef(null); // Ref for auto-scrolling chat

  // Auto-scroll to the bottom of the chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Initializes the interview by fetching the first question
  const startInterview = async () => {
    setInterviewLoading(true);
    setChatHistory([{ role: 'system', text: 'Starting your mock interview...' }]);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jd: jd,
          chatHistory: [], // Empty history for the first question
          roleTitle: roleTitle,
          action: 'start' // Indicate to the API to start a new interview
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(data.chatHistory); // Update chat history with AI's first question
    } catch (error) {
      console.error('Error starting interview:', error);
      setChatHistory(prev => [...prev, { role: 'system', text: 'Error starting interview. Please try again.' }]);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Handles submitting a user's answer
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || interviewLoading) return;

    const newUserChatHistory = [...chatHistory, { role: 'user', text: userAnswer }];
    setChatHistory(newUserChatHistory); // Add user's answer to history
    setUserAnswer(''); // Clear input field
    setInterviewLoading(true);

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jd: jd,
          chatHistory: newUserChatHistory, // Send updated history
          roleTitle: roleTitle,
          action: 'continue' // Indicate to the API to continue the interview
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(data.chatHistory); // Update with AI's feedback/next question
    } catch (error) {
      console.error('Error submitting answer:', error);
      setChatHistory(prev => [...prev, { role: 'system', text: 'Error processing answer. Please try again.' }]);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Handles key press in the input field (e.g., Enter to submit)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Submit on Enter, but allow Shift+Enter for new line
      e.preventDefault(); // Prevent default Enter behavior (new line)
      handleSubmitAnswer();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-primary-blue">Step 5: Mock Interview Practice</h2>
      <p className="text-sm text-text-light mb-4">
        Engage in a live mock interview with our AI. Answer questions, get real-time feedback, and refine your responses.
      </p>

      {/* Interview Chat Window */}
      <div className="border border-gray-300 rounded-lg p-4 h-[400px] overflow-y-auto mb-4 bg-gray-50 flex flex-col justify-end">
        {chatHistory.length === 0 ? (
          <div className="flex justify-center items-center h-full text-text-light">
            <p>Click "Start Interview" to begin your practice session.</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.role === 'user' ? 'bg-primary-blue text-white self-end' : 'bg-gray-200 text-text-dark self-start'
              }`}
            >
              <p className="font-medium">{msg.role === 'user' ? 'You' : 'AI Interviewer'}:</p>
              <p>{msg.text}</p>
            </div>
          ))
        )}
        <div ref={chatEndRef} /> {/* For auto-scrolling */}
      </div>

      {/* Interview Controls */}
      {!chatHistory.length && (
        <button
          onClick={startInterview}
          disabled={interviewLoading || !jd.trim()}
          className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-all duration-300 ${
            interviewLoading || !jd.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-teal hover:bg-teal-600'
          }`}
        >
          {interviewLoading ? 'Loading...' : 'Start Interview'}
        </button>
      )}

      {chatHistory.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue resize-none"
            rows="3"
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={interviewLoading}
          ></textarea>
          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim() || interviewLoading}
            className={`py-3 px-6 rounded-md text-white font-semibold transition-all duration-300 ${
              !userAnswer.trim() || interviewLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-blue hover:bg-blue-700'
            }`}
          >
            {interviewLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Submit Answer'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeMode;
