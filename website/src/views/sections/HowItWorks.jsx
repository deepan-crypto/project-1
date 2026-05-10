import React from "react";
import { HOW_IT_WORKS } from "../../models/appData";
import GlassCard from "../../components/GlassCard";
import GradientText from "../../components/GradientText";
import { useInView, staggerDelay } from "../../controllers/useScrollAnimation";
import "./HowItWorks.css";

export default function HowItWorks() {
  const { ref, inView } = useInView();

  return (
    <section className="hiw section" id="how-it-works">
      <div className="section__inner">
        <div className="section__label">Simple by design</div>
        <h2 className="section__title">
          How It <GradientText>Works</GradientText>
        </h2>
        <p className="section__sub">
          Three steps from thought to global conversation.
        </p>

        <div className="hiw__grid" ref={ref}>
          {HOW_IT_WORKS.map((step, i) => (
            <GlassCard
              key={step.id}
              className={`hiw__card ${inView ? "hiw__card--visible" : ""}`}
              style={{ transitionDelay: staggerDelay(i, 130) }}
            >
              <div className="hiw__step-num">{`0${i + 1}`}</div>
              <div className="hiw__icon">{step.icon}</div>
              <h3 className="hiw__card-title">{step.title}</h3>
              <p className="hiw__card-desc">{step.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
