// ─── Model: All static data powering the landing page ───────────────────────

export const APP_META = {
  name: "Thoughts",
  tagline: "A snapshot of a billion thoughts",
  subtext:
    "The human brain generates 6,000 to 70,000 thoughts per day. Now, share yours.",
  description:
    "Your brain has 70,000 thoughts a day. Share the ones that matter.",
  androidUrl: "#download",
  iosUrl: "#ios",
};

export const COLORS = {
  bg: "#0A0E17",
  primary: "#458FD0",
  accent: "#07F2DF",
  gradientStart: "#07F2DF",
  gradientEnd: "#458FD0",
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  textPrimary: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.65)",
};

export const HOW_IT_WORKS = [
  {
    id: "think",
    icon: "🧠",
    title: "Think",
    desc: "Got an opinion? A hot take? A random shower thought? Type it out.",
  },
  {
    id: "poll",
    icon: "📊",
    title: "Poll",
    desc: "Turn your thought into a poll with 2–3 options. Let the world decide.",
  },
  {
    id: "engage",
    icon: "🔥",
    title: "Engage",
    desc: "Vote on others' thoughts, like what resonates, follow thinkers you vibe with.",
  },
];

export const FEATURES = [
  {
    id: "realtime",
    icon: "⚡",
    title: "Real-time Polls",
    desc: "Create polls instantly. See live votes and results as they come in.",
    span: "col",
  },
  {
    id: "feed",
    icon: "📱",
    title: "Social Feed",
    desc: "A Twitter-style feed, but every post is a poll. Pure engagement.",
    span: "col",
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Live Notifications",
    desc: "Know instantly when someone votes, likes, or follows you.",
    span: "col",
  },
  {
    id: "private",
    icon: "🔒",
    title: "Private Accounts",
    desc: "Control who sees your thoughts. Approve followers on your terms.",
    span: "col",
  },
  {
    id: "discover",
    icon: "🔍",
    title: "Discover People",
    desc: "Find and follow interesting thinkers. Get personalized suggestions.",
    span: "col",
  },
  {
    id: "safe",
    icon: "🛡️",
    title: "Safe Space",
    desc: "Report content easily. Our moderation keeps the community clean.",
    span: "col",
  },
];

export const STATS = [
  { id: "thoughts", value: 70000, prefix: "", suffix: "+", label: "Thoughts per brain, per day" },
  { id: "opinions", value: null, display: "∞", label: "Opinions worth sharing" },
  { id: "app", value: 1, prefix: "", suffix: "", label: "App to capture them all" },
];

export const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "Download", href: "#download" },
];

export const SCREENS = [
  {
    id: "feed",
    title: "Home Feed",
    desc: "Real-time social poll feed",
  },
  {
    id: "create",
    title: "Create Poll",
    desc: "Post a thought in seconds",
  },
  {
    id: "profile",
    title: "Your Profile",
    desc: "Votes, polls & followers",
  },
];
