
import React from "react";

interface Props {
  questions: string[];
  onSelect: (question: string) => void;
  isLoading?: boolean;
}

const SampleQuestions: React.FC<Props> = ({
  questions,
  onSelect,
  isLoading,
}) => (
  <div className="mt-4">
    <p className="text-ocean-300 text-sm mb-3 text-center">Try asking me about:</p>
    <div className="space-y-2">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="w-full text-left p-3 rounded-xl bg-ocean-800/50 border border-ocean-700 text-ocean-200 hover:bg-ocean-700/50 hover:border-cyan-600 transition-all duration-200 text-sm"
          disabled={isLoading}
          type="button"
        >
          💭 {question}
        </button>
      ))}
    </div>
  </div>
);

export default SampleQuestions;
