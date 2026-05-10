import React from "react";
import { FEATURES } from "../../models/appData";
import GlassCard from "../../components/GlassCard";
import GradientText from "../../components/GradientText";
import { useInView, staggerDelay } from "../../controllers/useScrollAnimation";
import "./Features.css";

export default function Features() {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="features section" id="features">
      <div className="section__inner">
        <div className="section__label">Everything you need</div>
        <h2 className="section__title">
          Packed with <GradientText>Features</GradientText>
        </h2>
        <p className="section__sub">
          Built for quick expression, deep engagement, and meaningful connections.
        </p>

        <div className="features__bento" ref={ref}>
          {FEATURES.map((f, i) => (
            <GlassCard
              key={f.id}
              className={`features__card ${inView ? "features__card--visible" : ""}`}
              style={{ transitionDelay: staggerDelay(i, 90) }}
            >
              <div className="features__icon">{f.icon}</div>
              <h3 className="features__title">{f.title}</h3>
              <p className="features__desc">{f.desc}</p>
              <div className="features__glow" />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
