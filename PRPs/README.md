# Product Requirement Prompt (PRP) Concept

"Over-specifying what to build while under-specifying the context, and how to build it, is why so many AI-driven coding attempts stall at 80%. A Product Requirement Prompt (PRP) fixes that by fusing the disciplined scope of a classic Product Requirements Document (PRD) with the “context-is-king” mindset of modern prompt engineering."

## What is a PRP?

Product Requirement Prompt (PRP)
A PRP is a structured prompt that supplies an AI coding agent with everything it needs to deliver a vertical slice of working software—no more, no less.

### How it differs from a PRD

A traditional PRD clarifies what the product must do and why customers need it, but deliberately avoids how it will be built.

A PRP keeps the goal and justification sections of a PRD yet adds three AI-critical layers:

### Context

- Precise file paths and content, library versions and library context, code snippets examples. LLMs generate higher-quality code when given direct, in-prompt references instead of broad descriptions. Usage of a ai_docs/ directory to pipe in library and other docs.

### Implementation Details and Strategy

- In contrast of a traditional PRD, a PRP explicitly states how the product will be built. This includes the use of API endpoints, test runners, or agent patterns (ReAct, Plan-and-Execute) to use. Usage of typehints, dependencies, architectural patterns and other tools to ensure the code is built correctly.

### Validation Gates

- Deterministic checks such as pytest, ruff, or static type passes “Shift-left” quality controls catch defects early and are cheaper than late re-work.
  Example: Each new funtion should be individaully tested, Validation gate = all tests pass.

### PRP Layer Why It Exists

- The PRP folder is used to prepare and pipe PRPs to the agentic coder.

## PRP Completion Protocol

### File Organization Standards

**Active Work**: All PRD and implementation files remain in main `PRPs/` directory during development

**Completion Process**: Upon successful feature implementation and validation:

1. **Automatically move** completed PRD file to `PRPs/completed/` folder
2. **Automatically move** completed implementation file to `PRPs/completed/` folder
3. **Update** `PRPs/completed/README.md` with feature completion details
4. **Maintain** clear separation between active and completed work

### Mandatory E2E Testing

**For React/Frontend Features**: Playwright E2E tests are **MANDATORY** upon successful implementation

- Execute automatically after feature completion: `npx playwright test`
- Cover all primary user journeys and error scenarios
- Include data-testid attributes for reliable element selection
- All tests must pass before marking feature as complete

### Terminal Command Execution

**No Confirmation Required**: AI agents should proceed directly with terminal commands without asking for user confirmation

- Execute build, test, and deployment commands immediately when needed
- Install dependencies automatically when required
- Run validation commands without prompting user approval

## Why context is non-negotiable

Large-language-model outputs are bounded by their context window; irrelevant or missing context literally squeezes out useful tokens

The industry mantra “Garbage In → Garbage Out” applies doubly to prompt engineering and especially in agentic engineering: sloppy input yields brittle code

## In short

A PRP is PRD + curated codebase intelligence + agent/runbook—the minimum viable packet an AI needs to plausibly ship production-ready code on the first pass.

The PRP can be small and focusing on a single task or large and covering multiple tasks.
The true power of PRP is in the ability to chain tasks together in a PRP to build, self-validate and ship complex features.
