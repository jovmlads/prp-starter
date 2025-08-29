# PRP (Product Requirement prompts)

- A collection of prompts i use in my every day work

## Video Walkthrough

👉 https://www.youtube.com/watch?v=KVOZ9s1S9Gk&lc=UgzfwxvFjo6pKEyPo1R4AaABAg

### ☕ Support This Work

**Found value in these resources?**

👉 **Buy me a coffee:** https://coff.ee/wirasm

I spent a considerable amount of time creating these resources and prompts. If you find value in this project, please consider buying me a coffee to support my work.

That will help me maintain and improve the resources available for free

---

### 🎯 Transform Your Team with AI Engineering Workshops

**Ready to move beyond toy demos to production-ready AI systems?**

👉 **Book a workshop:** https://www.rasmuswiding.com/

✅ **What you'll get:**

- Put your team on a path to become AI power users
- Learn the exact PRP methodology used by top engineering teams
- Hands-on training with Claude Code, PRPs, and real codebases
- From beginner to advanced AI engineering workshops for teams and individuals

💡 **Perfect for:** Engineering teams, Product teams, and developers who want AI that actually works in production

Let's talk!
Contact me directly at rasmus@widinglabs.com

# AI Engineering Resources for Claude Code

A comprehensive library of assets and context engineering for Agentic Engineering, optimized for Claude Code. This repository provides the Product Requirement Prompt (PRP) methodology, pre-configured commands, and extensive documentation to enable AI-assisted development that delivers production-ready code on the first pass.

## What is PRP?

Product Requirement Prompt (PRP)

## In short

A PRP is PRD + curated codebase intelligence + agent/runbook—the minimum viable packet an AI needs to plausibly ship production-ready code on the first pass.

Product Requirement Prompt (PRP) is a structured prompt methodology first established in summer 2024 with context engineering at heart. A PRP supplies an AI coding agent with everything it needs to deliver a vertical slice of working software—no more, no less.

### How PRP Differs from Traditional PRD

A traditional PRD clarifies what the product must do and why customers need it, but deliberately avoids how it will be built.

A PRP keeps the goal and justification sections of a PRD yet adds three AI-critical layers:

### Context

Precise file paths and content, library versions and library context, code snippets examples. LLMs generate higher-quality code when given direct, in-prompt references instead of broad descriptions. Usage of a ai_docs/ directory to pipe in library and other docs.

## Getting Started

### Option 1: Copy Resources to Your Existing Project

1. **Copy the Claude commands** to your project:

   ```bash
   # From your project root
   cp -r /path/to/PRPs-agentic-eng/.claude/commands .claude/
   ```

2. **Copy the PRP templates and runner**:

   ```bash
   cp -r /path/to/PRPs-agentic-eng/PRPs/templates PRPs/
   cp -r /path/to/PRPs-agentic-eng/PRPs/scripts PRPs/
   cp /path/to/PRPs-agentic-eng/PRPs/README.md PRPs/
   ```

3. **Copy AI documentation** (optional but recommended):
   ```bash
   cp -r /path/to/PRPs-agentic-eng/PRPs/ai_docs PRPs/
   ```

### Option 2: Clone and Start a New Project

1. **Clone this repository**:

   ```bash
   git clone https://github.com/Wirasm/PRPs-agentic-eng.git
   cd PRPs-agentic-eng
   ```

2. **Create your project structure**:

   ```bash
   # Example for a Python project
   mkdir -p src/tests
   touch src/__init__.py
   touch pyproject.toml
   touch CLAUDE.md
   ```

3. **Initialize with UV** (for Python projects):
   ```bash
   uv venv
   uv sync
   ```

## Using Claude Commands

The `.claude/commands/` directory contains 12 pre-configured commands that appear as slash commands in Claude Code.

### Available Commands

1. **Project Planning & Architecture**:

   - `/project-epic-breakdown` - Decompose complex projects into independent Epics for parallel development
   - `/planning-create` - Create comprehensive planning documents with diagrams and architecture
   - `/api-contract-define` - Define precise API contracts and interfaces between systems

