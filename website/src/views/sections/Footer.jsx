import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/ican.png" alt="Thoughts" className="footer__logo" />
          <span className="footer__name">Thoughts</span>
        </div>

        <p className="footer__tagline">A snapshot of a billion thoughts</p>

        <nav className="footer__links">
          <a href="#" className="footer__link">Privacy Policy</a>
          <span className="footer__dot">·</span>
          <a href="#" className="footer__link">Terms</a>
          <span className="footer__dot">·</span>
          <a href="mailto:hello@thoughts.app" className="footer__link">Contact</a>
        </nav>

        <div className="footer__socials">
          {[
            { label: "Twitter / X", href: "#", icon: "𝕏" },
            { label: "Instagram",   href: "#", icon: "📸" },
          ].map((s) => (
            <a key={s.label} href={s.href} className="footer__social" aria-label={s.label}>
              {s.icon}
            </a>
          ))}
        </div>

        <p className="footer__copy">
          Built with 🧠 by the Thoughts Team · © {new Date().getFullYear()} Thoughts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
