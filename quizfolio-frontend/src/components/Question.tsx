import React from 'react';

interface QuestionProps {
  question: {
    question: string;
    options: { optionText: string; isCorrect: boolean; _id: string }[]; // Adjusted for option structure
    correctAnswer: number;
  };
  handleAnswerOptionClick: (isCorrect: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({ question, handleAnswerOptionClick }) => {
  return (
    <div className="question-section">
      <h2>{question.question}</h2>
      <div className="answer-section">
        {question.options.map((option, index) => (
          <button
            key={option._id} // Use option ID as key
            onClick={() => handleAnswerOptionClick(option.isCorrect)} // Pass isCorrect property
          >
            {option.optionText} {/* Display option text */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
