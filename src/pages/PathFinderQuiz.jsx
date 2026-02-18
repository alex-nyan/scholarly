import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  QUIZ_QUESTIONS,
  PATHWAY_LABELS,
  PATHWAY_DESCRIPTIONS,
  computeScores,
  buildStudentProfile,
  explainTopPathway,
  filterEligibleScholarships,
} from "../data/pathwayQuiz";

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
const SCHOLARSHIPS_URL = "/scholarships.json";

export default function PathFinderQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const [schStatus, setSchStatus] = useState({ loading: true, error: "" });

  const results = useMemo(() => computeScores(answers), [answers]);
  const top = results[0];
  const pathway = top?.pathway || "myanmar";
  const profile = useMemo(() => buildStudentProfile(answers), [answers]);
  const reasons = useMemo(() => explainTopPathway(answers, pathway), [answers, pathway]);
  const eligible = useMemo(
    () => filterEligibleScholarships(scholarships, profile),
    [scholarships, profile]
  );

  const question = QUIZ_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;
  const isLast = currentIndex === TOTAL_QUESTIONS - 1;

  useEffect(() => {
    let mounted = true;
    setSchStatus({ loading: true, error: "" });
    fetch(SCHOLARSHIPS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load scholarships");
        return res.json();
      })
      .then((payload) => {
        if (!mounted) return;
        const list = Array.isArray(payload?.results) ? payload.results : [];
        setScholarships(list.map((item, idx) => ({ ...item, id: idx })));
        setSchStatus({ loading: false, error: "" });
      })
      .catch((err) => {
        if (!mounted) return;
        setScholarships([]);
        setSchStatus({ loading: false, error: err.message || "Failed to load scholarships" });
      });
    return () => {
      mounted = false;
    };
  }, []);

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
    return (
      <div className="page pathfinder-page">
        <header className="pathfinder-hero">
          <p className="eyebrow">Your results</p>
          <h1>Academic path recommendation</h1>
          <p className="subtitle">
            One best-fit pathway, plus scholarships you may be eligible for based on your answers.
            This is a guide—always double-check requirements on the official scholarship page.
          </p>
        </header>

        <section className="pathfinder-results">
          <div className="result-card">
            <span className="result-rank">Recommended</span>
            <h2>{PATHWAY_LABELS[pathway]}</h2>
            <p className="result-desc">{PATHWAY_DESCRIPTIONS[pathway]}</p>
            <p className="result-score">Match score: {top?.score ?? 0}</p>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18 }}>Why this pathway?</h2>
            <ul className="results-list" style={{ listStyle: "disc", paddingLeft: 18 }}>
              {reasons.map((r) => (
                <li key={r} style={{ marginTop: 6 }}>
                  <span className="result-desc">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Scholarships you may be eligible for</h2>
            {schStatus.loading && <p className="status">Loading scholarships…</p>}
            {!schStatus.loading && schStatus.error && <p className="error">{schStatus.error}</p>}
            {!schStatus.loading && !schStatus.error && eligible.length === 0 && (
              <p className="result-empty">
                No scholarships matched your current preferences. Add eligibility fields (destination, level, field)
                to your scholarships JSON to enable better filtering.
              </p>
            )}
            {!schStatus.loading && !schStatus.error && eligible.length > 0 && (
              <div className="scholarships-grid" style={{ marginTop: 12 }}>
                {eligible.map((s) => (
                  <Link key={s.id} to={`/scholarships/${s.id}`} className="scholarship-card">
                    <div className="scholarship-card-header">
                      <span className="scholarship-card-source">{s.source}</span>
                      {s.education_level && <span className="scholarship-card-tag">{s.education_level}</span>}
                    </div>
                    <h3 className="scholarship-card-title" style={{ marginBottom: 10 }}>{s.message || "Untitled"}</h3>
                    {(s.amount || s.deadline) && (
                      <div className="scholarship-card-meta">
                        {s.amount && <span>{s.amount}</span>}
                        {s.deadline && <span>{s.deadline}</span>}
                      </div>
                    )}
                    <span className="scholarship-card-cta">View details →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
          Answer {TOTAL_QUESTIONS} quick questions. You’ll get one recommended pathway
          (GED, OSSD, IGCSE, A-Levels, or Myanmar Matriculation) plus scholarships you may be eligible for.
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
