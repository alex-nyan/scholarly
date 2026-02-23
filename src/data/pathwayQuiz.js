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
    text: "What is your total budget for the full program (tuition, exams & materials)?",
    options: [
      { label: "Budget: < $1,000", scores: { myanmar: 2, ged: 1 } },
      { label: "Mid: $1,000 – $5,000", scores: { igcse: 1, ossd: 1, ged: 1 } },
      { label: "Premium: $5,000 – $15,000", scores: { alevel: 2, igcse: 2, ossd: 1 } },
      { label: "High: > $15,000", scores: { alevel: 1, igcse: 1, ossd: 1 } },
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
  {
    id: 21,
    text: "How old are you?",
    // Age is used as a gatekeeper in computeScores — not for scoring points.
    // The labels must stay exactly as written; computeScores matches on them.
    options: [
      { label: "Under 16", scores: {} },
      { label: "16 or older", scores: {} },
    ],
  },
];

// =============================================================================
// COUNSELING BRAIN
// Gatekeeper indices:
//   Q1  → answers[0]  — education level  ("Grade 8 or below")
//   Q21 → answers[20] — age gate         ("Under 16" | "16 or older")
// =============================================================================

/**
 * Evaluate quiz answers and return a counseling-driven ranked result set.
 *
 * Gatekeeper rules applied BEFORE ranking:
 *   1. Foundation Gate  — Grade 8 or below AND Under 16    → FOUNDATION_REQUIRED
 *   2. Fast-Track       — Grade 8 or below AND 16 or older → GED boosted +6
 *   3. Clamping         — Grade 8 or below (any age)       → ALEVEL & OSSD zeroed
 *
 * @param {Array<{label: string, scores: Object}|null>} answers
 * @returns {{ ranked: Array<{pathway:string, score:number, counselingNote:string}>, flag: string|null }}
 */
export function computeScores(answers) {
  // 1. Read gatekeeper signals
  const gradeAnswer = answers[0];
  const ageAnswer = answers[20];

  const isGrade8OrBelow = gradeAnswer?.label === "Grade 8 or below";
  const isUnder16 = ageAnswer?.label === "Under 16";
  const is16OrOlder = ageAnswer?.label === "16 or older";

  // 2. Accumulate raw scores from all answers
  const totals = { myanmar: 0, ged: 0, ossd: 0, igcse: 0, alevel: 0 };
  for (const answer of answers) {
    if (!answer || !answer.scores) continue;
    for (const [pathway, points] of Object.entries(answer.scores)) {
      if (pathway in totals) totals[pathway] += points;
    }
  }

  // 3. Apply gatekeeper mutations
  let flag = null;
  let counselingTag = "standard";

  if (isGrade8OrBelow && isUnder16) {
    flag = "FOUNDATION_REQUIRED";
    counselingTag = "foundation";
    // Suppress all pathways — student not yet eligible
    for (const key of Object.keys(totals)) totals[key] = 0;

  } else if (isGrade8OrBelow && is16OrOlder) {
    counselingTag = "fasttrack";
    totals.ged += 6;   // Fast-Track boost
    totals.alevel = 0;   // Clamp
    totals.ossd = 0;   // Clamp

  } else if (isGrade8OrBelow) {
    // Grade low, age unknown — clamp only
    totals.alevel = 0;
    totals.ossd = 0;
  }

  // 4. Build counseling notes
  const notes = buildCounselingNotes(counselingTag, { isGrade8OrBelow });

  // 5. Sort and attach notes
  const ranked = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([pathway, score]) => ({
      pathway,
      score,
      counselingNote: notes[pathway] ?? "",
    }));

  return { ranked, flag };
}

// -----------------------------------------------------------------------------
// Counseling Dictionary — Myanmar-specific guidance text
// Scenarios: "foundation" | "fasttrack" | "standard"
// -----------------------------------------------------------------------------
function buildCounselingNotes(scenario, { isGrade8OrBelow }) {
  if (scenario === "foundation") {
    return {
      myanmar: "You are on a foundation path. Completing Grade 9–10 opens every pathway listed here.",
      ged: "GED becomes available at age 16. For now, focus on catching up through a community learning centre or monastic school.",
      ossd: "OSSD requires a stronger academic base. Keep studying — you will be eligible in a few years.",
      igcse: "IGCSE is a great future goal. Build your foundation now and revisit at Grade 9.",
      alevel: "A-Levels require at least Grade 10 completion. Stay on your current school path.",
    };
  }

  if (scenario === "fasttrack") {
    return {
      myanmar: "Your age and life experience can complement Myanmar Matriculation. Consider a catch-up programme at a private school.",
      ged: "GED is your fastest route to an internationally recognised high-school equivalency. Many Myanmar adults complete it in 6–12 months. Strong choice for your situation.",
      ossd: "OSSD is credit-based and flexible, but works best from a Grade 9 starting point. Pursue GED first, then consider OSSD for university prep.",
      igcse: "IGCSE is possible but demands solid subject knowledge. Discuss with a counsellor whether direct entry or a bridging course suits you.",
      alevel: "A-Levels are not recommended at this stage. A GED or IGCSE foundation first will set you up for A-Level success later.",
    };
  }

  // standard path
  const gradeNote = isGrade8OrBelow
    ? " Confirm your grade level with an academic counsellor before enrolling."
    : "";

  return {
    myanmar: `Myanmar Matriculation aligns well with your profile. It provides strong local university recognition.${gradeNote}`,
    ged: `GED offers flexibility and speed — ideal if you need an accredited qualification quickly or are balancing work and study.${gradeNote}`,
    ossd: `The Ontario OSSD is credit-based and widely accepted internationally. A strong option for Canada-bound or online learners.${gradeNote}`,
    igcse: `IGCSE covers a broad subject range and is respected across the UK, Australia, and Southeast Asia.${gradeNote}`,
    alevel: `A-Levels offer deep subject focus — ideal for STEM or UK university entry. Requires a 2-year commitment.${gradeNote}`,
  };
}