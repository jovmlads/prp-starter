# PRP Commands for Dummies 🏗️

_Building Software Like a Master Architect_

## What is This Thing?

Imagine you want to build a house. You wouldn't just grab a hammer and start hitting wood, right? You'd hire an architect to draw plans, a structural engineer to figure out the foundation, and skilled builders to follow the blueprints.

**The PRP Framework works exactly the same way for building software.**

Instead of randomly writing code and hoping it works, you use specialized "AI construction workers" who follow detailed blueprints to build your software features correctly the first time.

---

## The Construction Crew Analogy 🏢

Think of the PRP commands as different specialists in a construction company:

### **🏗️ The Master Project Architect** (`/project-epic-breakdown`)

- **What they do:** Take massive projects (like building an entire city district) and break them into independent construction sites that can be built simultaneously by different crews
- **When to use:** When you have a complex project that needs multiple teams working in parallel
- **Example:** "Build an e-commerce platform" → 6 independent Epics that different teams can build at the same time

### **🏗️ The Building Architect** (`/planning-create`)

- **What they do:** Take your vague idea ("I want a nice house") and create detailed architectural plans with blueprints, materials list, and construction phases
- **When to use:** When you have a rough idea but need comprehensive planning
- **Example:** "I want users to be able to like posts" → Complete feature specification with diagrams

### **📋 The Structural Engineer** (`/api-contract-define`)

- **What they do:** Create detailed specifications for how different parts connect (like how the foundation connects to the walls)
- **When to use:** After the architect creates plans, when you need frontend and backend to work together
- **Example:** Defines exactly how the "like button" talks to the database

### **📐 The Detail Architect** (`/create-base-prp`)

- **What they do:** Create incredibly detailed construction manuals with every nail, screw, and measurement specified
- **When to use:** When you need comprehensive implementation instructions
- **Example:** Step-by-step instructions for building the entire like button feature

### **🔧 The Renovation Specialist** (`/spec-create-adv`)

- **What they do:** Plan how to change existing buildings (like converting a garage into a bedroom)
- **When to use:** When you need to modify existing code rather than build something new
- **Example:** Changing from simple authentication to OAuth2

### **✅ The Project Foreman** (`/task-create`)

- **What they do:** Create focused daily work orders with quality checks
- **When to use:** For small, specific tasks that need careful execution
- **Example:** "Add a dark mode toggle to the settings page"

### **🔨 The Master Builder** (`/execute-base-prp`)

- **What they do:** Actually build the entire feature following the detailed plans
- **When to use:** After you have comprehensive building plans
- **Example:** Takes the like button plans and builds the working feature

### **🏠 The Renovation Team** (`/spec-execute`)

- **What they do:** Execute renovation plans, carefully transforming existing structures
- **When to use:** After you have renovation specifications
- **Example:** Actually migrates your authentication system

### **⚡ The Specialist Crew** (`/task-execute`)

- **What they do:** Handle focused tasks with surgical precision
- **When to use:** After you have specific task lists
- **Example:** Adds the dark mode toggle exactly as specified

### **🏃‍♂️ The Emergency Response Team** (`/task-list-init`)

- **What they do:** Create rapid action plans for urgent situations
- **When to use:** Hackathons, urgent fixes, or when you need to move fast
- **Example:** "Build a social dashboard in 2 days"

---

## The Magic: How They Work Together 🔗

**This is the KEY part that makes everything work!**

Just like real construction, each specialist builds on the work of the previous one:

```
🏗️ Master Project Architect creates Epic breakdown for complex projects
    ↓ (Epic assignments get passed to...)
🏗️ Building Architect creates detailed plans for each Epic
    ↓ (Plans get passed to...)
📋 Structural Engineer creates connection specs
    ↓ (Both plans and specs get passed to...)
📐 Detail Architect creates construction manual
    ↓ (Manual gets passed to...)
🔨 Master Builder builds the actual feature
```

