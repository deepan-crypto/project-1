import React from "react";
import "./GlassCard.css";

export default function GlassCard({ children, className = "", style = {}, hover = true }) {
  return (
    <div
      className={`glass-card ${hover ? "glass-card--hover" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
