// =============================================================================
// MOCK SCHOLARSHIPS & COUNSELING DICTIONARY
// src/data/mockScholarships.js
//
// ⚠️  DEMO DATA — All scholarship details are illustrative.
//     Amounts, deadlines, and eligibility criteria must be verified
//     against official programme websites before sharing with students.
// =============================================================================

/**
 * @typedef {Object} Scholarship
 * @property {string}   id
 * @property {string}   name
 * @property {number}   amount          — USD (0 = full coverage)
 * @property {string}   location
 * @property {"full"|"partial"|"stipend"} fundingType
 * @property {string[]} eligibilityTags — matched against pathway keys & situation flags
 * @property {string}   url
 * @property {string}   description
 */

export const MOCK_SCHOLARSHIPS = [
    {
        id: "daad-myanmar",
        name: "DAAD Myanmar Development-Related Postgraduate Courses",
        amount: 0,
        location: "Germany (on-site)",
        fundingType: "full",
        eligibilityTags: ["alevel", "ossd", "igcse", "grade11+", "international"],
        url: "https://www.daad.de",
        description:
            "Full scholarship covering tuition, living costs and travel for Myanmar students pursuing postgraduate study in Germany. Requires a completed secondary qualification (A-Level, IGCSE, or equivalent).",
    },
    {
        id: "unicef-oosc-mm",
        name: "UNICEF Out-of-School Children Reintegration Grant",
        amount: 500,
        location: "Myanmar (in-country)",
        fundingType: "stipend",
        eligibilityTags: ["ged", "myanmar", "interrupted", "displaced", "fasttrack"],
        url: "https://www.unicef.org/myanmar",
        description:
            "Monthly stipend to support adolescents re-entering formal or non-formal education after an interruption. Prioritises displaced and conflict-affected youth.",
    },
    {
        id: "british-council-ielts-award",
        name: "British Council Myanmar Study UK Award",
        amount: 10000,
        location: "United Kingdom (on-site)",
        fundingType: "partial",
        eligibilityTags: ["alevel", "igcse", "international", "grade11+"],
        url: "https://www.britishcouncil.org.mm",
        description:
            "Partial award for Myanmar students with strong A-Level or IGCSE results who have been accepted to a UK university. Covers up to 50% of first-year tuition.",
    },
    {
        id: "aga-khan-foundation",
        name: "Aga Khan Foundation International Scholarship",
        amount: 0,
        location: "Various (international)",
        fundingType: "full",
        eligibilityTags: ["ossd", "alevel", "igcse", "international", "grade11+"],
        url: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
        description:
            "Needs-based full scholarship for postgraduate study at top international universities. Open to students from developing countries including Myanmar.",
    },
    {
        id: "ged-testing-waiver-mm",
        name: "GED Testing Fee Waiver — Myanmar Pilot",
        amount: 200,
        location: "Myanmar / Online",
        fundingType: "partial",
        eligibilityTags: ["ged", "fasttrack", "interrupted", "displaced"],
        url: "https://ged.com",
        description:
            "Covers GED exam registration fees for Myanmar youth who cannot afford the standard testing cost. Administered through partner learning centres. Demo data — verify availability.",
    },
    {
        id: "ossd-online-bursary",
        name: "Ontario e-Learning Consortium Bursary",
        amount: 1500,
        location: "Canada / Online",
        fundingType: "partial",
        eligibilityTags: ["ossd", "international", "grade9+"],
        url: "https://www.ontario.ca/page/ontarios-e-learning-strategy",
        description:
            "Partial bursary towards OSSD online credit costs for international students in conflict-affected regions. Supports flexible, self-paced learners.",
    },
    {
        id: "myanmar-universities-central-award",
        name: "Myanmar Universities Central Council Excellence Award",
        amount: 800,
        location: "Myanmar (in-country)",
        fundingType: "partial",
        eligibilityTags: ["myanmar", "grade11+", "standard"],
        url: "https://www.mucc.edu.mm",
        description:
            "Annual merit award for high-achieving students entering Myanmar public universities through the national matriculation exam. Covers first-year hostel and book fees.",
    },
    {
        id: "east-meets-west-igcse",
        name: "East Meets West Foundation IGCSE Scholarship",
        amount: 3000,
        location: "Myanmar / Thailand (hybrid)",
        fundingType: "partial",
        eligibilityTags: ["igcse", "displaced", "interrupted", "grade9+"],
        url: "https://eastmeetswest.org",
        description:
            "Supports displaced Myanmar students accessing IGCSE programmes at partner schools on the Thai-Myanmar border or online. Covers tuition and study materials.",
    },
];

