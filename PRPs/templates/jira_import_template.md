# Official Jira Import Template (Atlassian Parent-Child Method)

This template follows **official Atlassian guidelines** for generating Jira-ready CSV import files that maintain parent-child relationships during import, as documented at: https://support.atlassian.com/jira/kb/keep-issue-parent-child-mapping-during-csv-import-to-jira-cloud/

## Required CSV Structure (Official Atlassian Format)

The generated `PRPs/[project-name]-jira-import.csv` file **MUST** follow this exact format:

```csv
Issue Type,Issue Key,Issue ID,Summary,Parent,Status,Priority,Assignee,Labels
Epic,PRJ-1,1,Epic Name,,To Do,High,Team Lead,epic
Story,PRJ-2,2,Feature Name,1,To Do,Medium,Developer,feature
Story,PRJ-3,3,Another Feature,1,To Do,Medium,Developer,feature
```

## Critical Requirements (Atlassian Specifications)

### **Mandatory Fields**:

✅ **Issue Type** - Epic/Story/Task hierarchy (required)  
✅ **Issue Key** - Placeholder keys (PRJ-1, PRJ-2, etc.) - will be reassigned  
✅ **Issue ID** - Unique numeric identifiers for parent-child mapping (required)  
✅ **Summary** - Issue titles (required)  
✅ **Parent** - Issue ID references for hierarchy (required for non-Epic items)  
✅ **Status** - Initial status (typically "To Do")

### **Hierarchy Ordering Requirements**:

1. **Epics MUST be listed first** (Issue IDs 1-N, empty Parent field)
2. **Stories follow Epics** (Issue IDs N+1-M, Parent = Epic Issue ID)
3. **Sub-tasks follow Stories** (Issue IDs M+1-Z, Parent = Story Issue ID)

### **Parent Field Mapping**:

- **Epics**: Parent field is **empty** (top-level items)
- **Stories**: Parent field contains **Epic's Issue ID**
- **Sub-tasks**: Parent field contains **Story's Issue ID**

## Example Project Structure (Correct Format)

```csv
Issue Type,Issue Key,Issue ID,Summary,Parent,Status,Priority,Assignee,Labels
Epic,TDA-1,1,User Authentication System,,To Do,High,Backend Team,epic
Epic,TDA-2,2,Dashboard UI Framework,,To Do,High,Frontend Team,epic
Story,TDA-3,3,User Registration & Login,1,To Do,Medium,Developer 1,feature
Story,TDA-4,4,OAuth2 Integration,1,To Do,Medium,Developer 2,feature
Story,TDA-5,5,Dashboard Layout Components,2,To Do,Medium,Developer 3,feature
Story,TDA-6,6,Navigation & Routing,2,To Do,Medium,Developer 4,feature
Sub-task,TDA-7,7,Email Verification Template,3,To Do,Low,Developer 1,task
Sub-task,TDA-8,8,Password Validation Logic,3,To Do,Low,Developer 1,task
```

## Field Descriptions (Updated for Parent-Child Method)

### Issue Type Hierarchy

- **Epic**: Business capability (3-6 months, multiple teams)
- **Story**: User-facing feature (1-2 weeks, single developer)
- **Sub-task**: Component of Story (1-3 days, focused work)

### Issue ID Strategy

- **Sequential numbering**: 1, 2, 3, 4, 5...
- **Unique across entire import**: No duplicates allowed
- **Referenced in Parent field**: Stories reference Epic IDs, Sub-tasks reference Story IDs

### Parent Field Rules

- **Epic Parent**: Always empty (top-level hierarchy)
- **Story Parent**: Contains Epic's Issue ID (e.g., "1" for Epic with ID 1)
- **Sub-task Parent**: Contains Story's Issue ID (e.g., "3" for Story with ID 3)

### Status Field

- **All issues start "To Do"**: Consistent initial state
- **Maps to project workflow**: Ensure "To Do" status exists in destination project
- **Post-import transitions**: Move items through workflow as needed

### Priority Levels (Standard Jira)

- **Highest**: Critical blockers, security issues
- **High**: Foundation Epics, core dependencies
- **Medium**: Standard features, user stories
- **Low**: Enhancements, non-critical features
- **Lowest**: Future considerations, nice-to-have items

## Import Instructions (Official Atlassian Process)

### **Step 1: Prerequisites**

⚠️ **CRITICAL**: Before importing, ensure these requirements are met:

1. **Enable Sub-tasks in Jira**:

   - **Settings → System → Work items → Sub-Tasks**
   - Or visit: `https://[yoursite].atlassian.net/secure/admin/subtasks/ManageSubTasks.jspa`
   - **Required for Parent field availability**

2. **Verify Linked Issues Field**:
   - Ensure **Linked Issues** field is on all screens
   - **Required for Issue ID and Parent field mapping**

### **Step 2: CSV Validation Checklist**

Before importing, verify your CSV meets these requirements:

