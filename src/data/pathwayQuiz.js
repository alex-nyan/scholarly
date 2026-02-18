// Pathway keys used for scoring
export const PATHWAYS = {
  MYANMAR: "myanmar",
  GED: "ged",
  OSSD: "ossd",
  IGCSE: "igcse",
  ALEVEL: "alevel",
};

export const PATHWAY_LABELS = {
  [PATHWAYS.MYANMAR]: "Myanmar Matriculation",
  [PATHWAYS.GED]: "GED (US)",
  [PATHWAYS.OSSD]: "OSSD (Canadian Ontario)",
  [PATHWAYS.IGCSE]: "IGCSE",
  [PATHWAYS.ALEVEL]: "A-Levels (UK)",
};

export const PATHWAY_DESCRIPTIONS = {
  [PATHWAYS.MYANMAR]:
    "Myanmar national curriculum and matriculation exam. Best if you plan to study at a Myanmar university and want local recognition.",
  [PATHWAYS.GED]:
    "General Educational Development (US). Flexible, self-paced, often for adults or those who need a recognized high-school equivalency without traditional school.",
  [PATHWAYS.OSSD]:
    "Ontario Secondary School Diploma (Canadian). Credit-based, often available online. Good for Canada and many international universities.",
  [PATHWAYS.IGCSE]:
    "International GCSE (Cambridge/UK). Broad subject range, exam-based. Widely recognized for UK, Commonwealth, and international study.",
  [PATHWAYS.ALEVEL]:
    "UK A-Levels. Focus on 2–3 subjects in depth. Strong for UK and Commonwealth university entry.",
};

