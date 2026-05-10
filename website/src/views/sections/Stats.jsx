import React from "react";
import { STATS } from "../../models/appData";
import GradientText from "../../components/GradientText";
import { useInView, useCountUp } from "../../controllers/useScrollAnimation";
import "./Stats.css";

function StatCard({ stat }) {
  const { ref, inView } = useInView();
  const count = useCountUp(stat.value, 1800, inView);

  const display = stat.display
    ? stat.display
    : `${stat.prefix || ""}${count.toLocaleString()}${stat.suffix || ""}`;

  return (
    <div ref={ref} className={`stats__card ${inView ? "stats__card--visible" : ""}`}>
      <div className="stats__value">
        <GradientText>{display}</GradientText>
      </div>
      <p className="stats__label">{stat.label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="stats section" id="stats">
      <div className="stats__mesh" />
      <div className="section__inner">
        <div className="stats__grid">
          {STATS.map((s) => <StatCard key={s.id} stat={s} />)}
        </div>
      </div>
    </section>
  );
}
