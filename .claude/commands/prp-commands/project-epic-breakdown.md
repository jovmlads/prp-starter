# Project Epic Breakdown

Break down a complex project into independent, parallelizable Epics that can be developed simultaneously by different teams or AI agents.

## Arguments: $ARGUMENTS

You are a senior technical architect specializing in project decomposition and parallel development strategies. Your task is to analyze the given project description and break it down into independent Epics that can be developed simultaneously.

## Process

1. **Analyze Project Scope**: Understand the overall project vision, business objectives, and technical requirements
2. **Identify Core Business Capabilities**: Extract the fundamental business capabilities the system must provide
3. **Define Architecture Boundaries**: Establish clear data and API boundaries that enable independence
4. **Decompose into Epics**: Create independent Epic definitions following the template structure
5. **Validate Independence**: Ensure each Epic can be developed without blocking other Epics
6. **Plan Parallelization**: Define development phases that maximize parallel work

## Epic Independence Criteria

Each Epic must satisfy:

- **Data Independence**: Owns its data models with minimal cross-Epic dependencies
- **API Boundaries**: Clear, stable interfaces with other Epics
- **Deployment Independence**: Can be deployed and updated separately
- **Team Independence**: Can be developed without constant cross-team coordination
- **Testing Independence**: Can be tested in isolation with mocked dependencies

## Template Usage

Use the `prp_project_epic_breakdown.md` template to structure your analysis:

1. **Load the template**: Copy the template structure for systematic analysis
2. **Fill Project Context**: Complete the Project Goal & Vision section with the provided information
3. **Analyze Technology Stack**: Identify the technical constraints and architectural patterns
4. **Apply Epic Decomposition**: Break down the project following the independence criteria
5. **Create Dependency Matrix**: Map Epic dependencies and parallelization opportunities
6. **Define Development Phases**: Plan phased development for maximum parallel efficiency

## Output Structure

Provide a complete project breakdown including:

### 1. Project Analysis

- Strategic objectives and success criteria
- Core user journeys and business capabilities
- Technology stack and architectural constraints
- Team structure and parallel development capacity

### 2. Epic Portfolio

- **Foundation Epics**: Infrastructure and shared services
- **Core Business Epics**: Primary user value delivery
- **Enhancement Epics**: Advanced features and optimizations
- **Integration Epics**: Cross-Epic workflows and orchestration

### 3. DEFINITIVE EPIC & FEATURE BREAKDOWN

**CRITICAL**: Provide a comprehensive, Jira-like breakdown with:

- **Epic List Summary Table**: All Epics with IDs, team assignments, complexity, duration, dependencies
- **Master Lists File**: Generate a separate file `PRPs/[project-name]-epic-feature-master-list.md` containing:
  - Complete list of ALL Epic titles
  - Complete list of ALL feature titles organized by Epic
  - Quick reference format for project overview and tracking
- **Detailed Epic Specifications**: For each Epic, provide:
  - Epic Owner and Timeline
  - Implementation Commands (specific PRP commands to use)
  - **Complete Feature Breakdown**: ALL features required for Epic completion (no artificial limits)
- **Implementation Roadmap**: Exact commands for each development phase

**Automated Jira Approach**:

- Generate the COMPLETE set of features needed for each Epic (could be 3, could be 15+ features)
- Each feature should represent a discrete, completable work item
- Features should map to typical Jira story size (1-2 week development effort)
- Include ALL necessary sub-capabilities for full feature implementation
- Think like a senior architect creating a complete project backlog
- **Separate Master List File**: Create `PRPs/[project-name]-epic-feature-master-list.md` with complete Epic and feature title listings for quick reference

**Feature Naming Convention**: Use format `[EpicID].[FeatureNumber]: [Feature Name]`

- Example: `F1.1: Multi-Tenant Authentication System`
- Each feature should have ALL required sub-capabilities (no artificial limits)
- Sub-capabilities should be concrete, testable requirements
- Features should be independently deliverable and testable

**File Management**: Upon completion of features, move all feature implementation files to `PRPs\completed\` directory for archival and reference.

### 4. Development Strategy

- Epic dependency visualization (Mermaid diagram)
- Parallel development phases with team assignments
- Epic-to-feature breakdown process using existing PRP tools
- Validation gates and progress tracking methods

### 5. Next Steps

- Epic prioritization recommendations
- Team assignment strategy
- Integration patterns and coordination mechanisms
- Feature-level PRP generation process

## Connection to Existing PRP Tools

This Epic breakdown integrates with existing PRP methodology:

- **Epic → Features**: Use `/planning-create` for each Epic to generate detailed feature breakdown
- **Features → Implementation**: Use `/create-base-prp` for each feature within Epic context
- **Epic Coordination**: Establish integration patterns and API contracts between Epics
- **Progress Tracking**: Epic-level health checks and dependency validation

## Guidelines

- **Focus on Independence**: Prioritize Epic independence over perfect logical grouping
- **Minimize Dependencies**: Reduce cross-Epic dependencies to enable true parallelization
- **Clear Boundaries**: Define explicit data ownership and API contracts
- **Practical Parallelization**: Ensure Epic breakdown matches available team/agent capacity
- **Iterative Refinement**: Allow Epic boundaries to evolve as understanding deepens

Remember: The goal is maximum parallel development velocity while maintaining architectural coherence and minimizing coordination overhead.
