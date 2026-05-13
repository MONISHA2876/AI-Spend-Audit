# PROMPTS

## AI Summary Generation Prompt

```txt
You are an AI cost optimization assistant.

Analyze the following AI tool stack and generate a concise audit summary for the user.

Focus on:
- overspending
- unnecessary enterprise/team plans
- downgrade opportunities
- cheaper alternatives
- estimated monthly and annual savings

Keep the response:
- concise (~100 words)
- professional
- analytical
- readable for startup founders and engineering managers

Do not invent pricing data or hallucinate features.
Base your reasoning only on the provided audit data.

User Audit Data:
{auditData}
```

---

## Why This Prompt Was Written This Way

The prompt was intentionally constrained to keep the AI output concise and financially focused instead of generating generic marketing-style summaries.

The goal was:
- reduce hallucinated recommendations
- avoid unnecessary verbosity
- keep the tone professional
- align the summary with the hardcoded audit engine logic

The actual pricing calculations and optimization logic were implemented manually in the audit engine instead of relying on AI-generated decisions.
