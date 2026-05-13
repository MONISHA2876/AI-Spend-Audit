# Reflection

## 1. Hardest Bug: localStorage + Hydration Mismatch

The toughest bug I hit was a hydration mismatch caused by reading `localStorage` at the wrong point in Next.js's render cycle.

The symptom was straightforward but confusing at first, the result page was either crashing with `localStorage is not defined` or rendering with empty tool data even though I could see the values sitting in the browser's storage. My first hypothesis was that the data simply wasn't being saved correctly on the audit page, so I added `console.log` statements around every `setItem` call and confirmed the writes were happening fine. That ruled out the save logic.

My second hypothesis was a timing issue, maybe the result page was reading storage before the audit page had finished writing. I added an artificial delay, which changed nothing.

That's when I started reading about how Next.js actually works. The key realization: Next.js renders components on the server first, and `localStorage` is a browser-only API. When my code ran `localStorage.getItem(...)` at the top level of the component, it executed on the server where `window` doesn't exist, hence the crash. And even when I wrapped it in a null check, the server render would produce an empty state, then the client would hydrate with real data, causing a mismatch React would silently discard.

The fix was two things together: adding `"use client"` to the component, and moving all `localStorage` reads inside a `useEffect` hook so they only run after the component mounts in the browser. Once both were in place, the hydration mismatch disappeared and data flowed correctly. The debugging process taught me more about the server/client boundary in Next.js than any documentation would have.

---

## 2. Decision I Reversed: Removing the Confused Robot Graphic

Midway through the week I removed the confused robot illustration from the empty state page, the screen users see before they've added any tools.

My reasoning at the time was that it looked unprofessional. The product was trying to feel like a serious audit tool, and a cartoon robot felt out of place next to financial savings numbers and severity badges. I replaced it with a plain text prompt and a call-to-action button and moved on.

Later I came back to it and immediately felt the page was cold. The empty state is actually a high-stakes moment in the UX — it's the first thing a new user sees, before they've done anything. A blank screen with a text label doesn't guide anyone or make them feel like the product is worth engaging with. The robot, even if slightly silly, gave the page personality and made the empty state feel intentional rather than broken.

I put the graphic back. The lesson was that "professional" and "warm" aren't opposites. Utility-focused products can still have character, and empty states are one of the best places to show it.

---

## 3. What I'd Build in Week 2

If I had a second week I would have split the work into two tracks: polish and features.

On the polish side, the UI works but it doesn't feel alive. I would have added micro-interactions, a progress indicator while the AI summary loads, smooth transitions between the audit card states, and a better mobile layout. The result page in particular feels static for something that's supposed to feel like a generated insight. I also wanted to improve the empty and loading states across the board, not just the one I fixed this week.

On the features side, the audit right now only does one thing, tell you what to cut. The more interesting direction is telling you what to adopt. I wanted to build a recommendation engine: given your team size, use case, and current stack, which AI tools are you missing that would give the highest ROI? That flips the product from a cost-cutter to a strategy tool, which is a much stronger value proposition. The data to support it is already partially in `constants.ts`, it would have just needed a new logic layer and a new results view.

---

## 4. How I Used AI Tools

I used Claude throughout the week, mostly for three things: understanding concepts I hadn't worked with before, debugging, and writing documentation.

For concepts, whenever I hit something unfamiliar, the Next.js hydration model, Supabase row-level security, how the Gemini API structures its responses. I'd ask Claude to explain it before reading the official docs. It was faster than skimming docs cold and gave me a mental model I could then verify. I never copied code directly. My process was to read the explanation, understand what it was doing and why, then write my own version and remove anything that didn't apply to my specific case.

For debugging, I'd describe the symptom and my current hypothesis and ask Claude to poke holes in it. That's how I got unstuck on the hydration bug, not because Claude gave me the answer, but because explaining the problem out loud (to an AI, in this case) forced me to be precise about what I actually knew versus what I was assuming.

One specific time Claude was wrong: it suggested I use `useLayoutEffect` instead of `useEffect` for the localStorage read, claiming it would prevent the flash of empty content. That advice was incorrect for this case, `useLayoutEffect` also doesn't run on the server, so it doesn't solve the hydration issue and actually causes a warning in Next.js about server/client mismatch. I caught it because the warning appeared immediately after I tried it, and a quick check of the Next.js docs confirmed `useEffect` was the right hook for this pattern.

I didn't trust AI for any of the core audit logic or pricing decisions in `constants.ts`. Those numbers and thresholds affect the actual output users see, and getting them wrong would make the whole product unreliable.

---

## 5. Self-Rating

**Discipline — 5/10**
My external practical exams ran across the same days as this project, which made daily progress very less productive.

**Code Quality — 7/10**
The codebase is well-structured: types live in `types.ts`, all constants are centralized in `constants.ts`, and reusable components are properly separated into their own folder. I'm happy with the organization, though there are a few components that grew too large and should be broken down further.

**Design Sense — 7/10**
The UI looks modern and intentional; I drew inspiration from Vercel and Vite's landing pages and it shows in the clean layout and typography, though I didn't get to add the micro-interactions that would have pushed it further.

**Problem Solving — 5/10**
I resolved several real bugs including the hydration issue, but there were a few problems I couldn't crack in time and had to work around rather than fix properly, which I'm not satisfied with.

**Entrepreneurial Thinking — 6/10**
I thought about the product beyond just the brief — the tool recommendation feature idea came from genuinely thinking about what would make this worth paying for, but I didn't go deep enough on distribution, pricing, or who the real buyer is.
