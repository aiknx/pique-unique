# Cline Setup (with Abacus RouteLLM)

1) Get an API key + OpenAI-compatible base URL from:
   https://abacus.ai/app/route-llm-apis
2) In Cline, set provider to "OpenAI-compatible" with the RouteLLM base URL and your API key.
3) Models:
   - Primary: Claude 3.5 Sonnet
   - Secondary: GPT-4o-mini or Claude 3.5 Haiku
   Temperature: 0.2–0.4, Max steps: 20–30, Approvals: auto for read-only, manual for write/exec.
4) Branch policy: Cline works only in `agent/*` branches.
5) Start with Sprint 0 (Discovery) prompt in a new issue; write results to docs/INVENTORY.md and docs/QUICK_WINS.md.

For ChatLLM Teams billing/limits/help see:
- https://abacus.ai/help/howTo/chatllm/faqs/billing
- https://abacus.ai/help/howTo/chatllm
