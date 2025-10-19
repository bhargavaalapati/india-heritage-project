import React, { useState } from "react";

const QuizCard = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    const nextQ = current + 1;
    if (nextQ < questions.length) {
      setCurrent(nextQ);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="p-4 text-center border rounded-xl shadow-md bg-white">
        <h2 className="text-xl font-bold">Quiz Completed 🎉</h2>
        <p className="mt-2">Your Score: {score} / {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-lg font-semibold">{questions[current].question}</h2>
      <div className="mt-4 grid gap-2">
        {questions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        Question {current + 1} of {questions.length}
      </p>
    </div>
  );
};

export default QuizCard;