**IMPORTANT:** Each step uses the output from previous steps - they're not isolated tools!

### **The Four Levels of Construction** 🏗️

**Level 1: City Planning** (Enterprise Projects)

- Use `/project-epic-breakdown` for complex projects
- Creates independent construction sites (Epics)
- Multiple teams can work simultaneously
- Example: E-commerce platform → 6 independent Epics

**Level 2: Building Architecture** (Major Features)

- Use `/planning-create` for comprehensive features
- Creates detailed architectural plans
- Example: User authentication system → Complete technical specification

**Level 3: Detailed Construction** (Implementation)

- Use `/create-base-prp` for new features
- Creates step-by-step construction manuals
- Example: Like button → Working implementation with tests

**Level 4: Quick Repairs** (Small Tasks)

- Use `/task-create` for focused work
- Creates specific work orders
- Example: Change button color → Targeted change with validation

---

## The Step-by-Step Process 📋

### **For Complex Enterprise Projects (Multiple Teams)**

**Step 1: City Planning - Break Down the Project**

```powershell
/project-epic-breakdown "e-commerce platform with inventory management, customer analytics, and multi-channel integration"
```

- Creates: `PRPs/project-epic-breakdown.md` (city master plan)
- Contains: **Definitive Epic & Feature Breakdown** with specific feature lists, team assignments, implementation commands, and parallel development roadmap

**Step 2: Building Architecture for Each Epic**

```powershell
# Team Alpha takes Epic F1
/planning-create "Epic F1: Platform Infrastructure from PRPs/project-epic-breakdown.md"

# Team Beta takes Epic C1
/planning-create "Epic C1: Product Catalog from PRPs/project-epic-breakdown.md"

# Team Gamma takes Epic C2
/planning-create "Epic C2: Order Management from PRPs/project-epic-breakdown.md"
```

- Creates: Detailed architectural plans for each Epic
- Contains: Complete technical specifications for parallel development

**Step 3: Implementation (Each Team Works Independently)**

```powershell
# Team Alpha implements their Epic
/create-base-prp "implement infrastructure Epic using PRPs/infrastructure-prd.md"
/execute-base-prp PRPs/infrastructure-implementation.md

# Team Beta implements their Epic
/create-base-prp "implement product catalog using PRPs/product-catalog-prd.md"
/execute-base-prp PRPs/product-catalog-implementation.md
```

- Result: Multiple teams building different parts simultaneously with no conflicts

---

### **For Building New Features (Most Common)**

**Step 1: Get the Big Picture**

```powershell
/planning-create "user profile page with avatar upload and bio editing"
```

- Creates: `PRPs/user-profile-prd.md` (architectural plans)
- Contains: Complete feature specification, user flows, technical architecture

**Step 2: Define How Parts Connect**

```powershell
/api-contract-define "create API endpoints for the user profile feature described in PRPs/user-profile-prd.md"
```

- Creates: `PRPs/contracts/user-profile-api-contract.md` (connection specs)
- Contains: Exact API endpoints, data structures, error handling

**Step 3: Create Detailed Instructions**

```powershell
/create-base-prp "implement user profile feature using PRPs/user-profile-prd.md architecture and PRPs/contracts/user-profile-api-contract.md specifications"
```

- Creates: `PRPs/user-profile-implementation.md` (construction manual)
- Contains: Step-by-step implementation with all context needed

**Step 4: Build It**

```powershell
/execute-base-prp PRPs/user-profile-implementation.md
```

- Result: Working user profile feature with all tests passing

---

### **For Changing Existing Code**

**Step 1: Plan the Changes**

```powershell
/spec-create-adv "migrate user authentication from basic auth to OAuth2 with Google integration"
```

- Creates: `SPEC_PRP/PRPs/oauth2-migration.md` (renovation plans)
- Contains: Current state, desired state, transformation steps

**Step 2: Execute the Changes**

```powershell
/spec-execute SPEC_PRP/PRPs/oauth2-migration.md
```

