import React from 'react';

// SkillGapAnalysis component (currently a placeholder)
const SkillGapAnalysis = ({ skillGaps }) => {
  // This component will eventually compare JD skills with resume skills.
  // For this version, it's a simple placeholder.

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-primary-blue">Step 4: Skill Gaps & Recommendations</h2>
      <p className="text-sm text-text-light mb-4">
        This section will show a comparison of the required skills from the job description against the skills found in your uploaded resume (if provided). It will then suggest relevant resources for identified gaps.
      </p>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <p className="text-text-light">
          **Feature coming soon!** Upload your resume to unlock personalized skill gap analysis and tailored learning recommendations.
        </p>
        {/* Placeholder for future skill gap display */}
        {/* {skillGaps && skillGaps.length > 0 ? (
          <ul className="list-disc list-inside mt-4 text-text-light">
            {skillGaps.map((gap, index) => (
              <li key={index} className="mb-1">
                <span className="font-medium">{gap.skill}:</span> {gap.recommendation}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-text-light">No specific skill gaps identified based on current input.</p>
        )} */}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
