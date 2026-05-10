# DEVLOG

---

## Day 1 — 2026-05-07

**Hours worked:** 0

**What I did:** Nothing — had my end term practical examination today.

**What I learned:** —

**Blockers / what I'm stuck on:** —

**Plan for tomorrow:** Read the assignment instructions and understand the full scope of the project.

---

## Day 2 — 2026-05-08

**Hours worked:** 1

**What I did:** Read through the full assignment PDF and understood the requirements. Initialised the repo, set up the Next.js project with Tailwind, and added the necessary boilerplate files.

**What I learned:** Got a clearer picture of what the AI Spend Audit tool needs to do — form input, tool cards, pricing data, and a results/summary section.

**Blockers / what I'm stuck on:** Couldn't work more today, had another end term practical examination.

**Plan for tomorrow:** Start building the UI — landing page, header, and the spend input form.

---

## Day 3 — 2026-05-09

**Hours worked:** 5

**What I did:** Built the landing page, header/navbar, and the form component for team size and use case input. Made the overall UI modern with a dark theme, glassmorphism card styles, and yellow accent hover effects. Also built the tool card component with dynamic plan dropdowns and auto-filled pricing. Added localStorage to persist form data and tool card state across page reloads.

**What I learned:** How localStorage works in Next.js with the `"use client"` directive. Also learned that you can't access localStorage during SSR — it only runs in the browser — so all reads have to go inside `useEffect`. Sharing state between separate components through localStorage was trickier than expected.

**Blockers / what I'm stuck on:** Passing data between the audit page and the form component cleanly without prop drilling got a bit messy. Settled on each component reading from localStorage independently.

**Plan for tomorrow:** Build the results/output page and add an AI summary section that analyses the user's tool stack and gives spend insights.

---

## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:** Completely finished the core audit engine and built out the results page. Also wrapped up the AI summary section, so it now successfully analyzes the user's selected tool stack and generates insights.

**What I learned:** Figured out how to properly and securely integrate an external API key into the project to power the AI summary generation.

**Blockers / what I'm stuck on:** The API key integration was a massive headache today. Ran into quite a few tricky issues trying to get it working smoothly, which took up a good chunk of time.

**Plan for tomorrow:** Build out the lead capture functionality and set up transactional emails.
