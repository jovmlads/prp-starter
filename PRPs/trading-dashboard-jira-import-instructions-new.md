# Trading Dashboard - Official Jira Import Instructions

## 🎯 **Official Atlassian Parent-Child Mapping Structure**

The updated CSV file (`trading-dashboard-jira-import.csv`) follows **official Atlassian guidelines** for maintaining parent-child relationships during CSV import to Jira Cloud, as documented at: https://support.atlassian.com/jira/kb/keep-issue-parent-child-mapping-during-csv-import-to-jira-cloud/

```
Epic (Authentication & Security Foundation) - ID: 1
├── Story (User Registration & Login System) - ID: 8, Parent: 1
├── Story (Session Management & Token Handling) - ID: 9, Parent: 1
├── Story (Password Recovery & Account Management) - ID: 10, Parent: 1
├── Story (Protected Routes & Authorization) - ID: 11, Parent: 1
└── Story (Supabase RLS Policies & Data Security) - ID: 12, Parent: 1
```

### **Required Fields (Official Atlassian Format)**:

✅ **Issue Type** - Epic/Story hierarchy (required)  
✅ **Issue Key** - Placeholder keys (TDA-1, TDA-2, etc.)  
✅ **Issue ID** - Unique identifiers for parent-child mapping (required)  
✅ **Summary** - Issue titles (required)  
✅ **Parent** - Issue ID references for hierarchy (required)  
✅ **Status** - All set to "To Do" initially  
✅ **Priority** - High/Medium/Low priorities  
✅ **Assignee** - Team/developer assignments  
✅ **Labels** - Epic/feature tags for organization

### **Critical Updates from Atlassian Guidelines**:

✅ **Parent Field Required** - Essential for maintaining Epic → Story hierarchy  
✅ **Issue ID Mapping** - Each issue has unique ID, Stories reference Epic IDs in Parent field  
✅ **Proper Hierarchy Order** - Epics listed first (IDs 1-7), then Stories (IDs 8-47)  
✅ **Epic Link Deprecated** - Replaced with Parent field as of April 2024  
✅ **Status Field Added** - All issues start in "To Do" status  
✅ **Issue Key Placeholders** - TDA-1, TDA-2, etc. (will be reassigned during import)

## 📋 **Step-by-Step Jira Import Process (Official Atlassian Method)**

### **Step 1: Prerequisites - Enable Sub-tasks**

⚠️ **CRITICAL**: Before importing, ensure sub-tasks are enabled in your Jira instance:

1. **Navigate to Jira Administration**:

   - Go to **Settings (cog icon) → System**
   - Navigate to **Work items → Sub-Tasks**
   - Or visit directly: `https://[yoursite].atlassian.net/secure/admin/subtasks/ManageSubTasks.jspa`

2. **Enable Sub-tasks**:

   - Ensure sub-tasks are enabled
   - This makes the **Parent** field available during import mapping

3. **Verify Linked Issues Field**:
   - Ensure **Linked Issues** field is included on all screens
   - This resolves Parent field mapping issues during import

### **Step 2: Prepare Jira Project**

1. **Create New Jira Project**:

   - Project Type: **Software Development**
   - Template: **Scrum** or **Kanban**
   - Project Key: **TDA** (matches CSV Issue Keys)

2. **Configure Issue Types**:
   - Ensure **Epic** and **Story** issue types are available
   - Verify **Parent** field is accessible (requires sub-tasks enabled)

### **Step 3: Import CSV File Using Official Method**

1. **Navigate to Classic Import Experience**:

   - Go to **Settings (cog icon) → System**
   - Navigate to **External system import** under "Import and export" heading
   - Select **Switch to the old experience** (required for Parent field mapping)
   - Select **CSV**

2. **Upload File**:

   - Select **Choose File** and navigate to `trading-dashboard-jira-import.csv`
   - Click **Next** once uploaded

3. **Select Destination Project**:

   - Choose your **Trading Dashboard** project
   - Leave date/time formatting as default unless you have custom fields

