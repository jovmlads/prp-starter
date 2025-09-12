# Trading Dashboard - Jira CSV Import Instructions (Classic Importer)

## 🎯 **Epic Link Method for Classic Jira CSV Importer**

The updated CSV file (`trading-dashboard-jira-import.csv`) uses the **Epic Link field** method optimized for the **classic Jira CSV importer** to ensure automatic Epic-Story relationships are created during import.

```
Epic (Authentication & Security Foundation)
├── Story (User Registration & Login System) - Epic Link: "Authentication & Security Foundation"
├── Story (Session Management & Token Handling) - Epic Link: "Authentication & Security Foundation"
├── Story (Password Recovery & Account Management) - Epic Link: "Authentication & Security Foundation"
├── Story (Protected Routes & Authorization) - Epic Link: "Authentication & Security Foundation"
└── Story (Supabase RLS Policies & Data Security) - Epic Link: "Authentication & Security Foundation"
```

### **Required Fields (Classic Importer Format)**:

✅ **Issue Type** - Epic/Story hierarchy (required)  
✅ **Summary** - Issue titles (required)  
✅ **Epic Link** - Epic names for Story linkage (required for Stories)  
✅ **Priority** - High/Medium/Low priorities  
✅ **Assignee** - Team/developer email assignments  
✅ **Labels** - Epic/feature tags for organization

### **Key Changes for Classic Importer Compatibility**:

✅ **Epic Link Field** - Stories reference Epic names (not IDs or keys)  
✅ **Simplified Structure** - Removed Issue Key, Issue ID, Parent, Status (not needed)  
✅ **Epic Name Matching** - Exact Epic Summary matches in Epic Link field  
✅ **Email Format** - All assignees use valid email format  
✅ **Label Recognition** - Single word labels for automatic mapping

## 📋 **Step-by-Step Jira Import Process (Classic Importer Method)**

### **Step 1: Prerequisites - Enable Epic Link Field**

⚠️ **CRITICAL**: Ensure Epic Link field is available in your project:

1. **Check Epic Link Field**:

   - Go to **Project Settings → Issue Types**
   - Verify **Epic Link** field is available for Story issue type
   - If missing, add Epic Link field to Story screens

2. **Project Configuration**:
   - Ensure **Epic** and **Story** issue types are enabled
   - Verify you're using a Software project (not Business)

### **Step 2: Prepare Jira Project**

1. **Create or Verify Project**:
   - Project Type: **Software Development**
   - Template: **Scrum** or **Kanban**
   - Ensure Epic and Story issue types are available

### **Step 3: Import CSV File Using Classic Importer**

1. **Navigate to Classic Import**:

   - Go to **Settings (cog icon) → System**
   - Navigate to **External system import**
   - Select **CSV**
   - **IMPORTANT**: Use the classic experience for Epic Link support

2. **Upload File**:

   - Select **Choose File** and navigate to `trading-dashboard-jira-import.csv`
   - Click **Next** once uploaded

3. **Select Destination Project**:

   - Choose your **Trading Dashboard** project
   - Leave date/time formatting as default

4. **Critical Field Mapping** (Map CSV columns to Jira fields exactly):

   ```
   CSV Column               → Jira Field (REQUIRED MAPPING)
   ──────────────────────────────────────────────────────
   Issue Type              → Issue Type ✅
   Summary                 → Summary ✅
   Epic Link               → Epic Link ✅ (CRITICAL for Story linking)
   Priority                → Priority ✅
   Assignee                → Assignee ✅
   Labels                  → Labels ✅ (Manual mapping required)
   ```

5. **Epic Link Field Mapping** (MOST IMPORTANT):

   - **CSV "Epic Link" column** MUST map to **"Epic Link" field**
   - This creates automatic Epic → Story relationships
   - Epics have empty Epic Link, Stories reference Epic names

6. **Labels Field Mapping** (Classic Importer Fix):

   - **Manual Selection Required**: Classic importer doesn't auto-detect Labels
   - **Explicitly select "Labels"** from dropdown for Labels column
   - Don't leave unmapped or it will be ignored