- Result: Authentication system successfully migrated

---

### **For Small, Focused Tasks**

**Step 1: Define the Task**

```powershell
/task-create "add email validation to the signup form with proper error messages"
```

- Creates: `TASK_PRP/PRPs/email-validation.md` (work order)
- Contains: Specific tasks with validation and rollback plans

**Step 2: Do the Task**

```powershell
/task-execute TASK_PRP/PRPs/email-validation.md
```

- Result: Email validation added with proper testing

---

### **For Emergency/Fast Work**

**Step 1: Create Action Plan**

```powershell
/task-list-init "hackathon project: social media dashboard with posts, likes, and user profiles"
```

- Creates: `PRPs/checklist.md` (emergency action plan)
- Contains: Prioritized task list with status tracking

**Step 2: Execute Manually**

- Follow the checklist, checking off items as you complete them
- Use other commands for specific parts if needed

---

## Complete Real Example: Building a "Like Button" 💖

Let's build a social media like button from scratch, step by step:

### **Step 1: The Building Architect Does Their Magic** 🏗️

```bash
/planning-create "social media like button with real-time updates and analytics tracking"
```

**What happens behind the scenes:**

- AI researches existing like button implementations
- Creates user flow diagrams
- Designs database schema for likes
- Plans real-time update architecture
- Specifies analytics requirements
- Creates comprehensive PRD document

**Result:** `PRPs/like-button-prd.md` with complete architectural plans

---

### **Step 2: The Structural Engineer Creates Connection Specs** 📋

```bash
/api-contract-define "create API contracts for the like button feature specified in PRPs/like-button-prd.md, including real-time updates and analytics"
```

**What happens behind the scenes:**

- Reads the architectural plans from Step 1
- Defines specific API endpoints:
  - `POST /api/posts/{id}/like`
  - `DELETE /api/posts/{id}/like`
  - `GET /api/posts/{id}/likes/analytics`
- Creates TypeScript interfaces
- Specifies WebSocket events for real-time updates
- Defines error responses

**Result:** `PRPs/contracts/like-button-api-contract.md` with exact technical specifications

---

### **Step 3: The Detail Architect Creates the Construction Manual** 📐

```bash
/create-base-prp "implement like button feature using architecture from PRPs/like-button-prd.md and API specifications from PRPs/contracts/like-button-api-contract.md"
```

**What happens behind the scenes:**

- Reads BOTH the architectural plans AND the API contracts
- Researches the existing codebase for patterns
- Creates step-by-step implementation plan
- Includes all necessary context (documentation links, code examples)
- Defines 4-level quality checking process
- Creates comprehensive construction manual

**Result:** `PRPs/like-button-implementation.md` with everything needed to build it

---

### **Step 4: The Master Builder Constructs the Feature** 🔨

```bash
/execute-base-prp PRPs/like-button-implementation.md
```

**What happens behind the scenes:**

- **Planning Phase:** Creates detailed todo list using TodoWrite
- **Foundation (Level 1):**
  - Creates database migration for likes table
  - Sets up TypeScript interfaces
  - Runs syntax checking: `ruff check --fix && mypy .`
- **Structure (Level 2):**
  - Implements API endpoints following the contract
  - Creates React component with proper state management
  - Adds comprehensive unit tests
  - Runs tests: `uv run pytest tests/ -v`
- **Systems (Level 3):**
  - Integrates WebSocket for real-time updates
  - Connects frontend to backend APIs
  - Tests complete user workflows
  - Runs integration tests
- **Final Inspection (Level 4):**
  - Load tests with multiple concurrent users
  - Tests edge cases and error scenarios
  - Verifies analytics accuracy

**Result:** Fully working like button with real-time updates, analytics, and all tests passing!

---

### **Step 5: Adding a Quick Enhancement** ✅

```bash
/task-create "add animated heart floating effect when users like posts for better visual feedback"
```

**What happens:** Creates focused task list for the animation enhancement