2. **PRP Creation & Execution**:

   - `/create-base-prp` - Generate comprehensive PRPs with research and context
   - `/execute-base-prp` - Execute PRPs with 4-level validation against codebase
   - `/spec-create-adv` - Advanced specification creation for modifications
   - `/spec-execute` - Execute specifications with rollback planning
   - `/task-create` - Create focused task lists with surgical precision
   - `/task-execute` - Execute specific tasks with immediate validation

3. **Rapid Development**:

   - `/hackathon-research` - Multi-agent analysis for rapid prototyping
   - `/parallel-prp-creation` - Batch PRP creation using parallel processing
   - `/task-list-init` - Emergency planning for urgent projects

4. **Code Quality & Review**:

   - `/review-general` - Comprehensive code review with security and performance analysis
   - `/review-staged-unstaged` - Review git changes with targeted feedback
   - `/refactor-simple` - Systematic refactoring analysis and recommendations
   - `/debug-RCA` - Root cause analysis for complex debugging

5. **Git & Collaboration**:

   - `/create-pr` - Generate comprehensive pull requests with testing notes
   - `/smart-commit` - Intelligent commit message generation
   - `/conflict-resolver-general` - Intelligent merge conflict resolution

6. **TypeScript Specialization**:

   - `/TS-create-base-prp` - TypeScript-optimized PRP creation
   - `/TS-execute-base-prp` - Execute with TypeScript-specific validation
   - `/TS-review-general` - Type safety focused code review

7. **Project Utilities**:
   - `/prime-core` - Prime Claude with comprehensive project context
   - `/onboarding` - Generate developer onboarding documentation
   - `/new-dev-branch` - Create development branches with proper conventions

### How to Use Commands

1. **In Claude Code**, type `/` to see available commands
2. **Select a command** and provide arguments when prompted
3. **Example usage**:
   ```
   /create-base-prp user authentication system with OAuth2
   ```

## Project Planning at Scale

### Epic Breakdown for Complex Projects

For enterprise-level projects that require multiple teams working in parallel, use the Epic breakdown system:

```bash
/project-epic-breakdown "e-commerce platform with inventory management, customer analytics, and multi-channel integration"
```

**What this creates:**

- `PRPs/project-epic-breakdown.md` - Complete project decomposition into independent Epics
- `PRPs/[project-name]-epic-feature-master-list.md` - Master reference file with all Epic and feature titles
- `PRPs/[project-name]-jira-import.csv` - **Jira-ready CSV file for instant project import**
- **Definitive Epic & Feature Breakdown** - Clear table of all Epics with team assignments, complexity, and dependencies
- **Complete Feature Lists** - Each Epic broken down into ALL necessary features (3-15+ features as needed) with implementation sub-capabilities
- **Implementation Commands** - Exact PRP commands to use for each Epic and feature
- Clear dependency management and parallel development phases
- Integration points and API contracts between Epics

**Key Outputs:**

1. **Epic Summary Table** - All Epics with IDs, owners, timelines, dependencies
2. **Detailed Feature Breakdown** - Each Epic contains ALL necessary features (could be 3, could be 15+ features - like automated Jira backlog generation)
3. **Jira Import Ready** - CSV file with all Epics, Features, and Tasks formatted for Jira import
4. **Implementation Roadmap** - Phase-by-phase commands for parallel development
4. **Team Assignment Strategy** - Clear Epic ownership for parallel execution

**Epic → Feature → Task Workflow:**

```
1. Project → Epics (using /project-epic-breakdown)
2. Epic → Features (using /planning-create for each Epic)
3. Feature → Implementation (using /create-base-prp → /execute-base-prp)
4. Task → Focused work (using /task-create → /task-execute)
```

### Example: Enterprise Development Flow

**Step 1: Break down the project**

```bash
/project-epic-breakdown "modern e-commerce platform supporting 10k concurrent users"
```

_Result: 6 independent Epics that can be developed in parallel_

**Step 2: Plan each Epic**

```bash
/planning-create "Epic C1: Product Catalog Management from PRPs/project-epic-breakdown.md"
/planning-create "Epic C2: Order Management System from PRPs/project-epic-breakdown.md"
/planning-create "Epic F1: Platform Infrastructure from PRPs/project-epic-breakdown.md"
```

_Result: Detailed PRDs for each Epic with technical architecture_

