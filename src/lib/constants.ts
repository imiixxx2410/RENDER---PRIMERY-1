export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    renderLimit: 5,
    features: ["5 renders per month", "Standard quality", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    renderLimit: 100,
    features: ["100 renders per month", "High quality output", "Priority support", "Render history"],
    highlighted: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: 49,
    renderLimit: 500,
    features: ["500 renders per month", "Highest quality", "Team seats", "Priority support"],
  },
] as const;

export const RENDER_STYLES = [
  { id: "photorealistic", label: "Photorealistic" },
  { id: "night", label: "Night Shot" },
  { id: "sketch", label: "Ink Sketch" },
  { id: "warm", label: "Warm Interior" },
] as const;