// --- Quiz (10 questions) ---
// Each question: id, text, options.
// Each option: label, scores = { pathwayKey: points }, profile = partial profile fields for scholarship matching.
export const QUIZ_QUESTIONS = [
  {
    id: "study_destination",
    text: "Which country/region are you aiming to study in next?",
    options: [
      {
        label: "Myanmar",
        scores: { myanmar: 3 },
        profile: { study_destination: "MYANMAR" },
      },
      {
        label: "USA / Canada",
        scores: { ged: 2, ossd: 2 },
        profile: { study_destination: "USA_CANADA" },
      },
      {
        label: "UK / Australia / Commonwealth",
        scores: { igcse: 2, alevel: 2, ossd: 1 },
        profile: { study_destination: "UK_COMMONWEALTH" },
      },
      {
        label: "Not sure yet",
        scores: { igcse: 1, ossd: 1, myanmar: 1, ged: 1, alevel: 1 },
        profile: { study_destination: "ANY" },
      },
    ],
  },
  {
    id: "current_level",
    text: "What best describes where you are right now?",
    options: [
      {
        label: "Still in school (Grade 8–10)",
        scores: { myanmar: 2, igcse: 2, ossd: 1 },
        profile: { education_level: "High School" },
      },
      {
        label: "Still in school (Grade 11–12)",
        scores: { myanmar: 2, alevel: 2, igcse: 1, ossd: 1 },
        profile: { education_level: "High School" },
      },
      {
        label: "Finished high school (need an alternative pathway)",
        scores: { ged: 3, ossd: 2 },
        profile: { education_level: "High School" },
      },
      {
        label: "Already in university (want to transfer or apply abroad)",
        scores: { ossd: 1, igcse: 1, alevel: 1 },
        profile: { education_level: "Undergraduate" },
      },
    ],
  },
  {
    id: "target_degree",
    text: "What level are you aiming for next?",
    options: [
      { label: "High school completion", scores: { myanmar: 1, igcse: 1, ossd: 1, ged: 1 }, profile: { target_degree: "High School" } },
      { label: "Undergraduate (Bachelor’s)", scores: { alevel: 1, igcse: 1, ossd: 1, ged: 1 }, profile: { target_degree: "Undergraduate" } },
      { label: "Graduate (Master’s/PhD)", scores: { alevel: 1, igcse: 1, ossd: 1, ged: 1 }, profile: { target_degree: "Graduate" } },
      { label: "Not sure", scores: {}, profile: { target_degree: "Any" } },
    ],
  },
  {
    id: "timeline",
    text: "How quickly do you want to finish your next qualification?",
    options: [
      { label: "As fast as possible (under 1 year)", scores: { ged: 3, ossd: 1 }, profile: { timeline: "FAST" } },
      { label: "1–2 years", scores: { ossd: 2, igcse: 2, alevel: 1 }, profile: { timeline: "MEDIUM" } },
      { label: "2+ years (structured path)", scores: { myanmar: 2, alevel: 2, igcse: 1 }, profile: { timeline: "LONG" } },
      { label: "No strict deadline", scores: { ossd: 1, ged: 1, igcse: 1 }, profile: { timeline: "FLEXIBLE" } },
    ],
  },
  {
    id: "learning_style",
    text: "What learning style fits you best?",
    options: [
      { label: "Exam-focused (I perform well in exams)", scores: { myanmar: 2, igcse: 2, alevel: 2 }, profile: { learning_style: "EXAM" } },
      { label: "Coursework + exams (balanced)", scores: { ossd: 2, igcse: 1 }, profile: { learning_style: "BALANCED" } },
      { label: "Credit-based / projects (continuous assessment)", scores: { ossd: 3 }, profile: { learning_style: "COURSEWORK" } },
      { label: "Self-paced / flexible schedule", scores: { ged: 3, ossd: 1 }, profile: { learning_style: "FLEX" } },
    ],
  },
  {
    id: "schedule",
    text: "How much time can you realistically study each week?",
    options: [
      { label: "Under 10 hours (very limited)", scores: { ged: 2, ossd: 1 }, profile: { schedule: "LOW" } },
      { label: "10–20 hours (part-time)", scores: { ossd: 2, ged: 1 }, profile: { schedule: "MEDIUM" } },
      { label: "20–30 hours", scores: { igcse: 1, alevel: 1, myanmar: 1 }, profile: { schedule: "HIGH" } },
      { label: "30+ hours (full-time)", scores: { myanmar: 2, igcse: 2, alevel: 2 }, profile: { schedule: "FULL_TIME" } },
    ],
  },
  {
    id: "english",
    text: "How comfortable are you studying in English?",
    options: [
      { label: "Beginner", scores: { myanmar: 2 }, profile: { english: "BEGINNER" } },
      { label: "Intermediate", scores: { igcse: 1, ossd: 1 }, profile: { english: "INTERMEDIATE" } },
      { label: "Strong", scores: { igcse: 2, alevel: 2, ossd: 1, ged: 1 }, profile: { english: "STRONG" } },
      { label: "Native / bilingual", scores: { alevel: 1, igcse: 1, ossd: 1, ged: 1 }, profile: { english: "NATIVE" } },
    ],
  },
  {
    id: "recognition",
    text: "How important is Myanmar-local recognition for you?",
    options: [
      { label: "Essential (must work locally)", scores: { myanmar: 3 }, profile: { recognition: "LOCAL" } },
      { label: "Nice to have", scores: { myanmar: 2 }, profile: { recognition: "PREFER_LOCAL" } },
      { label: "Prefer international", scores: { igcse: 1, alevel: 1, ossd: 1 }, profile: { recognition: "INTERNATIONAL" } },
      { label: "International only", scores: { ged: 1, ossd: 1, igcse: 1, alevel: 1 }, profile: { recognition: "INTERNATIONAL_ONLY" } },
    ],
  },
  {
    id: "budget",
    text: "What’s your budget for tuition/exams right now?",
    options: [
      { label: "Very limited", scores: { myanmar: 2, ged: 1 }, profile: { budget: "LOW" } },
      { label: "Moderate", scores: { igcse: 1, ossd: 1 }, profile: { budget: "MEDIUM" } },
      { label: "Can invest in quality", scores: { alevel: 2, igcse: 2, ossd: 1 }, profile: { budget: "HIGH" } },
      { label: "Not a main concern", scores: { alevel: 1, igcse: 1, ossd: 1 }, profile: { budget: "ANY" } },
    ],
  },
  {
    id: "field",
    text: "What subject area do you want to focus on?",
    options: [
      { label: "STEM (science / tech / engineering / math)", scores: { alevel: 1, igcse: 1, myanmar: 1 }, profile: { field: "STEM" } },
      { label: "Arts / Design / Humanities", scores: { igcse: 1, ossd: 1 }, profile: { field: "ARTS" } },
      { label: "Business / Economics", scores: { ossd: 1, igcse: 1 }, profile: { field: "BUSINESS" } },
      { label: "Health / Medicine / Nursing", scores: { alevel: 1, igcse: 1 }, profile: { field: "HEALTH" } },
      { label: "Not sure", scores: {}, profile: { field: "ANY" } },
    ],
  },
];