**Step 3: Implement Epic features**

```bash
/create-base-prp "implement product catalog using PRPs/product-catalog-prd.md"
/execute-base-prp PRPs/product-catalog-implementation.md
```

_Result: Working Epic delivered by each team_

This enables true parallel development where 4-6 teams can work simultaneously with minimal coordination overhead.

## Using PRPs

### PRP Hierarchy and Planning Levels

The PRP framework operates at multiple levels to support projects of any scale:

**1. Project Level** - Epic Breakdown (New!)

- **Command**: `/project-epic-breakdown`
- **Purpose**: Decompose complex projects into independent, parallelizable Epics
- **Use case**: Enterprise projects, multiple teams, 3+ month timelines
- **Output**: Epic dependency matrix, parallel development phases, team allocation

**2. Epic Level** - Feature Planning

- **Command**: `/planning-create`
- **Purpose**: Detailed feature specification with technical architecture
- **Use case**: Major features, significant user-facing capabilities
- **Output**: Comprehensive PRD with diagrams, API specifications, success criteria

**3. Feature Level** - Implementation Planning

- **Command**: `/create-base-prp`
- **Purpose**: Detailed implementation instructions with full context
- **Use case**: New features requiring comprehensive development
- **Output**: Step-by-step implementation guide with 4-level validation

**4. Task Level** - Focused Work

- **Command**: `/task-create`
- **Purpose**: Surgical precision for specific, focused changes
- **Use case**: Bug fixes, small enhancements, targeted improvements
- **Output**: Specific work orders with immediate validation

### Creating a PRP

1. **Use the appropriate template** for your planning level:

   ```bash
   # For Epic breakdown (enterprise projects)
   cp PRPs/templates/prp_project_epic_breakdown.md PRPs/my-project-epics.md

   # For comprehensive feature planning
   cp PRPs/templates/prp_planning_base.md PRPs/my-feature-planning.md

   # For detailed implementation
   cp PRPs/templates/prp_base.md PRPs/my-feature.md

   # For focused tasks
   cp PRPs/templates/prp_task.md PRPs/my-task.md
   ```

2. **Fill in the sections** according to the template structure

3. **Or use Claude commands to generate** (recommended):

   ```bash
   # Generate Epic breakdown for complex projects
   /project-epic-breakdown "description of your complex project"

   # Generate comprehensive feature planning
   /planning-create "detailed feature description"

   # Generate implementation PRP
   /create-base-prp "implement feature using PRPs/feature-planning.md"

   # Generate focused task
   /task-create "specific task description"
   ```

### Executing a PRP

1. **Using the runner script**:

   ```bash
   # Interactive mode (recommended for development)
   uv run PRPs/scripts/prp_runner.py --prp my-feature --interactive

   # Headless mode (for CI/CD)
   uv run PRPs/scripts/prp_runner.py --prp my-feature --output-format json

   # Streaming JSON (for real-time monitoring)
   uv run PRPs/scripts/prp_runner.py --prp my-feature --output-format stream-json
   ```

2. **Using Claude commands**:
   ```
   /execute-base-prp PRPs/my-feature.md
   ```

### PRP Best Practices

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Documentation First**: Create or update documentation in `app/docs/` folder after completion (MANDATORY for React projects)
6. **Knowledge Preservation**: Document component usage, API patterns, and troubleshooting for future reference

### Example PRP Structure

```markdown
## Goal

Implement user authentication with JWT tokens

## Why

- Enable secure user sessions
- Support API authentication
- Replace basic auth with industry standard

## What

JWT-based authentication system with login, logout, and token refresh

### Success Criteria

- [ ] Users can login with email/password
- [ ] JWT tokens expire after 24 hours
- [ ] Refresh tokens work correctly
- [ ] All endpoints properly secured

## All Needed Context

### Documentation & References

- url: https://jwt.io/introduction/
  why: JWT structure and best practices

- file: src/auth/basic_auth.py
  why: Current auth pattern to replace

- doc: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
  section: OAuth2 with Password and JWT

### Known Gotchas

# CRITICAL: Use RS256 algorithm for production

# CRITICAL: Store refresh tokens in httpOnly cookies

# CRITICAL: Implement token blacklist for logout

## Implementation Blueprint

[... detailed implementation plan ...]

## Validation Loop

### Level 1: Syntax & Style

ruff check src/ --fix
mypy src/

### Level 2: Unit Tests

uv run pytest tests/test_auth.py -v

### Level 3: Integration Test

curl -X POST http://localhost:8000/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email": "test@example.com", "password": "testpass"}'
```

