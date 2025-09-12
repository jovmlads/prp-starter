# Jira Import Template (Classic Importer - Epic Link Method)

This template uses the **Epic Link field method** optimized for the **classic Jira CSV importer** to ensure automatic Epic-Story relationships are created during import.

## Required CSV Structure (Classic Importer Format)

The generated `PRPs/[project-name]-jira-import.csv` file **MUST** follow this exact format:

```csv
Issue Type,Summary,Epic Link,Priority,Assignee,Labels
Epic,Epic Name,,High,team.lead@company.com,epic
Story,Feature Name,Epic Name,Medium,developer@company.com,feature
Story,Another Feature,Epic Name,Medium,developer@company.com,feature
```

## Critical Requirements (Classic Importer Specifications)

### **Mandatory Fields**:

✅ **Issue Type** - Epic/Story hierarchy (required)  
✅ **Summary** - Issue titles (required)  
✅ **Epic Link** - Epic names for Story linkage (required for Stories)  
✅ **Priority** - High/Medium/Low priorities  
✅ **Assignee** - Team/developer email assignments  
✅ **Labels** - Epic/feature tags for organization

### **Epic Link Field Rules**:

- **Epics**: Epic Link field is **empty** (top-level items)
- **Stories**: Epic Link field contains **exact Epic Summary name**
- **No Issue IDs or Keys**: Use actual Epic names for linking

### **Assignee Field Format**:

- **Valid Email Addresses Required**: Jira requires proper email format for user assignment
- **Correct Format**: developer1@company.com, team.alpha@company.com
- **Invalid Format**: Developer 1, Team Alpha (causes import errors)

## Example Project Structure (Correct Format)

```csv
Issue Type,Summary,Epic Link,Priority,Assignee,Labels
Epic,User Authentication System,,High,backend.team@company.com,epic
Epic,Dashboard UI Framework,,High,frontend.team@company.com,epic
Story,User Registration & Login,User Authentication System,Medium,developer1@company.com,feature
Story,OAuth2 Integration,User Authentication System,Medium,developer2@company.com,feature
Story,Dashboard Layout Components,Dashboard UI Framework,Medium,developer3@company.com,feature
Story,Navigation & Routing,Dashboard UI Framework,Medium,developer4@company.com,feature
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
- **Story Parent**: Contains Epic's Issue Key (e.g., "TDA-1" for Epic with key TDA-1)
- **Sub-task Parent**: Contains Story's Issue Key (e.g., "TDA-3" for Story with key TDA-3)

### Assignee Field Requirements

- **Email Format Required**: All assignees must use valid email addresses
- **Valid Examples**: developer1@company.com, team.lead@company.com, frontend.team@company.com
- **Invalid Examples**: Developer 1, Team Lead, Frontend Team (will cause import errors)
- **Team Assignment**: Use team-based emails for Epic-level assignments

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
Epic,ECOM-1,1,Product Catalog System,,To Do,High,backend.team@company.com,epic
Epic,ECOM-2,2,Checkout & Payment Flow,,To Do,High,frontend.team@company.com,epic
Story,ECOM-3,3,Product Search & Filtering,ECOM-1,To Do,Medium,developer1@company.com,feature
Story,ECOM-4,4,Shopping Cart Management,ECOM-2,To Do,Medium,developer2@company.com,feature
```

**Mobile App**:

```csv
Issue Type,Issue Key,Issue ID,Summary,Parent,Status,Priority,Assignee,Labels
Epic,MOBILE-1,1,User Onboarding Experience,,To Do,High,mobile.team@company.com,epic
Epic,MOBILE-2,2,Core Feature Implementation,,To Do,High,mobile.team@company.com,epic
Story,MOBILE-3,3,Registration & Profile Setup,MOBILE-1,To Do,Medium,ios.developer@company.com,feature
Story,MOBILE-4,4,Main Navigation & Tab Bar,MOBILE-2,To Do,Medium,android.developer@company.com,feature
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
