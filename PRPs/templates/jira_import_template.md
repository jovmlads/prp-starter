# Jira Import Template

This template shows the structure for generating Jira-ready CSV import files from project epic breakdowns.

## CSV File Structure

The generated `PRPs/[project-name]-jira-import.csv` file will follow this format:

```csv
Issue Type,Summary,Description,Epic Link,Priority,Story Points,Components,Assignee,Labels
Epic,Epic Name,Epic Description,,High,,Component Name,Team Lead,epic
Story,Feature Name,Feature Description,Epic Name,Medium,5,Component Name,Developer,feature
Task,Task Name,Task Description,Epic Name,Low,2,Component Name,Developer,task
Sub-task,Subtask Name,Subtask Description,Epic Name,Lowest,1,Component Name,Developer,subtask
```

## Field Descriptions

### Issue Type
- **Epic**: High-level business capability (3-6 months development)
- **Story**: User-facing feature (1-2 weeks development)
- **Task**: Technical work item (1-5 days development)
- **Sub-task**: Component of a larger story/task (1-2 days development)

### Priority Levels
- **Highest**: Critical path items, blockers
- **High**: Foundation Epics, core business logic
- **Medium**: Standard features, user stories
- **Low**: Enhancement features, optimizations
- **Lowest**: Nice-to-have items, future considerations

### Story Points (Fibonacci Scale)
- **1**: Simple configuration, minor UI changes
- **2**: Small feature additions, basic CRUD operations
- **3**: Moderate complexity features, API integrations
- **5**: Complex features, multi-component interactions
- **8**: Large features, significant architecture changes
- **13**: Epic-size work items, major system changes

### Components
Map to system architecture areas:
- **Frontend**: UI components, user experience
- **Backend**: APIs, business logic, data processing
- **Database**: Schema changes, data migrations
- **Infrastructure**: DevOps, deployment, monitoring
- **Integration**: External API connections, webhooks
- **Testing**: Test automation, quality assurance

### Labels
Consistent labeling for filtering and reporting:
- **epic**: Epic-level items
- **feature**: User-facing functionality
- **task**: Technical implementation work
- **bug**: Defect fixes
- **enhancement**: Improvements to existing features
- **infrastructure**: DevOps and infrastructure work
- **documentation**: Documentation updates
- **testing**: Test-related work

## Example Project Structure

```csv
Issue Type,Summary,Description,Epic Link,Priority,Story Points,Components,Assignee,Labels
Epic,User Authentication System,Complete user authentication with OAuth2 and role-based access,,High,,Backend,Backend Team Lead,epic
Story,User Registration,Allow new users to create accounts with email verification,User Authentication System,Medium,5,Frontend,Frontend Developer,feature
Story,OAuth2 Login,Implement Google and GitHub OAuth2 login,User Authentication System,Medium,8,Backend,Backend Developer,feature
Story,Password Reset,Allow users to reset forgotten passwords via email,User Authentication System,Medium,3,Backend,Backend Developer,feature
Task,Setup JWT Token Service,Configure JWT token generation and validation,User Authentication System,High,3,Backend,Backend Developer,task
Task,Create User Database Schema,Design and implement user data models,User Authentication System,High,2,Database,Database Developer,task
Sub-task,Email Verification Template,Create HTML email template for verification,User Authentication System,Low,1,Frontend,Frontend Developer,subtask
Sub-task,Password Strength Validation,Implement client-side password validation,User Authentication System,Low,1,Frontend,Frontend Developer,subtask
```

## Import Instructions

### Preparing for Jira Import

1. **Create Project in Jira**:
   - Set up new project with appropriate issue types
   - Configure components matching your architecture
   - Set up teams and assign appropriate permissions

2. **Validate CSV Format**:
   - Ensure all required fields are populated
   - Verify Epic Links match Epic Summary names exactly
   - Check that all Assignees exist in Jira system
   - Confirm Components are created in Jira project

3. **Import Process**:
   - Navigate to Jira → Settings → System → External System Import
   - Select "CSV" as import type
   - Upload the generated CSV file
   - Map fields according to your Jira configuration
   - Review import preview before confirming

### Post-Import Tasks

1. **Verify Epic Hierarchy**:
   - Confirm all Stories are properly linked to Epics
   - Check that Sub-tasks are connected to parent Stories
   - Validate Epic relationships and dependencies

2. **Assign to Sprints**:
   - Prioritize and assign Stories to development sprints
   - Set Epic start/end dates based on team capacity
   - Configure Epic progress tracking

3. **Configure Boards**:
   - Create Epic boards for high-level tracking
   - Set up Sprint boards for daily development work
   - Configure filters and quick searches

### Customization Options

Modify the CSV generation to match your Jira setup:

- **Custom Fields**: Add organization-specific fields
- **Workflow States**: Map to your development workflow
- **Issue Types**: Adapt to your project's issue type scheme
- **Estimate Fields**: Use Time Tracking vs Story Points vs T-shirt sizes

## Integration with PRP Workflow

The Jira import integrates seamlessly with PRP development:

1. **Epic Breakdown** → Jira Epics created
2. **Feature Planning** (`/prp-planning-create`) → Jira Stories detailed
3. **Implementation** (`/prp-base-create`) → Jira Tasks created
4. **Completion** → Jira items transitioned to Done
5. **Documentation** → Jira items linked to feature docs

## Best Practices

### Naming Conventions
- **Epics**: Business capability names (e.g., "User Authentication System")
- **Stories**: User-focused features (e.g., "User Registration")
- **Tasks**: Technical implementation (e.g., "Setup JWT Token Service")

### Estimation Guidelines
- Estimate based on team velocity and complexity
- Use consistent scale across all team members
- Review and adjust estimates during sprint planning

### Dependency Management
- Use Epic Links to show feature relationships
- Add dependency comments in descriptions
- Plan Epics to minimize cross-team dependencies

### Progress Tracking
- Update Story Points based on actual effort
- Use Epic burndown charts for long-term tracking
- Regular Epic health checks and scope adjustments
