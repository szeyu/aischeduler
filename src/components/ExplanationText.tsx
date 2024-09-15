import React from 'react';

const formatExplanation = (text: string): JSX.Element[] => {
  return text.split('\n').map((paragraph, index) => {
    // Check if the paragraph is a list item
    if (paragraph.trim().startsWith('*')) {
      return (
        <li key={index}>
          {formatInlineBold(paragraph.trim().substring(1).trim())}
        </li>
      );
    }
    // Regular paragraph
    return <p key={index}>{formatInlineBold(paragraph)}</p>;
  });
};

const formatInlineBold = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ExplanationText: React.FC<{ explanation: string }> = ({ explanation }) => {
  return (
    <div className="explanation-text">
      {formatExplanation(explanation)}
    </div>
  );
};

export default ExplanationText;