/** Sum scores from all answers and return pathway keys sorted by total (desc). */
export function computeScores(answers) {
  const totals = { myanmar: 0, ged: 0, ossd: 0, igcse: 0, alevel: 0 };
  for (const answer of answers) {
    if (!answer || !answer.scores) continue;
    for (const [pathway, points] of Object.entries(answer.scores)) {
      if (pathway in totals) totals[pathway] += points;
    }
  }
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({ pathway: key, score }));
}

export function buildStudentProfile(answers) {
  const profile = {
    study_destination: "ANY",
    education_level: "Any",
    target_degree: "Any",
    field: "ANY",
    timeline: "FLEXIBLE",
    learning_style: "BALANCED",
    schedule: "MEDIUM",
    english: "INTERMEDIATE",
    recognition: "INTERNATIONAL",
    budget: "MEDIUM",
  };

  for (const answer of answers) {
    if (!answer?.profile) continue;
    Object.assign(profile, answer.profile);
  }

  // Prefer target_degree when it provides a clear education level for scholarships.
  if (profile.target_degree && profile.target_degree !== "Any") {
    profile.education_level = profile.target_degree;
  }

  return profile;
}

export function explainTopPathway(answers, topPathway) {
  const contributions = answers
    .map((answer, idx) => {
      const pts = answer?.scores?.[topPathway] ?? 0;
      const q = QUIZ_QUESTIONS[idx];
      return {
        idx,
        points: pts,
        question: q?.text || "Question",
        choice: answer?.label || "—",
      };
    })
    .filter((c) => c.points > 0)
    .sort((a, b) => b.points - a.points);

  const topReasons = contributions.slice(0, 4);
  if (topReasons.length === 0) {
    return ["Your answers were mixed, so we chose the closest overall fit."];
  }

  return topReasons.map((r) => `${r.question} — you chose “${r.choice}”.`);
}

function normalizeToSet(value) {
  if (!value) return new Set();
  if (Array.isArray(value)) return new Set(value.map((v) => String(v).trim()).filter(Boolean));
  return new Set(String(value).split(",").map((v) => v.trim()).filter(Boolean));
}

function matchesEducationLevel(profileLevel, scholarshipLevelsSet) {
  if (!profileLevel || profileLevel === "Any") return true;
  if (!scholarshipLevelsSet || scholarshipLevelsSet.size === 0) return true;
  const normalized = profileLevel.toLowerCase();
  const levels = Array.from(scholarshipLevelsSet).map((s) => s.toLowerCase());
  if (levels.some((l) => l === "any")) return true;
  return levels.some((l) => l.includes(normalized) || normalized.includes(l));
}

export function filterEligibleScholarships(scholarships, profile) {
  const desiredDestination = profile?.study_destination || "ANY";
  const desiredField = profile?.field || "ANY";
  const desiredEducation = profile?.education_level || "Any";

  return scholarships.filter((s) => {
    const destinations = normalizeToSet(s.study_destinations);
    const fields = normalizeToSet(s.fields);
    const levels = normalizeToSet(s.education_levels || s.education_level);

    const destinationOk =
      desiredDestination === "ANY" ||
      destinations.size === 0 ||
      destinations.has("ANY") ||
      destinations.has(desiredDestination);

    const fieldOk =
      desiredField === "ANY" ||
      fields.size === 0 ||
      fields.has("ANY") ||
      fields.has(desiredField);

    const educationOk = matchesEducationLevel(desiredEducation, levels);

    return destinationOk && fieldOk && educationOk;
  });
}
