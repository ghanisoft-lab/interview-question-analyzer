import React, { useState } from 'react';

// InterviewQuestions component to display categorized questions and their sample answers
const InterviewQuestions = ({ questions }) => {
  // State to manage which sample answer is currently visible
  const [openAnswerId, setOpenAnswerId] = useState(null);

  if (!questions || Object.keys(questions).length === 0) {
    return null; // Don't render if no questions are available
  }

  // Toggles the visibility of a sample answer
  const toggleAnswer = (id) => {
    setOpenAnswerId(openAnswerId === id ? null : id);
  };

  // Helper function to render a category of questions
  const renderQuestionCategory = (categoryTitle, questionList) => (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-primary-blue mb-3">{categoryTitle}</h3>
      {questionList && questionList.length > 0 ? (
        <div className="space-y-4">
          {questionList.map((q, index) => (
            <div key={`${categoryTitle}-${index}`} className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <p className="font-semibold text-text-dark mb-2">{q.question}</p>
              <button
                onClick={() => toggleAnswer(q.id)} // Use unique ID for toggling
                className="text-sm text-accent-teal hover:underline focus:outline-none"
              >
                {openAnswerId === q.id ? 'Hide Sample Answer' : 'Show Sample Answer'}
              </button>
              {openAnswerId === q.id && (
                <div className="mt-3 p-3 bg-white border border-gray-100 rounded-md text-sm text-text-light">
                  <p className="font-medium mb-1">Answer Framework:</p>
                  <p className="mb-2">{q.answerFramework}</p>
                  <p className="font-medium mb-1">Sample Answer:</p>
                  <p>{q.sampleAnswer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-light">No {categoryTitle.toLowerCase()} identified for this role.</p>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-primary-blue">Step 3: Likely Interview Questions + Sample Answers</h2>
      <p className="text-sm text-text-light mb-4">
        Below are a range of interview questions tailored to the job description, along with sample answers and frameworks to help you prepare.
      </p>

      {renderQuestionCategory('Technical Questions', questions.technical)}
      {renderQuestionCategory('Behavioral Questions', questions.behavioral)}
      {renderQuestionCategory('Situational Questions', questions.situational)}
      {renderQuestionCategory('Culture-Fit Questions', questions.cultureFit)}
    </div>
  );
};

export default InterviewQuestions;
