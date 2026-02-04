import { useState } from "react";
import {
  QUIZ_QUESTIONS,
  PATHWAY_LABELS,
  PATHWAY_DESCRIPTIONS,
  computeScores,
} from "../data/pathwayQuiz";

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

export default function PathFinderQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;
  const isLast = currentIndex === TOTAL_QUESTIONS - 1;

  const handleSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = option;
    setAnswers(newAnswers);

    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const results = computeScores(answers);
    const top = results.slice(0, 3).filter((r) => r.score > 0);

    return (
      <div className="page pathfinder-page">
        <header className="pathfinder-hero">
          <p className="eyebrow">Your results</p>
          <h1>Academic path recommendation</h1>
          <p className="subtitle">
            Based on your answers, here are the pathways that may fit you best.
            This is a guide—consider talking to a counsellor for big decisions.
          </p>
        </header>

        <section className="pathfinder-results">
          {top.length > 0 ? (
            <ul className="results-list">
              {top.map(({ pathway, score }, rank) => (
                <li key={pathway} className="result-card">
                  <span className="result-rank">#{rank + 1}</span>
                  <h2>{PATHWAY_LABELS[pathway]}</h2>
                  <p className="result-desc">{PATHWAY_DESCRIPTIONS[pathway]}</p>
                  <p className="result-score">Match score: {score}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="result-empty">
              Your answers were mixed across pathways. Try the quiz again with
              different choices, or explore GED, OSSD, IGCSE, A-Levels, and
              Myanmar Matriculation to see which fits your goals.
            </p>
          )}
          <div className="pathfinder-actions">
            <button type="button" className="btn btn-primary" onClick={handleRestart}>
              Retake quiz
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page pathfinder-page">
      <header className="pathfinder-hero">
        <p className="eyebrow">Academic path finder</p>
        <h1>Find your path</h1>
        <p className="subtitle">
          Answer {TOTAL_QUESTIONS} short questions. We’ll suggest academic
          pathways like GED, OSSD, IGCSE, A-Levels, or Myanmar Matriculation—so
          you can see what might fit without going to counselling first.
        </p>
      </header>

      <div className="quiz-progress-wrap">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
        <span className="quiz-progress-text">
          Question {currentIndex + 1} of {TOTAL_QUESTIONS}
        </span>
      </div>

      <section className="quiz-question">
        <h2 className="quiz-question-title">{question.text}</h2>
        <ul className="quiz-options" role="list">
          {question.options.map((option) => (
            <li key={option.label}>
              <button
                type="button"
                className="quiz-option"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="pathfinder-actions">
        {currentIndex > 0 && (
          <button type="button" className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}