```bash
/task-execute TASK_PRP/PRPs/heart-animation.md
```

**Result:** Beautiful floating heart animation added to the like button

---

## The Quality Control System 🔍

Every feature goes through 4 levels of quality control, just like building inspections:

### **Level 1: Foundation Check**

```powershell
npm run type-check
npm run lint
```

_Like checking if the foundation is level and meets building codes_

### **Level 2: Component Testing**

```powershell
npm run test
npm run test:coverage
```

_Like testing if each room functions correctly (lights work, doors open, etc.)_

### **Level 3: E2E Testing**

```powershell
npm run test:e2e
```

_Like testing if the whole house works together - automated Playwright tests simulate real user interactions_

### **Level 4: Real-World Validation**

```powershell
npm run validate
```

_Runs all checks and tests to ensure everything works perfectly_

All commands should be run in PowerShell within the PRPs-agentic-eng workspace.

---

## The Documentation Requirement 📚

### **MANDATORY for React Projects: Document Everything!**

**After every completed feature, epic, or task, you MUST create documentation:**

### **📝 Documentation Process**

1. **Create documentation file** in `app/docs/` folder:
   - Features: `feature-{name}-documentation.md`
   - Epics: `epic-{name}-documentation.md`

2. **Use the template** from `PRPs/templates/documentation_template.md`

3. **Include everything**:
   - ✅ How components work (with code examples)
   - ✅ API integration patterns
   - ✅ Testing coverage summary
   - ✅ Common problems and solutions
   - ✅ Dependencies and configuration

### **🎯 Why Documentation Matters**

- **Future You**: You'll forget how things work in 6 months
- **Team Members**: Others need to understand and maintain your code
- **Problem Solving**: Documented troubleshooting saves hours of debugging
- **Code Quality**: Well-documented code is usually better code

### **💡 Documentation Example**

```markdown
# User Authentication Feature Documentation

## Overview
Secure login system with JWT tokens and role-based access.

## Components Created
- LoginForm - Handles user login with validation
- AuthProvider - Manages authentication state globally

## Usage Example
<LoginForm onSuccess={handleLoginSuccess} />

## Common Issues
**Problem**: Login fails with 401 error
**Solution**: Check if API base URL is correctly configured
```

---

## When to Use Each Command 🤔

### **Use `/project-epic-breakdown` when:**

- You have a complex project that needs multiple teams
- The project will take 3+ months with 10+ developers
- You need independent work streams that don't block each other
- You want to enable true parallel development
- Example: "Build an e-commerce platform" or "Create a social media app"

### **Use `/planning-create` when:**

- You have a vague idea that needs to become a concrete plan
- You're starting a new major feature
- You need to research and understand the problem space
- You want comprehensive documentation with diagrams
- Example: "User authentication system" or "Real-time chat feature"

### **Use `/api-contract-define` when:**

- You have architectural plans and need technical specifications
- Frontend and backend teams need to coordinate
- You need exact API endpoint definitions
- You want to prevent integration issues
- Example: After planning, before implementation

### **Use `/create-base-prp` when:**

- You need comprehensive implementation instructions
- You're building something completely new
- You want all the context and examples included
- You need the full 4-level validation process
- Example: "Implement user profile feature using PRPs/user-profile-prd.md"

### **Use `/spec-create-adv` when:**

- You need to modify existing code
- You're doing a migration or refactoring
- You need to document current vs. desired state
- You want rollback plans for safety
- Example: "Migrate from REST to GraphQL" or "Upgrade React 18 to 19"

### **Use `/task-create` when:**

- You have a small, focused change to make
- You need surgical precision on specific code
- You want immediate validation after each step
- The change affects only a few files
- Example: "Add dark mode toggle" or "Fix validation bug"

### **Use the execute commands when:**

- You have the corresponding plan/spec/task document
- You're ready to actually build/change the code
- You want systematic, validated implementation
- You trust the AI to follow the detailed instructions

### **Use `/task-list-init` when:**