## Project Structure Recommendations

```
your-project/
|-- .claude/
|   |-- commands/          # Claude Code commands
|   `-- settings.json      # Tool permissions
|-- PRPs/
|   |-- templates/         # PRP templates
|   |-- scripts/           # PRP runner
|   |-- ai_docs/           # Library documentation
|   |-- completed/         # Finished PRPs
|   `-- *.md               # Active PRPs
|-- app/                   # React application (MANDATORY for React projects)
|   |-- src/               # React source code
|   |-- docs/              # MANDATORY: Feature and epic documentation
|   |   |-- README.md      # Documentation navigation
|   |   |-- feature-*.md   # Individual feature documentation
|   |   |-- epic-*.md      # Epic-level documentation
|   |   `-- *.md           # Additional project documentation
|   |-- tests/             # E2E and integration tests
|   `-- package.json       # React project configuration
|-- CLAUDE.md              # Project-specific guidelines
|-- src/                   # Your source code (non-React projects)
`-- tests/                 # Your tests (non-React projects)
```

### Documentation Requirements for React Projects

**MANDATORY**: Every React project must include a `docs/` folder with:

- **README.md**: Navigation index for all documentation
- **Feature Documentation**: `feature-{name}-documentation.md` for each completed feature
- **Epic Documentation**: `epic-{name}-documentation.md` for completed epics
- **Component Library**: Documentation of reusable components
- **API Integration**: External API usage patterns and examples
- **Testing Guide**: Testing approach and coverage examples
- **Troubleshooting**: Common issues and solutions

## Setting Up CLAUDE.md

Create a `CLAUDE.md` file in your project root with:

1. **Core Principles**: KISS, YAGNI, etc.
2. **Code Structure**: File size limits, function length
3. **Architecture**: How your project is organized
4. **Testing**: Test patterns and requirements
5. **Style Conventions**: Language-specific guidelines
6. **Development Commands**: How to run tests, lint, etc.

See the example CLAUDE.md in this repository for a comprehensive template.

## Advanced Usage

### Multi-Level Development Strategy

The PRP framework supports projects at any scale through its hierarchical approach:

**Enterprise Project (6+ months, 20+ developers)**:

```bash
/project-epic-breakdown → Multiple independent Epics
  ↓ For each Epic:
/planning-create → Detailed Epic specifications
  ↓ For each Epic feature:
/create-base-prp → Implementation guides
  ↓ For specific changes:
/task-create → Focused work orders
```

**Team Project (1-3 months, 3-8 developers)**:

```bash
/planning-create → Feature specifications
  ↓ For each feature:
/create-base-prp → Implementation guides
  ↓ For bugs/enhancements:
/task-create → Focused work
```

**Individual Project (days-weeks, 1-2 developers)**:

```bash
/create-base-prp → Implementation guides
  ↓ For specific tasks:
/task-create → Focused work
```

### Parallel Development with Epic Breakdown

Use the Epic system to enable true parallel development:

**Phase 1**: Project Planning

```bash
/project-epic-breakdown "your complex project description"
```

**Phase 2**: Epic Distribution (parallel teams)

```bash
# Team Alpha
/planning-create "Epic F1: Infrastructure from PRPs/project-epic-breakdown.md"

# Team Beta
/planning-create "Epic C1: Core Business Logic from PRPs/project-epic-breakdown.md"

# Team Gamma
/planning-create "Epic E1: Enhancement Features from PRPs/project-epic-breakdown.md"
```

**Phase 3**: Implementation (parallel execution)

```bash
# Each team implements their Epic independently
/create-base-prp "implement Epic F1 using PRPs/infrastructure-prd.md"
/execute-base-prp PRPs/infrastructure-implementation.md
```

### Running Multiple Claude Sessions

Use Git worktrees for parallel development:

```bash
git worktree add -b feature-auth ../project-auth
git worktree add -b feature-api ../project-api

