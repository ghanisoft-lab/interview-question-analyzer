import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import JDInput from '../components/JDInput';
import RoleInsights from '../components/RoleInsights';
import InterviewQuestions from '../components/InterviewQuestions';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import PracticeMode from '../components/PracticeMode';
import html2pdf from 'html2pdf.js';

// Main application component
export default function Home() {
  const [jd, setJd] = useState(''); // State for Job Description input
  const [resumeFile, setResumeFile] = useState(null); // State for uploaded resume file
  const [loading, setLoading] = useState(false); // Loading state for analysis
  const [analysisResults, setAnalysisResults] = useState(null); // Stores results from JD analysis
  const [error, setError] = useState(null); // Stores any error messages

  // Dynamic SEO states
  const [seoTitle, setSeoTitle] = useState("Interview Question Analyzer from Job Descriptions");
  const [seoDescription, setSeoDescription] = useState("Analyze job descriptions, generate interview questions, identify skill gaps, and practice with an AI interviewer. Get ready for your next job interview!");
  const [seoKeywords, setSeoKeywords] = useState("job description analyzer, interview questions, skill gap analysis, AI mock interview, ATS-friendly resume, job preparation, career tools, technical interview, behavioral interview");
  const [structuredData, setStructuredData] = useState(null);

  // Effect to update SEO meta tags when analysis results are available
  useEffect(() => {
    if (analysisResults && analysisResults.insights?.roleTitle) {
      const roleTitle = analysisResults.insights.roleTitle;
      const skills = analysisResults.insights.requiredSkills?.join(', ') || '';
      
      setSeoTitle(`${roleTitle} Interview Questions & Analysis | AI Powered`);
      setSeoDescription(`Prepare for your ${roleTitle} interview with AI-generated questions, sample answers, and skill gap analysis based on your job description.`);
      setSeoKeywords(`${roleTitle}, interview questions, ${skills}, job preparation, AI interview, skill gaps`);

      // Basic Structured Data (Schema.org JobPosting example, can be more detailed)
      setStructuredData({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${roleTitle} Interview Analyzer`,
        "description": `AI-powered tool to help you prepare for a ${roleTitle} interview.`,
        "url": "https://your-app-url.vercel.app/", // Update with actual deployed URL
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://your-app-url.vercel.app/" // Update with actual deployed URL
        }
      });
    } else {
      // Reset to default if no analysis results
      setSeoTitle("Interview Question Analyzer from Job Descriptions");
      setSeoDescription("Analyze job descriptions, generate interview questions, identify skill gaps, and practice with an AI interviewer. Get ready for your next job interview!");
      setSeoKeywords("job description analyzer, interview questions, skill gap analysis, AI mock interview, ATS-friendly resume, job preparation, career tools, technical interview, behavioral interview");
      setStructuredData(null);
    }
  }, [analysisResults]);

  // Handles the main job description analysis process
  const handleAnalyze = async () => {
    if (!jd.trim()) {
      setError('Please paste a job description to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResults(null); // Clear previous results

    try {
      // Placeholder for resume file processing:
      let resumeText = '';
      if (resumeFile) {
        // In a real app, you'd send resumeFile to a backend for OCR/parsing.
        // For this demo, we'll just acknowledge its presence.
        console.log('Resume file selected:', resumeFile.name);
        // You could add client-side text extraction for simple files (txt) here,
        // but for PDF/DOCX, it's best handled server-side.
        // For now, resumeText remains empty.
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jd, resumeText }), // Sending jd and a placeholder resumeText
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(`Failed to analyze job description: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handles exporting the analysis results to a PDF
  const handleExportPdf = () => {
    if (!analysisResults) {
      alert('Please analyze a job description first to export results.');
      return;
    }

    // Define the content to be exported. You can customize this HTML structure.
    const content = document.getElementById('analysis-output-section');

    const opt = {
      margin: 0.5,
      filename: `${analysisResults.insights.roleTitle.replace(/\s/g, '-') || 'Interview-Analysis'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' } // Avoid breaking content across pages if possible
    };

    html2pdf().from(content).set(opt).save();
  };

  return (
    <Layout
      title={seoTitle}
      description={seoDescription}
      keywords={seoKeywords}
      structuredData={structuredData}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-primary-blue mb-6 text-center">
          Interview Question Analyzer
        </h1>
        <p className="text-lg text-text-light text-center mb-8 max-w-2xl">
          Leverage AI to meticulously dissect job descriptions, anticipate interview questions, identify skill gaps, and practice with an AI interviewer. Your ultimate tool for interview success.
        </p>

        {/* Input Section */}
        <JDInput
          jd={jd}
          setJd={setJd}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          handleAnalyze={handleAnalyze}
          loading={loading}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 w-full max-w-4xl" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {/* Analysis Results Section */}
        {analysisResults && (
          <div id="analysis-output-section" className="w-full"> {/* ID for PDF export */}
            <RoleInsights insights={analysisResults.insights} />
            <InterviewQuestions questions={analysisResults.questions} />
            <SkillGapAnalysis skillGaps={analysisResults.skillGaps} />

            {/* Export Options */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-end">
              <button
                onClick={handleExportPdf}
                className="bg-primary-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path><path fillRule="even