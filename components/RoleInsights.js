import React from 'react';

// RoleInsights component to display extracted information from the JD
const RoleInsights = ({ insights }) => {
  if (!insights) {
    return null; // Don't render if no insights are available
  }

  // Helper function to render a list of items
  const renderList = (title, items) => (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-primary-blue mb-2">{title}</h3>
      <ul className="list-disc list-inside text-text-light">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} className="mb-1">{item}</li>
          ))
        ) : (
          <li>No {title.toLowerCase()} identified.</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-primary-blue">Step 2: Extracted Role Insights</h2>
      
      {/* Role Title */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-primary-blue mb-2">Role Title</h3>
        <p className="text-text-dark text-xl font-bold">{insights.roleTitle || 'N/A'}</p>
      </div>

      {/* Required Skills */}
      {renderList('Required Skills', insights.requiredSkills || [])}

      {/* Tools & Technologies */}
      {renderList('Tools & Technologies', insights.tools || [])}

      {/* Soft Skills */}
      {renderList('Soft Skills', insights.softSkills || [])}
    </div>
  );
};

export default RoleInsights;