- You're in a hackathon or time crunch
- You need a quick overview of what needs to be done
- You want to track progress manually
- You're doing rapid prototyping

---

## Common Mistakes (Don't Do These!) ❌

### **❌ Using Commands in Isolation**

```powershell
# WRONG - each command creates isolated work
/api-contract-define "user authentication"
/create-base-prp "user authentication"
```

```powershell
# RIGHT - each command builds on the previous
/planning-create "user authentication with social login"
/api-contract-define "create API for authentication described in PRPs/user-auth-prd.md"
/create-base-prp "implement authentication using PRPs/user-auth-prd.md and PRPs/contracts/user-auth-api-contract.md"
```

### **❌ Skipping the Planning Phase**

```powershell
# WRONG - jumping straight to implementation
/create-base-prp "some complicated feature"
```

```powershell
# RIGHT - plan first, then implement
/planning-create "some complicated feature"
/create-base-prp "implement feature using PRPs/complicated-feature-prd.md"
```

### **❌ Not Using Epic Breakdown for Complex Projects**

```powershell
# WRONG - trying to plan a huge project as one feature
/planning-create "entire e-commerce platform with everything"
```

```powershell
# RIGHT - break into independent Epics first
/project-epic-breakdown "e-commerce platform with inventory, analytics, and multi-channel"
/planning-create "Epic C1: Product Catalog from PRPs/project-epic-breakdown.md"
/planning-create "Epic C2: Order Management from PRPs/project-epic-breakdown.md"
```

### **❌ Not Being Specific**

```powershell
# WRONG - vague and unhelpful
/prp-base-create "make the app better"
```

```powershell
# RIGHT - specific and actionable
/prp-base-create "add user profile editing with avatar upload, bio editing, and email preferences"
```

---

## Pro Tips for Success 🚀

### **🎯 Always Start with the Right Level**

**Complex Project (multiple teams)?** → Start with `/project-epic-breakdown`
**Major Feature?** → Start with `/planning-create`  
**Implementation of planned feature?** → Start with `/create-base-prp`
**Small change?** → Start with `/task-create`

### **🔗 Connect Your Commands**

Always reference previous outputs in your next command. If you created `PRPs/user-auth-prd.md`, reference it in your next command.

### **🏗️ Think Hierarchically**

- **Project** → Epic breakdown → Epic planning → Implementation → Tasks
- Don't try to do everything in one giant command
- Break complex work into manageable pieces

### **📝 Be Specific in Your Requests**

Instead of "add authentication," say "add OAuth2 authentication with Google and GitHub integration, including user profile sync and role-based permissions."

### **🔍 Trust the Quality Control**

Let each command run through all 4 quality levels. The validation catches issues before they become problems.

### **🏗️ Think Like an Architect**

Plan the foundation before building the walls. Design the overall structure before implementing individual components.

### **📚 Include Context**

When creating implementation PRPs, reference existing code patterns, documentation URLs, and similar implementations in your codebase.

---

## Quick Reference Card 📋

| Command                   | Purpose               | Input                    | Output                               |
| ------------------------- | --------------------- | ------------------------ | ------------------------------------ |
| `/project-epic-breakdown` | City planning         | Complex project          | Independent Epics for parallel teams |
| `/planning-create`        | Feature planning      | Rough idea               | Comprehensive PRD with diagrams      |
| `/api-contract-define`    | Technical specs       | Feature + PRD reference  | API contracts and interfaces         |
| `/create-base-prp`        | Implementation manual | Feature + all references | Complete construction guide          |
| `/execute-base-prp`       | Build new feature     | Implementation PRP path  | Working feature                      |
| `/spec-create-adv`        | Renovation plans      | Change requirements      | Current→desired transformation       |
| `/spec-execute`           | Execute changes       | Spec PRP path            | Modified code                        |
| `/task-create`            | Focused work orders   | Specific task            | Detailed task list                   |
| `/task-execute`           | Do specific tasks     | Task PRP path            | Completed task                       |
| `/task-list-init`         | Emergency planning    | Urgent project           | Trackable checklist                  |

