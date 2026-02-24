import { Link } from "react-router-dom";

const FEATURES = [
  {
    to: "/opportunities",
    title: "Opportunities",
    description: "Volunteering, internships, and events for youths in Myanmar—curated from trusted sources.",
    icon: "◇",
  },
  {
    to: "/scholarships",
    title: "Scholarships",
    description: "Browse funding opportunities from DAAD and other scraped sources. View details and official links.",
    icon: "★",
  },
  {
    to: "/pathfinder",
    title: "Path Finder",
    description: "Answer 20 short questions and get a personalized suggestion: GED, OSSD, IGCSE, A-Levels, or Myanmar Matriculation.",
    icon: "◆",
  },
  {
    to: "/submit",
    title: "Submit",
    description: "Are you an organization? Submit an opportunity and we’ll review and publish it.",
    icon: "▸",
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-eyebrow">For youth in Myanmar</p>
        <h1 className="home-title">
          Your path to <span className="home-title-accent">opportunity</span>
        </h1>
        <p className="home-subtitle">
          Discover volunteering roles, explore academic pathways, and find
          opportunities that support your next step.
        </p>
        <div className="home-cta">
          <Link to="/opportunities" className="btn btn-hero-primary">
            Explore opportunities
          </Link>
          <Link to="/pathfinder" className="btn btn-hero-secondary">
            Find my path
          </Link>
        </div>
      </section>

      <section className="home-features">
        <h2 className="home-features-title">What you can do</h2>
        <div className="home-features-grid">
          {FEATURES.map((feature) => (
            <Link
              key={feature.to}
              to={feature.to}
              className="home-feature-card"
            >
              <span className="home-feature-icon">{feature.icon}</span>
              <h3 className="home-feature-title">{feature.title}</h3>
              <p className="home-feature-desc">{feature.description}</p>
              <span className="home-feature-link">
                Go to {feature.title} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-footer-cta">
        <p className="home-footer-text">
          Explore <Link to="/opportunities">opportunities</Link> and{" "}
          <Link to="/scholarships">scholarships</Link> to get started.
        </p>
      </section>
    </div>
  );
}