✅ **Hierarchy Order**: Epics first (IDs 1-N), then Stories (IDs N+1-M), then Sub-tasks  
✅ **Issue ID Unique**: Every row has unique Issue ID (1, 2, 3, 4...)  
✅ **Parent References**: Stories reference Epic IDs, Sub-tasks reference Story IDs  
✅ **Empty Parent for Epics**: Top-level Epics have empty Parent field  
✅ **Status Consistency**: All items have "To Do" or valid status  
✅ **Issue Key Format**: Consistent format (PRJ-1, PRJ-2, etc.)

### **Step 3: Import Process (Use Classic Experience)**

1. **Navigate to Classic Import**:

   - **Settings (cog) → System → External system import**
   - **Select "Switch to the old experience"** (required for Parent field)
   - **Choose CSV option**

2. **Upload and Map Fields**:

   ```
   CSV Column     → Jira Field (REQUIRED MAPPING)
   ─────────────────────────────────────────────
   Issue Type     → Issue Type ✅
   Issue Key      → Issue Key ✅
   Issue ID       → Issue ID ✅ (CRITICAL)
   Summary        → Summary ✅
   Parent         → Parent ✅ (CRITICAL)
   Status         → Status ✅
   Priority       → Priority
   Assignee       → Assignee
   Labels         → Labels
   ```

3. **Verify Critical Mappings**:
   - **Issue ID → Issue ID**: Required for relationship mapping
   - **Parent → Parent**: Creates Epic → Story → Sub-task hierarchy
   - If Parent field not available, check Step 1 prerequisites

### **Step 4: Post-Import Verification**

After successful import, verify:

✅ **Epic Hierarchy Created**: Stories automatically linked to parent Epics  
✅ **Board Population**: Issues appear on boards with proper Epic grouping  
✅ **Progress Tracking**: Epic burndown shows Story completion progress  
✅ **Relationship Filtering**: Can filter Stories by parent Epic

### **Step 5: Troubleshooting**

| Problem                      | Solution                                              |
| ---------------------------- | ----------------------------------------------------- |
| Parent field not available   | Enable sub-tasks, add Linked Issues field to screens  |
| No hierarchy after import    | Verify Parent column mapped to Parent field           |
| Issues missing relationships | Use classic import experience, check Issue ID mapping |
| Some issues not imported     | Check CSV format, ensure unique Issue IDs             |

## Integration with PRP Commands

The Parent-Child CSV method integrates with PRP workflow:

1. **Epic Breakdown** (`/project-epic-breakdown`) → Generates proper CSV with hierarchy
2. **Feature Planning** (`/planning-create`) → References Epic IDs for Story linkage
3. **Implementation** (`/create-base-prp`) → Creates Sub-tasks linked to Stories
4. **Sprint Planning** → Drag Stories from Epic groups into sprints
5. **Progress Tracking** → Epic completion based on Story/Sub-task progress

## Template Customization

### For Different Project Types:

**E-commerce Platform**:

```csv
Issue Type,Issue Key,Issue ID,Summary,Parent,Status,Priority,Assignee,Labels
Epic,ECOM-1,1,Product Catalog System,,To Do,High,Backend Team,epic
Epic,ECOM-2,2,Checkout & Payment Flow,,To Do,High,Frontend Team,epic
Story,ECOM-3,3,Product Search & Filtering,1,To Do,Medium,Developer 1,feature
Story,ECOM-4,4,Shopping Cart Management,2,To Do,Medium,Developer 2,feature
```

**Mobile App**:

```csv
Issue Type,Issue Key,Issue ID,Summary,Parent,Status,Priority,Assignee,Labels
Epic,MOBILE-1,1,User Onboarding Experience,,To Do,High,Mobile Team,epic
Epic,MOBILE-2,2,Core Feature Implementation,,To Do,High,Mobile Team,epic
Story,MOBILE-3,3,Registration & Profile Setup,1,To Do,Medium,iOS Developer,feature
Story,MOBILE-4,4,Main Navigation & Tab Bar,2,To Do,Medium,Android Developer,feature
```

## Best Practices for Parent-Child CSV

### Naming Conventions:

- **Issue Keys**: Use project abbreviation + sequential number (TDA-1, TDA-2...)
- **Issue IDs**: Sequential integers starting from 1
- **Summaries**: Clear, action-oriented descriptions

### Hierarchy Design:

- **Epics**: 3-8 Stories each (manageable scope)
- **Stories**: 0-5 Sub-tasks each (optional decomposition)
- **Dependencies**: Minimize cross-Epic dependencies

### Team Assignment:

- **Epic Level**: Assign to team leads or product owners
- **Story Level**: Assign to individual developers
- **Sub-task Level**: Same developer as parent Story

### Progress Tracking:

- **Epic Progress**: Automatic calculation from Story completion
- **Sprint Velocity**: Track Story Points at Story level
- **Burndown Charts**: Epic-level for long-term, Sprint-level for daily

This template ensures your CSV imports create proper Epic → Story → Sub-task hierarchies automatically, following official Atlassian guidelines for maximum compatibility and functionality.