---

## Getting Started Right Now 🚀

### **Your First Epic Breakdown (Complex Project - 10 minutes)**

1. **Pick a complex project** like "social media platform with user profiles, posts, messaging, and analytics"

2. **Break it down into Epics:**

   ```bash
   /project-epic-breakdown "social media platform with user profiles, posts, messaging, and analytics"
   ```

3. **Pick one Epic to plan:**

   ```bash
   /planning-create "Epic C1: User Profile Management from PRPs/project-epic-breakdown.md"
   ```

4. **Create implementation guide:**

   ```bash
   /create-base-prp "implement user profile Epic using PRPs/user-profile-prd.md"
   ```

5. **Assign to different teams and watch parallel development happen!** 🚀

---

### **Your First Feature (5 minutes)**

1. **Pick something simple** like "add a footer to the website with copyright and links"

2. **Plan it:**

   ```bash
   /planning-create "website footer with copyright, privacy policy link, and contact link"
   ```

3. **Create implementation guide:**

   ```bash
   /create-base-prp "implement footer using architecture from PRPs/website-footer-prd.md"
   ```

4. **Build it:**

   ```bash
   /prp-base-execute PRPs/website-footer-implementation.md
   ```

5. **Document Your Success!** 📝 Create feature documentation in your React project's `app/docs/` folder:

   ```bash
   # For React projects - this is MANDATORY!
   # Create or update feature documentation
   # Use the template from PRPs/templates/documentation_template.md
   ```

6. **Celebrate!** 🎉 You just used AI to build a feature with proper planning, documentation, and quality control!

---

## All Available Commands - The Complete Toolbox 🧰

### **Project & Epic Management Commands** 🏗️

#### **🌆 /project-epic-breakdown - Enterprise Project Decomposition**

- **What they do:** Break complex projects into independent Epics with definitive feature lists for parallel development
- **When to use:** Enterprise projects, multiple teams, 3+ month timelines
- **Example:** `/project-epic-breakdown "e-commerce platform with inventory, analytics, multi-channel"`
- **Result:** Creates Epic summary table with complete feature breakdown (comprehensive like automated Jira), team assignments, implementation commands, and parallel development roadmap

---

### **Development Commands** 💻

#### **🎯 /prime-core - Load Project Context**

- **What they do:** Prime Claude with essential project knowledge by reading key files
- **When to use:** Start of every conversation, after major changes
- **Example:** `/prime-core`
- **Result:** Claude understands your project structure and can work effectively

#### **🚀 /onboarding - Create Developer Onboarding**

- **What they do:** Generate comprehensive onboarding documentation for new developers
- **When to use:** New team members join, documenting undocumented projects
- **Example:** `/onboarding`
- **Result:** Creates ONBOARDING.md and QUICKSTART.md with complete setup guides

#### **💾 /smart-commit or /commit - Smart Git Commits**

- **What they do:** Analyze changes and create properly formatted commit messages
- **When to use:** Before committing code, when following commit conventions
- **Example:** `/commit "fixing authentication bug"`
- **Result:** Properly formatted commit with conventional commit style

#### **🌿 /new-dev-branch - Create Development Branch**

- **What they do:** Create a new git branch following team conventions
- **When to use:** Starting new feature work, creating bugfix branches
- **Example:** `/new-dev-branch feature/user-profile`
- **Result:** New branch created with proper naming

#### **🔍 /debug-RCA - Root Cause Analysis**

- **What they do:** Systematic debugging to find root causes of issues
- **When to use:** When facing complex bugs, mysterious errors
- **Example:** `/debug-RCA "users can't login after password reset"`
- **Result:** Detailed analysis with root cause and fix recommendations

#### **🚀 /create-pr - Create Pull Request**

