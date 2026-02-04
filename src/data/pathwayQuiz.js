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

// Each question: id, text, options. Each option: label, scores = { pathwayKey: points }
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "What is your current education level?",
    options: [
      { label: "Grade 8 or below", scores: { myanmar: 2, ged: 1, ossd: 1 } },
      { label: "Grade 9–10", scores: { myanmar: 2, igcse: 2, ossd: 1, alevel: 0 } },
      { label: "Grade 11+", scores: { myanmar: 2, alevel: 2, ossd: 1, ged: 0 } },
      { label: "Finished high school (need equivalency)", scores: { ged: 3, ossd: 1 } },
    ],
  },
  {
    id: 2,
    text: "What is your main goal?",
    options: [
      { label: "Study at a Myanmar university", scores: { myanmar: 3 } },
      { label: "Study abroad (UK, Australia, etc.)", scores: { igcse: 2, alevel: 2, ossd: 1 } },
      { label: "Study in USA or Canada", scores: { ged: 2, ossd: 2 } },
      { label: "Get a recognized certificate for work", scores: { ged: 2, ossd: 1 } },
      { label: "Not sure yet", scores: { igcse: 1, ossd: 1, myanmar: 1 } },
    ],
  },
  {
    id: 3,
    text: "How do you prefer to learn?",
    options: [
      { label: "Exams at the end of the year", scores: { myanmar: 2, igcse: 2, alevel: 2 } },
      { label: "Mix of coursework and exams", scores: { ossd: 2, igcse: 1 } },
      { label: "Mainly projects and credits", scores: { ossd: 3 } },
      { label: "Self-paced, when I'm ready", scores: { ged: 3, ossd: 1 } },
    ],
  },
  {
    id: 4,
    text: "What is your timeline to finish?",
    options: [
      { label: "Within 1 year", scores: { ged: 2, ossd: 1 } },
      { label: "1–2 years", scores: { igcse: 2, ossd: 2, alevel: 1 } },
      { label: "2+ years", scores: { myanmar: 2, alevel: 2, igcse: 1 } },
      { label: "No rush", scores: { ged: 2, ossd: 1 } },
    ],
  },
  {
    id: 5,
    text: "Where do you plan to study after this qualification?",
    options: [
      { label: "Stay in Myanmar", scores: { myanmar: 3 } },
      { label: "UK, Australia, or Commonwealth", scores: { igcse: 2, alevel: 2 } },
      { label: "USA or Canada", scores: { ged: 2, ossd: 2 } },
      { label: "Not decided", scores: { igcse: 1, ossd: 1 } },
    ],
  },
  {
    id: 6,
    text: "What is your budget for tuition and exams?",
    options: [
      { label: "Very limited", scores: { myanmar: 2, ged: 1 } },
      { label: "Moderate", scores: { igcse: 1, ossd: 1 } },
      { label: "Can invest in quality", scores: { alevel: 2, igcse: 2, ossd: 1 } },
      { label: "Not a main concern", scores: { alevel: 1, igcse: 1, ossd: 1 } },
    ],
  },
  {
    id: 7,
    text: "Do you prefer studying many subjects or focusing on a few?",
    options: [
      { label: "Many subjects (broad)", scores: { igcse: 2, myanmar: 1, ossd: 1 } },
      { label: "3–4 subjects", scores: { igcse: 2, ossd: 1 } },
      { label: "2–3 subjects in depth", scores: { alevel: 3 } },
      { label: "One area only", scores: { ged: 1, ossd: 1 } },
    ],
  },
  {
    id: 8,
    text: "How is your English?",
    options: [
      { label: "Beginner", scores: { myanmar: 2 } },
      { label: "Intermediate", scores: { igcse: 1, ossd: 1 } },
      { label: "Strong", scores: { igcse: 2, alevel: 2, ossd: 1, ged: 1 } },
      { label: "Native or bilingual", scores: { alevel: 1, igcse: 1, ossd: 1, ged: 1 } },
    ],
  },
  {
    id: 9,
    text: "Do you need a qualification recognized in Myanmar?",
    options: [
      { label: "Yes, essential", scores: { myanmar: 3 } },
      { label: "Prefer yes", scores: { myanmar: 2 } },
      { label: "Prefer international", scores: { igcse: 1, alevel: 1, ossd: 1 } },
      { label: "International only", scores: { ged: 1, ossd: 1, igcse: 1, alevel: 1 } },
    ],
  },
  {
    id: 10,
    text: "Are you working or have other commitments?",
    options: [
      { label: "Yes, I need a flexible schedule", scores: { ged: 3, ossd: 2 } },
      { label: "Part-time", scores: { ossd: 2, ged: 1 } },
      { label: "No, I can study full-time", scores: { myanmar: 1, igcse: 1, alevel: 1 } },
    ],
  },
  {
    id: 11,
    text: "Where would you prefer to take exams?",
    options: [
      { label: "In Myanmar only", scores: { myanmar: 2, ged: 1 } },
      { label: "Willing to travel if needed", scores: { igcse: 1, alevel: 1 } },
      { label: "Online only", scores: { ossd: 2, ged: 1 } },
      { label: "Either", scores: { ossd: 1, igcse: 1 } },
    ],
  },
  {
    id: 12,
    text: "Which subjects interest you most?",
    options: [
      { label: "STEM (science, math, tech)", scores: { alevel: 2, igcse: 1, myanmar: 1 } },
      { label: "Arts & humanities", scores: { igcse: 2, ossd: 1 } },
      { label: "Business", scores: { igcse: 1, ossd: 2 } },
      { label: "Mixed", scores: { igcse: 2, myanmar: 1, ossd: 1 } },
    ],
  },
  {
    id: 13,
    text: "Have you already started a curriculum?",
    options: [
      { label: "No", scores: {} },
      { label: "Yes, Myanmar system", scores: { myanmar: 3 } },
      { label: "Yes, international (e.g. IGCSE)", scores: { igcse: 2, alevel: 2 } },
      { label: "Dropped out, want to restart", scores: { ged: 2, ossd: 1 } },
    ],
  },
  {
    id: 14,
    text: "What type of recognition matters most to you?",
    options: [
      { label: "Myanmar government / local universities", scores: { myanmar: 3 } },
      { label: "UK / Commonwealth universities", scores: { igcse: 2, alevel: 2 } },
      { label: "US / Canadian universities", scores: { ged: 2, ossd: 2 } },
      { label: "Any internationally recognized", scores: { igcse: 1, alevel: 1, ossd: 1, ged: 1 } },
    ],
  },
  {
    id: 15,
    text: "How many hours per week can you study?",
    options: [
      { label: "Under 10 hours", scores: { ged: 2, ossd: 1 } },
      { label: "10–20 hours", scores: { ossd: 2, ged: 1 } },
      { label: "20–30 hours", scores: { igcse: 1, alevel: 1, myanmar: 1 } },
      { label: "30+ hours (full-time)", scores: { myanmar: 2, igcse: 2, alevel: 2 } },
    ],
  },
  {
    id: 16,
    text: "Do you prefer online, in-person, or hybrid?",
    options: [
      { label: "Online only", scores: { ossd: 2, ged: 2 } },
      { label: "In-person only", scores: { myanmar: 2 } },
      { label: "Hybrid", scores: { igcse: 1, ossd: 1 } },
      { label: "No preference", scores: {} },
    ],
  },
  {
    id: 17,
    text: "Are you aiming for a scholarship abroad?",
    options: [
      { label: "Yes, UK / Commonwealth", scores: { alevel: 2, igcse: 2 } },
      { label: "Yes, USA", scores: { ged: 1, ossd: 1 } },
      { label: "Yes, Myanmar", scores: { myanmar: 2 } },
      { label: "No / Not sure", scores: {} },
    ],
  },
  {
    id: 18,
    text: "How do you feel about standardized exams?",
    options: [
      { label: "I prefer to avoid them", scores: { ossd: 2, ged: 1 } },
      { label: "Okay with some exams", scores: { igcse: 1, myanmar: 1 } },
      { label: "I'm good at exams", scores: { myanmar: 2, igcse: 2, alevel: 2 } },
    ],
  },
  {
    id: 19,
    text: "What describes your situation best?",
    options: [
      { label: "Young student still in school", scores: { myanmar: 2, igcse: 2 } },
      { label: "Older, returning to education", scores: { ged: 2, ossd: 1 } },
      { label: "Need a quick certificate", scores: { ged: 2 } },
      { label: "Planning long-term for university", scores: { alevel: 2, igcse: 1, myanmar: 1 } },
    ],
  },
  {
    id: 20,
    text: "Would you consider studying outside Myanmar for the program?",
    options: [
      { label: "No, must be in Myanmar", scores: { myanmar: 2 } },
      { label: "Yes, if it's online", scores: { ossd: 2, ged: 1, igcse: 0 } },
      { label: "Yes, short courses abroad", scores: { igcse: 1, alevel: 1 } },
      { label: "Yes, full program abroad", scores: { alevel: 2, igcse: 2, ossd: 1 } },
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
