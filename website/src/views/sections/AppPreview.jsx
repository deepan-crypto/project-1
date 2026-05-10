import React from "react";
import GradientText from "../../components/GradientText";
import { useInView } from "../../controllers/useScrollAnimation";
import "./AppPreview.css";

function PhoneMockup({ screenId, title, desc, delay }) {
  const { ref, inView } = useInView();

  // Inline mock screens rendered with pure CSS/HTML
  const screens = {
    feed: (
      <div className="mock__screen">
        <div className="mock__header">
          <span className="mock__header-logo">🧠</span>
          <span className="mock__header-title">Thoughts</span>
          <span className="mock__header-bell">🔔</span>
        </div>
        {[
          { q: "Pineapple on pizza?", a: ["Yes 🍍", "Absolutely not"], votes: [62, 38] },
          { q: "Morning person or night owl?", a: ["🌅 Morning", "🦉 Night owl"], votes: [41, 59] },
        ].map((poll, i) => (
          <div className="mock__poll" key={i}>
            <div className="mock__poll-user">
              <div className="mock__avatar" />
              <div>
                <div className="mock__uname" />
                <div className="mock__time" />
              </div>
            </div>
            <p className="mock__question">{poll.q}</p>
            {poll.a.map((opt, j) => (
              <div className="mock__option" key={j}>
                <div
                  className="mock__option-fill"
                  style={{ width: `${poll.votes[j]}%`, background: j === 0 ? "linear-gradient(90deg,#07F2DF,#458FD0)" : "rgba(255,255,255,0.08)" }}
                />
                <span className="mock__opt-label">{opt}</span>
                <span className="mock__opt-pct">{poll.votes[j]}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
    create: (
      <div className="mock__screen">
        <div className="mock__header">
          <span className="mock__back">←</span>
          <span className="mock__header-title">New Thought</span>
          <span />
        </div>
        <div className="mock__create-body">
          <textarea className="mock__textarea" readOnly value="Would you rather travel back in time or into the future? 🚀" />
          <div className="mock__char-count">42 / 250</div>
          <div className="mock__divider" />
          <label className="mock__field-label">Thoughts (options)</label>
          <div className="mock__option-input">🔵 Back in time</div>
          <div className="mock__option-input">🟣 Into the future</div>
          <div className="mock__option-input mock__option-add">+ Add option</div>
          <button className="mock__post-btn">Post Thought ✨</button>
        </div>
      </div>
    ),
    profile: (
      <div className="mock__screen">
        <div className="mock__profile-banner" />
        <div className="mock__profile-info">
          <div className="mock__profile-avatar" />
          <div className="mock__profile-name">Alex Rivera</div>
          <div className="mock__profile-bio">Curious human. Coffee → code → chaos ☕</div>
          <div className="mock__stats-row">
            <div className="mock__stat"><b>42</b><span>Thoughts</span></div>
            <div className="mock__stat"><b>1.2k</b><span>Followers</span></div>
            <div className="mock__stat"><b>318</b><span>Following</span></div>
          </div>
          <div className="mock__profile-btns">
            <div className="mock__edit-btn">Edit Profile</div>
            <div className="mock__share-btn">Share</div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div
      ref={ref}
      className={`preview__phone-wrap ${inView ? "preview__phone-wrap--visible" : ""}`}
      style={{ transitionDelay: delay }}
    >
      <div className="preview__phone">
        <div className="preview__notch" />
        <div className="preview__screen">{screens[screenId]}</div>
        <div className="preview__home-bar" />
      </div>
      <div className="preview__phone-label">
        <span className="preview__label-title">{title}</span>
        <span className="preview__label-desc">{desc}</span>
      </div>
    </div>
  );
}

export default function AppPreview() {
  return (
    <section className="preview section" id="preview">
      <div className="section__inner">
        <div className="section__label">See it in action</div>
        <h2 className="section__title">
          Built for <GradientText>Thinkers</GradientText>
        </h2>
        <p className="section__sub">
          Clean, fast, and addictive — every screen designed to keep you engaged.
        </p>
        <div className="preview__phones">
          <PhoneMockup screenId="feed"    title="Home Feed"    desc="Real-time social poll feed" delay="0ms" />
          <PhoneMockup screenId="create"  title="Create Poll"  desc="Post a thought in seconds"  delay="120ms" />
          <PhoneMockup screenId="profile" title="Your Profile" desc="Votes, polls & followers"   delay="240ms" />
        </div>
      </div>
    </section>
  );
}