- **What they do:** Generate comprehensive PR with description and testing notes
- **When to use:** After feature completion, ready for code review
- **Example:** `/create-pr`
- **Result:** Well-documented PR ready for review

---

### **Code Quality Commands** 🎨

#### **🔧 /refactor-simple - Quick Refactoring Analysis**

- **What they do:** Scan code for refactoring opportunities (Python-focused)
- **When to use:** Before merging, cleaning technical debt
- **Example:** `/refactor-simple`
- **Result:** Creates refactor_plan.md with prioritized improvements

#### **👀 /review-general - Comprehensive Code Review**

- **What they do:** Thorough review checking quality, security, performance
- **When to use:** Before commits, PR reviews, code audits
- **Example:** `/review-general src/features/authentication`
- **Result:** Detailed review report in PRPs/code_reviews/

#### **📊 /review-staged-unstaged - Review Git Changes**

- **What they do:** Review specifically what's staged/unstaged in git
- **When to use:** Pre-commit review, understanding current changes
- **Example:** `/review-staged-unstaged`
- **Result:** Analysis of current git status with recommendations

---

### **Git Operations Commands** 🔀

#### **🛠️ /conflict-resolver-general - Basic Conflict Resolution**

- **What they do:** Intelligently resolve git merge conflicts
- **When to use:** After merge conflicts, during rebases
- **Example:** `/conflict-resolver-general`
- **Result:** Conflicts resolved with integrity maintained

#### **🧠 /smart-resolver - Advanced Conflict Resolution**

- **What they do:** Deep analysis conflict resolution with business logic understanding
- **When to use:** Complex conflicts, critical business logic conflicts
- **Example:** `/smart-resolver`
- **Result:** Intelligent resolution with detailed documentation

#### **🎯 /conflict-resolver-specific - Targeted Conflict Resolution**

- **What they do:** Resolve conflicts in specific files only
- **When to use:** When you only need to resolve certain files
- **Example:** `/conflict-resolver-specific src/api/auth.ts`
- **Result:** Targeted resolution of specified files

---

### **Rapid Development Commands** ⚡

#### **🏃‍♂️ /hackathon-research - Multi-Option Analysis**

- **What they do:** 15 parallel agents analyze 3 approaches for hackathon challenges
- **When to use:** Hackathon start, evaluating multiple solutions
- **Example:** `/hackathon-research "AI-powered code review tool"`
- **Result:** Comprehensive analysis with best approach recommendation

#### **🎯 /user-story-rapid - Quick User Story Creation**

- **What they do:** Generate user stories with acceptance criteria rapidly
- **When to use:** Sprint planning, feature definition
- **Example:** `/user-story-rapid "user profile management"`
- **Result:** Complete user stories ready for implementation

#### **⚡ /parallel-prp-creation - Batch PRP Creation**

- **What they do:** Create multiple PRPs simultaneously using parallel processing
- **When to use:** Large feature sets, multiple related features
- **Example:** `/parallel-prp-creation "e-commerce checkout flow"`
- **Result:** Multiple coordinated PRPs created efficiently

#### **🔍 /prp-analyze-run - Analyze and Execute PRPs**

- **What they do:** Analyze existing PRPs and optionally execute them
- **When to use:** Understanding PRP quality, batch execution
- **Example:** `/prp-analyze-run`
- **Result:** Analysis report and execution results

#### **✅ /prp-validate - Validate PRP Quality**

- **What they do:** Check PRPs against quality standards
- **When to use:** Before execution, quality assurance
- **Example:** `/prp-validate PRPs/user-auth.md`
- **Result:** Validation report with improvement suggestions

#### **🚀 /create-base-prp-parallel - Parallel Base PRP Creation**

- **What they do:** Create comprehensive PRPs using parallel research
- **When to use:** Complex features needing deep research
- **Example:** `/create-base-prp-parallel "real-time collaboration"`
- **Result:** Research-backed comprehensive PRP

#### **📋 /create-planning-parallel - Parallel Planning Creation**