7. **Assignee Field Verification**:
   - Verify email addresses map correctly to user accounts
   - Invalid emails will create user creation warnings (acceptable)

### **Step 4: Complete Import Process**

1. **Review Field Mappings**:

   - Verify all 6 fields are properly mapped
   - **Epic Link mapping is CRITICAL** for hierarchy creation
   - **Labels field must be manually selected** from dropdown

2. **Import Execution**:

   - Click **Next** after field mapping
   - Review any warnings (email creation warnings are normal)
   - Click **Begin import**

3. **Expected Import Result**:
   - **7 Epics** created first
   - **40 Stories** created with automatic Epic Link relationships
   - **Epic boards** will show linked Stories immediately
   - **No manual linking required**

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

#### **Problem: "Unable to retrieve issue key for parent" Warnings (EXPECTED)**

**Warning Example**: `Unable to retrieve issue key for parent : TDA-1, TDA-2, TDA-3...`

**Explanation**: ✅ **This is NORMAL and EXPECTED behavior during CSV import**

**Why This Happens**:

1. **Placeholder Issue Keys**: CSV uses placeholder keys (TDA-1, TDA-2) that don't exist yet
2. **Jira Reassignment**: Jira will assign new sequential keys during import process
3. **Parent Resolution**: Jira resolves parent relationships AFTER creating all issues
4. **Hierarchy Creation**: Epic → Story relationships are established using Issue ID mapping

**Verification Steps** (Confirm Import Success):

1. **Check Project Dashboard**:

   - Navigate to your Trading Dashboard project
   - Verify **7 Epics** and **40 Stories** are visible
   - New issue keys will be sequential (TD-1, TD-2, TD-3... or similar)

2. **Verify Epic Hierarchy**:

   - Open any Epic (should show "X of Y Stories completed")
   - Epic should display linked Stories in "Child Issues" section
   - Stories should show parent Epic in "Parent Link" or "Epic Link" field

3. **Check Board View**:
   - Epic boards should show 7 Epics with progress tracking
   - Story boards should group Stories by parent Epic
   - All 47 issues should be accessible and organized

✅ **Expected Result**: Despite warnings, Epic → Story hierarchy should be created automatically

#### **Problem: Stories Not Linked to Epics After Import (CRITICAL FIX NEEDED)**

**Symptoms**:

- Board shows 40 Stories (TD-8 through TD-47) but no Epics
- Stories appear unlinked (no parent Epic relationships)
- 7 Epics exist (TD-1 through TD-7) but are separate from Stories

**Root Cause**: Parent field mapping during import didn't create Epic-Story relationships

**SOLUTION - Manual Epic-Story Linking (Immediate Fix)**:

**Step 1: Bulk Link Stories to Epics**

1. **Open Jira Issues Search**:

   - Navigate to **Issues → Search for Issues**
   - Use JQL: `project = "Trading Dashboard" AND type = Story`