// =============================================================================
// COUNSELING SCENARIOS DICTIONARY
// Keyed by scenario: "foundation" | "fasttrack" | "interrupted" | "displaced" | "standard"
// =============================================================================

/**
 * @typedef {Object} ScenarioCopy
 * @property {string} headline
 * @property {string} body
 * @property {string} callToAction
 */

/** @type {Record<string, ScenarioCopy>} */
export const COUNSELING_SCENARIOS = {
    foundation: {
        headline: "Your next step: Build your foundation",
        body:
            "You are at an important early stage of your education journey. Right now the best move is to complete Grade 9–10 through a community learning centre, monastic school, or catch-up programme. Once you reach Grade 9 level you will unlock access to GED, IGCSE, OSSD, and A-Levels — plus scholarships that come with them.",
        callToAction: "Find a learning centre near you",
    },

    fasttrack: {
        headline: "Your situation qualifies for a fast-track route",
        body:
            "Even though your formal schooling was interrupted, your age means you can access the GED right now. The GED is a recognised high-school equivalency used by universities in the US, Canada, and beyond. Many Myanmar adults complete all four subject tests within 6–12 months. From there, OSSD and university pathways open up.",
        callToAction: "Learn more about GED in Myanmar",
    },

    interrupted: {
        headline: "Returning to education — you have strong options",
        body:
            "Gaps in schooling are common for young people in Myanmar, and there are programmes designed specifically for your situation. GED and OSSD both offer flexible, self-paced study that fits around work or family commitments. Several scholarships below prioritise students with interrupted education.",
        callToAction: "Explore flexible programme options",
    },

    displaced: {
        headline: "Support is available for displaced learners",
        body:
            "If you are away from your home region or have had to move, there are scholarships and programmes built specifically for you. IGCSE and GED can both be studied online or at border learning centres. UNICEF and East Meets West Foundation programmes below offer financial support and safe study environments.",
        callToAction: "See displaced learner scholarships",
    },

    standard: {
        headline: "You have a clear academic pathway ahead",
        body:
            "Based on your answers, you are well-positioned to pursue structured qualifications. Your top-ranked pathways below reflect your goals, budget, and learning style. Review the scholarship cards to find financial support that matches your chosen route.",
        callToAction: "View your matched scholarships",
    },
};

// =============================================================================
// FOUNDATION FUTURE STEPS — shown when flag === "FOUNDATION_REQUIRED"
// Replaces the scholarship section entirely for under-16 / low-grade learners.
// =============================================================================

/** @type {Array<{step: number, title: string, description: string}>} */
export const FOUNDATION_FUTURE_STEPS = [
    {
        step: 1,
        title: "Enrol in a catch-up or bridging class",
        description:
            "Look for community learning centres, monastic schools, or NGO-run education programmes in your township. Many offer free or subsidised Grade 9–10 equivalency courses.",
    },
    {
        step: 2,
        title: "Complete Grade 9 level",
        description:
            "Finishing Grade 9 unlocks IGCSE registration and GED eligibility (at age 16). It is the single most important milestone from where you are now.",
    },
    {
        step: 3,
        title: "Turn 16 — then consider GED",
        description:
            "The GED has no grade-level prerequisite once you are 16. If formal schooling is not an option, GED is the fastest bridge to higher education and work opportunities.",
    },
    {
        step: 4,
        title: "Retake this quiz at Grade 9 level",
        description:
            "Come back when you have completed Grade 9 (or turned 16). Your recommendations — and scholarship options — will look very different.",
    },
];

// =============================================================================
// HELPER — filter scholarships by pathway key and optional learner tags
// =============================================================================

/**
 * Return scholarships whose eligibilityTags overlap with the given tags.
 * @param {string[]} tags — e.g. ["ged", "fasttrack"] or ["alevel", "grade11+"]
 * @returns {Scholarship[]}
 */
export function getMatchingScholarships(tags) {
    if (!tags || tags.length === 0) return [];
    return MOCK_SCHOLARSHIPS.filter((s) =>
        s.eligibilityTags.some((t) => tags.includes(t))
    );
}