import { ToolConfig } from "@/constants/types";

export const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/audit", label: "AI Spend" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
];

export const TOOL_CONFIG: Record<string, ToolConfig> = {
  Cursor: {
    plans: [
      { label: "Hobby", price: 0, note: "Free" },
      { label: "Pro", price: 20 },
      { label: "Pro+", price: 60 },
      { label: "Ultra", price: 200 },
      { label: "Teams", price: 40, note: "/seat" },
      { label: "Enterprise", price: 0, note: "Custom" },
    ],
  },

  "GitHub Copilot": {
    plans: [
      { label: "Free", price: 0 },
      { label: "Pro", price: 10 },
      { label: "Pro+", price: 39 },
      { label: "Business", price: 19, note: "/seat" },
      { label: "Enterprise", price: 39, note: "/seat" },
    ],
  },

  Claude: {
    plans: [
      { label: "Free", price: 0 },
      { label: "Pro", price: 20 },
      { label: "Max 5×", price: 100 },
      { label: "Max 20×", price: 200 },
      { label: "Team Standard", price: 25, note: "/seat" },
      { label: "Team Premium", price: 100, note: "/seat" },
      { label: "Enterprise", price: 0, note: "Custom" },
    ],
  },

  ChatGPT: {
    plans: [
      { label: "Free", price: 0 },
      { label: "Plus", price: 20 },
      { label: "Pro $100", price: 100 },
      { label: "Pro $200", price: 200 },
      { label: "Business", price: 25, note: "/seat" },
      { label: "Enterprise", price: 0, note: "Custom" },
    ],
  },

  "Anthropic API": {
    plans: [{ label: "Usage-based", price: 0, note: "Pay per token" }],
  },

  "OpenAI API": {
    plans: [{ label: "Usage-based", price: 0, note: "Pay per token" }],
  },

  Gemini: {
    plans: [
      { label: "Free", price: 0 },
      { label: "AI Pro", price: 19.99 },
      { label: "AI Ultra", price: 249.99 },
    ],
  },

  Windsurf: {
    plans: [
      { label: "Free", price: 0 },
      { label: "Pro", price: 20 },
      { label: "Max", price: 200 },
      { label: "Teams", price: 40, note: "/seat" },
      { label: "Enterprise", price: 0, note: "Custom" },
    ],
  },
};

export const TOOL_NAMES = Object.keys(TOOL_CONFIG);
