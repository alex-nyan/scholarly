import { useState } from "react";
import {
  QUIZ_QUESTIONS,
  PATHWAY_LABELS,
  PATHWAY_DESCRIPTIONS,
  computeScores,
} from "../data/pathwayQuiz";
import {
  COUNSELING_SCENARIOS,
  FOUNDATION_FUTURE_STEPS,
  getMatchingScholarships,
} from "../data/mockScholarships";

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

const FUNDING_LABELS = {
  full: "Full scholarship",
  partial: "Partial award",
  stipend: "Monthly stipend",
};

function buildScholarshipTags(ranked, flag) {
  const tags = [];
  ranked.slice(0, 2).forEach((r) => { if (r.score > 0) tags.push(r.pathway); });
  if (ranked.some((r) => r.pathway === "alevel" && r.score > 0)) tags.push("grade11+");
  if (ranked.some((r) => r.pathway === "igcse" && r.score > 0)) tags.push("grade9+");
  if (flag === null && ranked[0]?.score > 0) tags.push("standard");
  tags.push("international");
  return tags;
}

function CounselingBanner({ scenario }) {
  const copy = COUNSELING_SCENARIOS[scenario] ?? COUNSELING_SCENARIOS.standard;
  return (
    <div className="counseling-banner">
      <p className="counseling-banner__eyebrow">Counsellor note</p>
      <h2 className="counseling-banner__headline">{copy.headline}</h2>
      <p className="counseling-banner__body">{copy.body}</p>
    </div>
  );
}

function FoundationGuide() {
  return (
    <section className="foundation-guide">
      <h3 className="foundation-guide__title">Your future steps</h3>
      <ol className="foundation-guide__steps">
        {FOUNDATION_FUTURE_STEPS.map(({ step, title, description }) => (
          <li key={step} className="foundation-guide__step">
            <span className="foundation-guide__step-num">{step}</span>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ScholarshipCard({ scholarship }) {
  const { name, amount, location, fundingType, description, url } = scholarship;
  const amountLabel = amount === 0 ? "Full coverage" : `Up to $${amount.toLocaleString()}`;
  return (
    <li className="scholarship-card">
      <div className="scholarship-card__header">
        <span className="scholarship-card__badge">{FUNDING_LABELS[fundingType] ?? fundingType}</span>
        <span className="scholarship-card__amount">{amountLabel}</span>
      </div>
      <h4 className="scholarship-card__name">{name}</h4>
      <p className="scholarship-card__location">📍 {location}</p>
      <p className="scholarship-card__desc">{description}</p>
      <a
        className="scholarship-card__link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more →
      </a>
    </li>
  );
}

function DemoDisclaimer() {
  return (
    <aside className="demo-disclaimer" role="note">
      <strong>⚠️ Demo Data</strong> — Scholarship details are illustrative only.
      Amounts, eligibility, and deadlines must be verified on official programme
      websites before advising students. This tool is not a substitute for
      professional academic counselling.
    </aside>
  );
}

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
    const { ranked, flag } = computeScores(answers);
    const isFoundation = flag === "FOUNDATION_REQUIRED";

    let scenarioKey = "standard";
    if (isFoundation) {
      scenarioKey = "foundation";
    } else if (ranked[0]?.pathway === "ged" && ranked[0]?.score >= 6) {
      scenarioKey = "fasttrack";
    }

    const top = ranked.slice(0, 3).filter((r) => r.score > 0);

    const scholarships = isFoundation
      ? []
      : getMatchingScholarships(buildScholarshipTags(ranked, flag));

    return (
      <div className="page pathfinder-page">
        <DemoDisclaimer />

        <header className="pathfinder-hero">
          <p className="eyebrow">Your results</p>
          <h1>Academic path recommendation</h1>
          <p className="subtitle">
            Based on your answers, here are the pathways that may fit you best.
            This is a guide — always speak to a counsellor before making a major
            education decision.
          </p>
        </header>

        <CounselingBanner scenario={scenarioKey} />

        <section className="pathfinder-results">
          {isFoundation ? (
            <FoundationGuide />
          ) : (
            <>
              {top.length > 0 ? (
                <ul className="results-list">
                  {top.map(({ pathway, score, counselingNote }, rank) => (
                    <li key={pathway} className="result-card">
                      <span className="result-rank">#{rank + 1}</span>
                      <h2>{PATHWAY_LABELS[pathway]}</h2>
                      {counselingNote && (
                        <p className="result-counseling-note">{counselingNote}</p>
                      )}
                      <p className="result-desc">{PATHWAY_DESCRIPTIONS[pathway]}</p>
                      <p className="result-score">Match score: {score}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="result-empty">
                  Your answers were mixed across pathways. Try the quiz again
                  with different choices, or speak to a counsellor directly.
                </p>
              )}

              {scholarships.length > 0 && (
                <section className="scholarships-section">
                  <h3 className="scholarships-section__title">
                    Matched scholarships &amp; funding
                  </h3>
                  <p className="scholarships-section__subtitle">
                    The following awards may be relevant to your top pathways.
                    Eligibility must be confirmed independently.
                  </p>
                  <ul className="scholarships-list">
                    {scholarships.map((s) => (
                      <ScholarshipCard key={s.id} scholarship={s} />
                    ))}
                  </ul>
                </section>
              )}
            </>
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
          Answer {TOTAL_QUESTIONS} short questions. We'll suggest academic
          pathways like GED, OSSD, IGCSE, A-Levels, or Myanmar Matriculation —
          so you can explore options before speaking with a counsellor.
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
