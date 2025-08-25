import React from 'react';

// JDInput component for pasting job description and optionally uploading a resume
const JDInput = ({ jd, setJd, resumeFile, setResumeFile, handleAnalyze, loading }) => {
  // Handles changes in the job description textarea
  const handleJdChange = (e) => {
    setJd(e.target.value);
  };

  // Handles resume file selection
  const handleResumeFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-primary-blue">Step 1: Paste Job Description / Upload Resume</h2>
      <p className="text-sm text-text-light mb-4">
        Paste the full job description into the text area below. For a personalized skill gap analysis, you can optionally upload your resume.
      </p>

      {/* Textarea for Job Description */}
      <div className="mb-6">
        <label htmlFor="job-description" className="block text-text-dark text-sm font-medium mb-2">
          Job Description
        </label>
        <textarea
          id="job-description"
          className="w-full p-4 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue resize-y min-h-[200px]"
          placeholder="Paste your job description here..."
          value={jd}
          onChange={handleJdChange}
          rows="10"
          required
        ></textarea>
      </div>

      {/* File input for Resume (Optional) */}
      <div className="mb-6">
        <label htmlFor="resume-upload" className="block text-text-dark text-sm font-medium mb-2">
          Upload Resume (Optional - .pdf, .doc, .docx)
        </label>
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeFileChange}
          className="w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-blue file:text-white hover:file:bg-blue-700"
        />
        {resumeFile && (
          <p className="mt-2 text-sm text-text-light">Selected file: {resumeFile.name}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Note: Resume upload for skill gap analysis is a planned feature. For this demo, focus on JD analysis.
        </p>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!jd.trim() || loading} // Disable if JD is empty or loading
        className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-all duration-300 ${
          !jd.trim() || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-blue hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze Job Description'
        )}
      </button>
    </div>
  );
};

export default JDInput;