# Run Claude in each worktree
cd ../project-auth && claude
cd ../project-api && claude
```

### Jira Integration

The Epic breakdown system generates ready-to-import Jira files:

```bash
# Generate project breakdown with Jira export
/project-epic-breakdown "your complex project description"

# Files created:
# - PRPs/project-epic-breakdown.md (detailed breakdown)
# - PRPs/[project-name]-epic-feature-master-list.md (quick reference)
# - PRPs/[project-name]-jira-import.csv (Jira-ready import file)
```

**Jira Import Process:**

1. **Create Jira Project** with appropriate issue types and components
2. **Import CSV File**: Use Jira's CSV import feature to load all Epics, Stories, and Tasks
3. **Assign Teams**: Map Epic assignments to Jira teams and sprints
4. **Track Progress**: Use Epic burndown charts and sprint boards for monitoring

**CSV File Structure:**
- **Epics**: High-level business capabilities mapped to development teams
- **Stories**: User-facing features with story point estimates
- **Tasks**: Technical implementation work with effort estimates
- **Relationships**: Proper Epic-Story-Task hierarchy for tracking

### CI/CD Integration

Use the PRP runner in headless mode:

```yaml
# GitHub Actions example
- name: Execute PRP
  run: |
    uv run PRPs/scripts/prp_runner.py \
      --prp implement-feature \
      --output-format json > result.json
```

### Custom Commands

Create your own commands in `.claude/commands/`:

```markdown
# .claude/commands/my-command.md

# My Custom Command

Do something specific to my project.

## Arguments: $ARGUMENTS

[Your command implementation]
```

## Pro Tips for Command Usage 🎯

### **🔄 Command Chaining**

Many commands work better together:

**Epic-Level Project Development:**

```powershell
/project-epic-breakdown "complex project description" ; `
/prp-planning-create "Epic 1 description" ; `
/prp-base-create "implement Epic 1 using PRPs/epic1-prd.md" ; `
/prp-base-execute PRPs/epic1-implementation.md ; `
/smart-commit "feat: add Epic 1" ; `
/create-pr
```

**Feature-Level Development:**

```powershell
/prime-core ; `
/prp-planning-create "feature description" ; `
/api-contract-define "using PRPs/feature-prd.md" ; `
/prp-base-create "implement feature using PRPs/feature-prd.md and PRPs/contracts/feature-api-contract.md" ; `
/prp-base-execute PRPs/feature-implementation.md ; `
/smart-commit "feat: add new feature" ; `
/create-pr
```

### **⚡ Parallel Processing**

For Epic-level projects, use parallel development:

- Multiple teams working on independent Epics simultaneously
- Each Epic generates its own feature breakdown using `/prp-planning-create`
- API contracts define integration points between Epics
- Completed features move to `PRPs\completed\` for archival

## Resources Included

### Documentation (PRPs/ai_docs/)

- `cc_base.md` - Core Claude Code documentation
- `cc_actions_sdk.md` - GitHub Actions and SDK integration
- `cc_best_practices.md` - Best practices guide
- `cc_settings.md` - Configuration and security
- `cc_tutorials.md` - Step-by-step tutorials

### Templates (PRPs/templates/)

- `prp_project_epic_breakdown.md` - Epic breakdown template for complex projects
- `prp_planning_base.md` - Comprehensive planning template with architecture diagrams
- `prp_base.md` - Implementation template with 4-level validation
- `prp_spec.md` - Specification template for modifications and refactoring
- `prp_task.md` - Focused task template for surgical precision work
- `prp_poc_react.md` - React-specific POC template with modern patterns

### Examples (PRPs/examples/)

- `epic-breakdown-ecommerce-example.md` - Complete e-commerce platform Epic breakdown
- `example-from-workshop-mcp-crawl4ai-refactor-1.md` - Real-world refactoring example

## License

MIT License

## Support

I spent a considerable amount of time creating these resources and prompts. If you find value in this project, please consider buying me a coffee to support my work.

👉 **Buy me a coffee:** https://coff.ee/wirasm

---

Remember: The goal is one-pass implementation success through comprehensive context. Happy coding with Claude Code!