- **What they do:** Create planning PRDs using parallel analysis
- **When to use:** Initial feature planning, architecture design
- **Example:** `/create-planning-parallel "mobile app backend"`
- **Result:** Comprehensive PRD with multiple perspectives

#### **🏁 /hackathon-prp-parallel - Hackathon-Optimized PRPs**

- **What they do:** Create rapid implementation PRPs for hackathons
- **When to use:** Time-constrained development, MVPs
- **Example:** `/hackathon-prp-parallel "AI chatbot integration"`
- **Result:** Streamlined PRP optimized for speed

---

### **TypeScript-Specific Commands** 📘

#### **📐 /TS-create-base-prp - TypeScript PRP Creation**

- **What they do:** Create PRPs optimized for TypeScript projects
- **When to use:** TypeScript feature development
- **Example:** `/TS-create-base-prp "type-safe API client"`
- **Result:** TypeScript-focused implementation PRP

#### **🔨 /TS-execute-base-prp - Execute TypeScript PRPs**

- **What they do:** Execute PRPs with TypeScript-specific validation
- **When to use:** Implementing TypeScript features
- **Example:** `/TS-execute-base-prp PRPs/api-client.md`
- **Result:** Type-safe implementation with full validation

#### **👀 /TS-review-general - TypeScript Code Review**

- **What they do:** Review with TypeScript best practices focus
- **When to use:** TypeScript code reviews
- **Example:** `/TS-review-general src/components`
- **Result:** TS-specific review with type safety checks

#### **📊 /TS-review-staged-unstaged - TypeScript Git Review**

- **What they do:** Review staged/unstaged TS changes
- **When to use:** Pre-commit TS reviews
- **Example:** `/TS-review-staged-unstaged`
- **Result:** TypeScript-focused change analysis

---

## Command Categories Quick Reference 📚

### **For Starting Work:**

- `/prime-core` - Load project context
- `/onboarding` - Understand the project
- `/new-dev-branch` - Create feature branch

### **For Planning Features:**

- `/prp-planning-create` - Comprehensive planning
- `/hackathon-research` - Evaluate approaches
- `/user-story-rapid` - Quick user stories

### **For Implementation:**

- `/prp-base-create` → `/prp-base-execute` - New features
- `/prp-spec-create` → `/prp-spec-execute` - Modifications
- `/prp-task-create` → `/prp-task-execute` - Small tasks

### **For Code Quality:**

- `/review-general` - Full code review
- `/refactor-simple` - Find improvements
- `/debug-RCA` - Fix complex bugs

### **For Git Operations:**

- `/smart-commit` - Create commits
- `/conflict-resolver-general` - Resolve conflicts
- `/create-pr` - Create pull requests

### **For Rapid Development:**

- `/hackathon-research` - Fast analysis
- `/parallel-prp-creation` - Batch creation
- `/task-list-init` - Quick task tracking

---

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

Use parallel commands for speed:

- Research phase: `/hackathon-research`
- Planning phase: `/create-planning-parallel`
- Implementation: `/create-base-prp-parallel`

### **🎯 Context is Key**

Always reference previous outputs:

- Bad: `/prp-base-create "user auth"`
- Good: `/prp-base-create "implement auth using PRPs/auth-prd.md and PRPs/contracts/auth-api.md"`

### **🔍 Review Early and Often**

- Use `/review-staged-unstaged` before every commit
- Run `/refactor-simple` weekly for code health
- Apply `/review-general` before PRs

---

## Remember: You're the Architect, AI is Your Construction Crew 🏗️

- **You decide WHAT to build** (the vision, requirements, business goals)
- **AI figures out HOW to build it** (technical implementation, code patterns, testing)
- **The PRP system ensures quality** (proper planning, validation, documentation)

This isn't about replacing human creativity - it's about amplifying your ideas with systematic, high-quality implementation.

---

**Ready to build something amazing? Start with `/prime-core`, then `/prp-planning-create` and watch your ideas come to life!** ✨