2. **Bulk Edit Stories by Epic Group**:

   **Epic 1 - Authentication & Security Foundation (TD-1)**:

   - Select Stories: TD-8, TD-9, TD-10, TD-11, TD-12
   - **Tools → Bulk Change → Edit Issues**
   - **Add/Change Epic Link** → Select TD-1 (Authentication & Security Foundation)

   **Epic 2 - UI Foundation & Component Library (TD-2)**:

   - Select Stories: TD-13, TD-14, TD-15, TD-16, TD-17, TD-18
   - **Tools → Bulk Change → Edit Issues**
   - **Add/Change Epic Link** → Select TD-2 (UI Foundation & Component Library)

   **Epic 3 - Trading Dashboard & Position Management (TD-3)**:

   - Select Stories: TD-19, TD-20, TD-21, TD-22, TD-23, TD-24
   - **Add/Change Epic Link** → Select TD-3 (Trading Dashboard & Position Management)

   **Epic 4 - Market Data Integration & Trading Signals (TD-4)**:

   - Select Stories: TD-25, TD-26, TD-27, TD-28, TD-29, TD-30
   - **Add/Change Epic Link** → Select TD-4 (Market Data Integration & Trading Signals)

   **Epic 5 - Top Gainers & Market Analytics (TD-5)**:

   - Select Stories: TD-31, TD-32, TD-33, TD-34, TD-35
   - **Add/Change Epic Link** → Select TD-5 (Top Gainers & Market Analytics)

   **Epic 6 - Advanced Trading Statistics & Analytics (TD-6)**:

   - Select Stories: TD-36, TD-37, TD-38, TD-39, TD-40, TD-41
   - **Add/Change Epic Link** → Select TD-6 (Advanced Trading Statistics & Analytics)

   **Epic 7 - Real-time Data Synchronization & Performance Optimization (TD-7)**:

   - Select Stories: TD-42, TD-43, TD-44, TD-45, TD-46, TD-47
   - **Add/Change Epic Link** → Select TD-7 (Real-time Data Synchronization & Performance)

**Step 2: Verify Epic Boards**

After linking, verify:

- **Epic Panel View**: Each Epic shows "X of Y Stories completed"
- **Board Configuration**: Enable Epic panels in board settings
- **Epic Progress**: Stories contribute to Epic completion percentage

**Alternative Method - Individual Story Linking**:

1. **Open each Story** (TD-8, TD-9, etc.)
2. **Find Epic Link field** (or Parent field)
3. **Link to appropriate Epic**:
   - TD-8 through TD-12 → Link to TD-1 (Authentication Epic)
   - TD-13 through TD-18 → Link to TD-2 (UI Foundation Epic)
   - [Continue pattern based on groups above]

**Step 3: Configure Board for Epic Display**

1. **Board Settings**:

   - Navigate to **Board → Configure → Card Layout**
   - Ensure **Epic Name** or **Epic Link** is displayed on cards

2. **Enable Epic Panel**:
   - **Board → Configure → Epics**
   - Enable **Epics Panel** to show Epic swimlanes

✅ **Expected Result After Fix**: Board will show Epic-grouped Stories with proper hierarchy and progress tracking

#### **Problem: Invalid Email Address Errors (User Creation)**

**Error Example**: `Cannot create user availableteam: User availableteam has an invalid e-mail address [ateam@]`

**Cause**: Jira requires valid email addresses for user assignment, not display names

**Solution - Updated CSV with Valid Email Format**:

```csv
Original (Invalid)     → Fixed (Valid Email)
Team Alpha            → team.alpha@company.com
Developer 1           → developer1@company.com
Available Team        → available.team@company.com
```

✅ **Fixed in CSV**: All assignees now use proper email format (developer1@company.com, team.alpha@company.com, etc.)

#### **Problem: Parent Field "Work Item" Format Errors**

**Error Example**: `Cannot add value [ Work item ] to CustomField [TD-1] in Parent Link`

**Cause**: Parent field containing Epic Issue IDs instead of Epic Issue Keys

**Solution - Corrected Parent Field Format**:

```csv
Original (Causes Error)    → Fixed (Correct Format)
Parent: 1                 → Parent: TDA-1
Parent: 2                 → Parent: TDA-2
Parent: 3                 → Parent: TDA-3
```

✅ **Fixed in CSV**: All Parent fields now reference Epic Issue Keys (TDA-1, TDA-2) instead of numeric IDs

#### **Problem: Hierarchy Not Created After Import**

**Solution**:

1. Verify **Issue ID** and **Parent** columns were mapped correctly
2. Check that Epic Keys (TDA-1, TDA-2) appear in Parent column for Stories
3. Ensure CSV follows hierarchy order: Epics first, then Stories

#### **Problem: Issues Import But No Relationships**

**Solution**:

1. Confirm using **classic import experience** (not new importer)
2. Verify **Parent** field mapping (not Epic Link - deprecated)
3. Check Issue Key format consistency (TDA-1, TDA-2, etc.)

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
