import React from "react";
import { APP_META } from "../../models/appData";
import GradientText from "../../components/GradientText";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />

      <div className="hero__content">
        <div className="hero__logo-wrap">
          <img src="/ican.png" alt="Thoughts" className="hero__logo" />
          <div className="hero__logo-glow" />
        </div>

        <h1 className="hero__title">
          <GradientText>{APP_META.name}</GradientText>
        </h1>

        <p className="hero__tagline">{APP_META.tagline}</p>
        <p className="hero__subtext">{APP_META.subtext}</p>

        <div className="hero__ctas">
          <a href={APP_META.androidUrl} className="btn btn--gradient btn--lg" id="cta-android">
            <span>📱</span> Download for Android
          </a>
          <a href={APP_META.iosUrl} className="btn btn--glass btn--lg" id="cta-ios">
            <span>🍎</span> Coming to iOS
          </a>
        </div>

        <div className="hero__scroll">
          <div className="hero__scroll-dot" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