4. **Critical Field Mapping** (Map CSV columns to Jira fields exactly):

   ```
   CSV Column               → Jira Field
   ────────────────────────────────────────
   Issue Type              → Issue Type ✅
   Issue Key               → Issue Key ✅
   Issue ID                → Issue ID ✅
   Summary                 → Summary ✅
   Parent                  → Parent ✅
   Status                  → Status ✅
   Priority                → Priority ✅
   Assignee                → Assignee ✅
   Labels                  → Labels ✅
   ```

5. **Verify Parent Field Mapping**:

   - **MOST IMPORTANT**: Ensure **Parent** column maps to **Parent** field
   - If Parent field is not available, verify sub-tasks are enabled (Step 1)
   - This mapping creates the Epic → Story hierarchy automatically

6. **Status Mapping Verification**:

   - Verify **"To Do"** status maps to appropriate status in your project
   - All issues will be created in "To Do" state initially

7. **Complete Import**:
   - Click **Next** after field mapping
   - Review status mappings
   - Click **Begin import**

### **Step 4: Verify Successful Parent-Child Import**

After import, you should see **automatic Epic → Story hierarchy**:

#### **Expected Results**:

- **7 Epics** with Issue IDs 1-7 (Authentication, UI Foundation, Trading Dashboard, etc.)
- **40 Stories** with Issue IDs 8-47, each properly linked to parent Epic
- **Automatic hierarchy** visible in Epic panels and boards
- **No manual linking required** - Parent field creates relationships automatically

#### **Epic Structure Examples**:

```
🔐 Authentication & Security Foundation (TDA-1)
├── 👤 User Registration & Login System (TDA-8)
├── 🔑 Session Management & Token Handling (TDA-9)
├── 🔒 Password Recovery & Account Management (TDA-10)
├── 🛡️ Protected Routes & Authorization (TDA-11)
└── 🔒 Supabase RLS Policies & Data Security (TDA-12)

🎨 UI Foundation & Component Library (TDA-2)
├── ⚙️ shadcn/ui Setup & Configuration (TDA-13)
├── 📱 Dashboard Layout Components (TDA-14)
├── 📊 Data Table Components (TDA-15)
├── 📈 Chart & Visualization Components (TDA-16)
├── 📝 Form & Input Components (TDA-17)
└── 🎛️ Widget & Card Components (TDA-18)
```

#### **Board Population**:

- **Epic Boards**: Show all 7 Epics with progress tracking
- **Story Boards**: Display Stories grouped by parent Epic
- **Kanban/Scrum Boards**: Include all issues with proper hierarchy
- **Filters**: Can filter by Epic using parent relationships

### **Step 5: Troubleshooting Common Issues**

#### **Problem: Parent Field Not Available During Mapping**

**Solution**:

1. Enable sub-tasks: **Settings → System → Work items → Sub-Tasks**
2. Add **Linked Issues** field to all screens in project
3. Restart import process with classic import experience

#### **Problem: Hierarchy Not Created After Import**

**Solution**:

1. Verify **Issue ID** and **Parent** columns were mapped correctly
2. Check that Epic IDs (1-7) appear in Parent column for Stories
3. Ensure CSV follows hierarchy order: Epics first, then Stories

#### **Problem: Issues Import But No Relationships**

**Solution**:

1. Confirm using **classic import experience** (not new importer)
2. Verify **Parent** field mapping (not Epic Link - deprecated)
3. Check Issue ID uniqueness and proper parent references

#### **Problem: Some Issues Missing from Import**

**Solution**:

1. Check CSV formatting - no special characters in Issue IDs
2. Verify all required fields have values (empty Parent OK for Epics)
3. Ensure project has correct issue types enabled (Epic, Story)

## 🔧 **Key Changes from Previous Approach**

### **Before (Universal Fields - Manual Linking)**:

```csv
Issue Type,Summary,Description,Priority,Assignee,Labels
Epic,Authentication & Security Foundation,...,High,Team Alpha,epic
Story,User Registration & Login System,...,Medium,Developer 1,feature
```

❌ **Problems**:

- No automatic Epic → Story relationships
- Required manual linking after import
- Epic Link field deprecated April 2024

### **After (Official Atlassian Parent-Child Method)**:

```csv
Issue Type,Issue Key,Issue ID,Summary,Parent,Status,Priority,Assignee,Labels
Epic,TDA-1,1,Authentication & Security Foundation,,To Do,High,Team Alpha,epic
Story,TDA-8,8,User Registration & Login System,1,To Do,Medium,Developer 1,feature
```

✅ **Advantages**:

- **Automatic hierarchy creation** using Parent field
- **Official Atlassian method** - guaranteed compatibility
- **Epic Link replacement** - uses current Parent field standard
- **Proper ordering** - Epics first, Stories reference Epic IDs
- **Issue ID mapping** - each issue has unique ID for relationship mapping
- **Status consistency** - all issues start in "To Do"

### **Critical Changes Made**:

1. **Added Required Fields**:

   - **Issue Key**: TDA-1, TDA-2, etc. (placeholder keys)
   - **Issue ID**: 1, 2, 3... (unique identifiers for parent references)
   - **Status**: "To Do" (initial state for all issues)

2. **Implemented Parent Field Mapping**:

   - **Epics**: Empty Parent field (top-level items)
   - **Stories**: Parent field contains Epic's Issue ID
   - **Example**: Story ID 8 has Parent = 1 (links to Epic ID 1)

3. **Proper Hierarchy Ordering**:

   - **Rows 1-7**: All Epics (no parent references)
   - **Rows 8-47**: All Stories (each references parent Epic ID)
   - **Maintains dependency order** required by Atlassian

4. **Replaced Deprecated Fields**:
   - **Removed**: Epic Link (deprecated April 2024)
   - **Added**: Parent field (current standard)
   - **Removed**: Description (optional field, simplified)

## 📊 **Expected Jira Structure After Import**

### **Automatic Epic Dashboard View**:

```
🔐 Authentication & Security Foundation    [████████░░] Progress: 0/5
├── 5 Stories automatically linked
└── Team Alpha assigned

🎨 UI Foundation & Component Library       [██████████] Progress: 0/6
├── 6 Stories automatically linked
└── Team Beta assigned

💼 Trading Dashboard & Position Management [██████░░░░] Progress: 0/6
├── 6 Stories automatically linked
└── Team Alpha assigned

[... other Epics with automatic Story linking ...]
```

### **Sprint Planning Benefits**:

- **Drag Stories from Epics** directly into sprints
- **Epic progress tracking** based on Story completion
- **Automatic burndown charts** for each Epic
- **Team velocity tracking** by Epic assignment
- **Parent-child filtering** in boards and reports

### **Board Configuration Results**:

- **Epic Boards**: Show all 7 Epics with linked Stories visible
- **Sprint Boards**: Stories grouped by parent Epic automatically
- **Kanban Boards**: Epic lanes with Stories flowing through statuses
- **Hierarchy Reports**: Epic → Story relationships in all reports

## 🚀 **Ready for Development**

After successful import, your Jira project will have:

✅ **Automatic Epic → Story hierarchy** created via Parent field mapping  
✅ **7 Epics** with clear business value and team assignments  
✅ **40 Stories** properly linked to parent Epics  
✅ **Board-ready structure** with Epic lanes and Story organization  
✅ **Sprint-ready backlog** with Epic-based planning  
✅ **Progress tracking** with Epic burndown and Story completion

The structure now follows official Atlassian guidelines and creates proper Epic-Story relationships automatically during import, eliminating all manual linking requirements!

**Next Step**: Start Sprint 1 with Foundation Epics (Authentication & Security Foundation, UI Foundation & Component Library) and begin parallel development! 🚀
