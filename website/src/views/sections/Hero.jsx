import React, { useEffect, useRef } from "react";
import { APP_META } from "../../models/appData";
import GradientText from "../../components/GradientText";
import "./Hero.css";

function NeuralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const NUM = 55;
    const nodes = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(7, 242, 223, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(nodes[i].x, nodes[i].y, 0, nodes[i].x, nodes[i].y, nodes[i].r * 2.5);
        g.addColorStop(0, "rgba(7,242,223,0.9)");
        g.addColorStop(1, "rgba(69,143,208,0)");
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" />;
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <NeuralCanvas />
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
