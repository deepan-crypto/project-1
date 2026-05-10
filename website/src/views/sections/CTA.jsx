import React from "react";
import GradientText from "../../components/GradientText";
import { useInView } from "../../controllers/useScrollAnimation";
import { useWaitlist } from "../../controllers/useWaitlist";
import { APP_META } from "../../models/appData";
import "./CTA.css";

export default function CTA() {
  const { ref, inView } = useInView();
  const { email, setEmail, status, message, submit } = useWaitlist();

  return (
    <section className="cta section" id="download">
      <div className="cta__bg-orb cta__bg-orb--1" />
      <div className="cta__bg-orb cta__bg-orb--2" />
      <div className="section__inner">
        <div ref={ref} className={`cta__inner ${inView ? "cta__inner--visible" : ""}`}>
          <h2 className="cta__heading">
            Ready to share your <GradientText>Thoughts?</GradientText>
          </h2>
          <p className="cta__sub">
            Join thousands of thinkers. Drop your email and be first to know when we launch on iOS.
          </p>

          {status === "success" ? (
            <div className="cta__success">{message}</div>
          ) : (
            <form className="cta__form" onSubmit={submit} id="waitlist-form" noValidate>
              <input
                id="waitlist-email"
                className={`cta__input ${status === "error" ? "cta__input--error" : ""}`}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button
                id="waitlist-submit"
                type="submit"
                className={`btn btn--gradient cta__submit ${status === "loading" ? "btn--loading" : ""}`}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Joining..." : "Join Waitlist →"}
              </button>
            </form>
          )}
          {status === "error" && <p className="cta__error-msg">{message}</p>}

          <div className="cta__download-row">
            <a href={APP_META.androidUrl} className="btn btn--gradient btn--lg" id="download-android">
              📱 Download for Android
            </a>
            <a href={APP_META.iosUrl} className="btn btn--glass btn--lg" id="download-ios">
              🍎 Coming to iOS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
