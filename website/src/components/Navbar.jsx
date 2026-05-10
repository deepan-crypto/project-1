import React from "react";
import { NAV_LINKS } from "../models/appData";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} id="navbar">
      <div className="navbar__inner">
        <a href="#hero" className="navbar__brand">
          <img src="/ican.png" alt="Thoughts logo" className="navbar__logo" />
          <span className="navbar__name">Thoughts</span>
        </a>

        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="navbar__link" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#download" className="btn btn--gradient btn--sm">
          Download
        </a>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
