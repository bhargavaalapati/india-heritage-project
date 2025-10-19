import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import SkeletonLoader from "../components/SkeletonLoader";

const QuizPage = () => {
  const { monumentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/data/quizData.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data[monumentId] || []);
        setLoading(false);
      });
  }, [monumentId]);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 capitalize animate-pulse">
          Loading {monumentId} Quiz...
        </h1>

        {/* Skeleton Card */}
        <SkeletonLoader type="card" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">⚠️ No quiz available for this monument.</p>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 capitalize">{monumentId} Quiz</h1>

      <div className="w-full max-w-lg">
        <QuizCard key={restartKey} questions={questions} />
      </div>

      <button
        onClick={() => setRestartKey((prev) => prev + 1)}
        className="mt-6 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Restart Quiz 🔄
      </button>

      <Link
        to={`/site/${monumentId}`}
        className="mt-4 px-5 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
      >
        Back to Monument
      </Link>
    </div>
  );
};

export default QuizPage;
