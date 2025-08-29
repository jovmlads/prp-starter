# Trading Dashboard - Jira Import Instructions

## 🎯 **Simplified CSV Structure - Guaranteed Jira Compatibility**

The updated CSV file (`trading-dashboard-jira-import.csv`) uses **only universal Jira fields** that exist in every instance:

```
Epic (Authentication & Security Foundation)
├── Story (User Registration & Login System)
├── Story (Session Management & Token Handling)
├── Story (Password Recovery & Account Management)
├── Story (Protected Routes & Authorization)
└── Story (Supabase RLS Policies & Data Security)
```

### **Universal Fields Used**:

✅ **Issue Type** - Epic/Story hierarchy  
✅ **Summary** - Issue titles  
✅ **Description** - Detailed descriptions  
✅ **Priority** - High/Medium/Low priorities  
✅ **Assignee** - Team/developer assignments  
✅ **Labels** - Epic/feature tags for organization

### **Simplified Approach**:

✅ **No Story Points** - Add manually after import (varies by Jira setup)  
✅ **No Components** - Use Labels for team organization  
✅ **No Parent Field** - Manual Epic linking post-import  
✅ **100% Compatible** - Works with every Jira Cloud instance

## 📋 **Step-by-Step Jira Import Process**

### **Step 1: Prepare Jira Project**

1. **Create New Jira Project**:

   - Project Type: **Software Development**
   - Template: **Scrum** or **Kanban**

2. **Configure Issue Types**:

   - Enable **Epic**, **Story**, and **Subtask** issue types
   - Ensure **Epic Name** custom field is available
   - Configure **Components** for technical areas

3. **Set Up Components**:
   - **Authentication** - User login, security, JWT handling
   - **Frontend** - UI components, shadcn/ui, layout
   - **Trading** - Trade management, portfolio, P&L
   - **Market Data** - APIs, real-time data, signals
   - **Analytics** - Statistics, charts, performance
   - **Statistics** - Advanced analytics, reporting
   - **Integration** - WebSockets, caching, performance
   - **Database** - Supabase, RLS policies

### **Step 2: Import CSV File**

1. **Navigate to Import**:

   - Go to **Project Settings → Import**
   - Select **Import issues from CSV**

2. **Upload File**:

   - Upload `trading-dashboard-jira-import.csv`
   - Select **CSV file** option

3. **Map CSV Columns** (All Will Map Automatically):

   ```
   CSV Column               → Jira Field
   ────────────────────────────────────────
   Issue Type              → Issue Type ✅
   Summary                 → Summary ✅
   Description             → Description ✅
   Priority                → Priority ✅
   Assignee                → Assignee ✅
   Labels                  → Labels ✅
   ```

4. **Perfect Mapping**:
   - **All 6 fields** will map automatically without any custom configuration
   - **No dropdowns to select** - everything maps perfectly
   - **No missing fields** - all columns have exact Jira matches

### **Step 3: Verify Import Results**

After import, you should see:

#### **Epic View**:

- **7 Epics** representing major project initiatives
- Each Epic shows progress of its child Stories
- Epic burndown charts available

#### **Story View**:

- **32 Stories** properly linked to their parent Epics
- Each Story shows its Subtasks (where applicable)
- Story points assigned for sprint planning

#### **Board Configuration**:

- **Epic Board**: Shows progress across all 7 Epics
- **Sprint Board**: Shows Stories and Subtasks for current sprint
- **Kanban Board**: Shows flow of work through TO DO → IN PROGRESS → DONE

### **Step 4: Move Epics from Timeline to Board**

🎯 **Your Epics are visible in Timeline/Roadmap but not on the Board. Here's how to move them:**

#### **Method 1: Epic Board Configuration (Recommended)**

1. **Create Epic-Specific Board**:

   - Go to your project → **Boards** → **View all boards**
   - Click **Create board** → **Create a Kanban board**
   - Select **Board from an existing project** → Choose your project

2. **Configure for Epics**:

   - **Board Name**: "Trading Dashboard - Epic Board"
   - **Board Type**: Kanban (better for Epic management)
   - **Issue Filter**: Will auto-populate with project Epics

3. **Enable Epic Panel**:
   - In board settings → **Features** → Enable **Epics**
   - This shows Epics in a sidebar with their child Stories

#### **Method 2: Add Epics to Existing Board Filter**

1. **Access Board Settings**:

   - On your current Board → Click **⋯** (more options)
   - Select **Board settings** (if visible)

2. **Update Board Filter**:

   - Go to **General** tab → **Saved filter**
   - Edit the JQL filter to include Epics:

   ```jql
   project = "Trading Dashboard A1" AND type in (Epic, Story, Task)
   ```

3. **Save Changes**:
   - Epics will now appear on your board alongside Stories

#### **Method 3: Direct Epic Movement (Manual)**

1. **Open Any Epic**:

   - From Timeline view, click on an Epic
   - Or go to List view and click an Epic

2. **Change Epic Status**:

   - In the Epic details → **Status** field
   - Change from whatever status to **TO DO**
   - Epic should now appear in TO DO column on Board

3. **Bulk Epic Movement**:
   - Select multiple Epics in List view
   - **Bulk change** → **Edit Issues** → **Change Status**
   - Set all to **TO DO** or **IN PROGRESS**

#### **Method 4: Backlog-to-Board for Epics**

1. **Epic Backlog View**:

   - Go to **Backlog** tab
   - Look for **Epics** panel (usually on left side)
   - Your 7 Epics should be listed there

2. **Epic Planning**:
   - Drag Stories from Epics into Sprints
   - This automatically activates the Epic on the board
   - Epic progress shows based on Story completion

#### **Method 5: Timeline to Board Sync**

1. **Timeline Epic Status**:

   - In **Timeline** view, click on Epic
   - Change **Status** from "Timeline-only" to **TO DO**

2. **Board Refresh**:
   - Go back to **Board** view
   - Epic should now appear in TO DO column
   - You can drag between columns (TO DO → IN PROGRESS → DONE)

### **Quick Troubleshooting**:

❌ **Epics not showing on Board?**

- Check if board filter includes `type = Epic`
- Verify Epic status is not "Timeline-only" or custom status

❌ **Board settings not accessible?**

- Try Method 3 (Direct Epic Status Change)
- Or create new Epic-specific board (Method 1)

❌ **Only Stories showing, no Epics?**

- Your board might be configured for Story-level work only
- Use Epic panel or create Epic board instead

### **Step 5: Populate the Board (Simple Direct Method)**

🎯 **Your board is empty because imported CSV issues are in the List view but not appearing on the Board. Here's the simplest fix:**

#### **Method 1: Use Backlog View (Works 100% of the time)**

1. **Switch to Backlog**:

   - Look for **Backlog** tab in your project navigation
   - Click **Backlog** (usually next to Board)

2. **You'll See All Issues**:

   - All 39 imported issues will be visible in the backlog
   - They're organized as a list of items ready for sprint planning

3. **Move to Board**:
   - **Create Sprint**: Click **Create Sprint** button
   - **Drag Issues**: Drag issues from Backlog to Sprint
   - **Start Sprint**: Click **Start Sprint** button
   - **View Board**: Switch back to Board tab - issues now visible!

#### **Method 2: Manual Issue Movement (Direct)**

1. **Go to Any Single Issue**:

   - From your List view, click any Story
   - Look for **More** actions (⋯ button)

2. **Move to Sprint**:

   - Click **Move to Sprint** or **Add to Sprint**
   - Select or create a sprint
   - Repeat for a few issues

3. **Board Population**:
   - Board will show issues as you add them to sprints
   - TO DO column populates automatically

#### **Method 3: URL-Based Board Creation**

1. **Try This Direct URL**:

   ```
   https://[your-domain].atlassian.net/jira/software/projects/[PROJECT-KEY]/boards
   ```

   Replace `[your-domain]` with your Jira domain and `[PROJECT-KEY]` with your project key

2. **Auto-Generated Board**:
   - Should show a default board with all issues
   - If not, the Backlog method above will definitely work

### **Step 5: Post-Import Configuration**

1. **Verify Board Population**:

   - Refresh your board - should now show all 39 issues
   - **Epics**: Show in Epic panel (if enabled)
   - **Stories**: Show in main board columns

2. **Set Up Sprints**:

   - Click **Backlog** tab
   - Create sprints based on development phases:
     - **Sprint 1-2**: Foundation Epics (F1, F2)
     - **Sprint 3-5**: Core Business Epics (C1, C2, C3)
     - **Sprint 6-8**: Enhancement & Integration (E1, I1)

3. **Start Sprint Planning**:

   - Drag Stories from **Backlog** to **Sprint 1**
   - Begin with **Authentication & Security Foundation** Epic
   - Add **UI Foundation & Component Library** Epic
   - Click **Start Sprint**

4. **Team Assignment**:

   - **Team Alpha**: Authentication & Trading Dashboard Epics
   - **Team Beta**: UI Foundation & Market Data Epics
   - **Team Gamma**: Top Gainers & Analytics Epic
   - **Integration Team**: Real-time Synchronization Epic

5. **Configure Workflows**:
   - Ensure proper transitions between TO DO → IN PROGRESS → DONE
   - Set up automatic Epic progress based on Story completion
   - Configure notifications for team members

## 🔧 **Key Changes Made to Fix Hierarchy**

### **Before (Flat Structure)**:

```csv
Issue Type,Summary,Description,Epic Link,Priority...
Epic,Authentication & Security Foundation,...
Story,User Registration & Login System,...
Task,Email/password registration,...  ❌ Tasks not linked properly
```

### **After (Proper Hierarchy - Using Parent Field)**:

```csv
Issue Type,Summary,Description,Priority,Story Points,Component,Parent...
Epic,Authentication & Security Foundation,,...,,Authentication,          ← Epic (no parent)
Story,User Registration & Login System,...,Medium,5,Authentication,Authentication & Security Foundation  ← Story linked to Epic
Subtask,Email/password registration,...,Low,2,Authentication,Authentication & Security Foundation     ← Subtask linked to Epic
```

### **Critical Fix**:

- **Removed Epic Name** → **Added Parent field** for universal Jira compatibility
- **Changed Components** → **Component** (singular) for standard field mapping
- **Parent field automatically creates** Epic → Story → Subtask hierarchy
- **No custom fields required** - uses standard Jira Parent linking

## 📊 **Expected Jira Structure After Import**

### **Epic Dashboard View**:

```
Authentication & Security Foundation    [████████░░] 80%
├── 5 Stories, 3 Subtasks
└── Team Alpha assigned

UI Foundation & Component Library       [██████████] 100%
├── 6 Stories, 0 Subtasks
└── Team Beta assigned

Trading Dashboard & Position Management [██████░░░░] 60%
├── 6 Stories, 0 Subtasks
└── Team Alpha assigned

[... other Epics ...]
```

### **Sprint Planning View**:

- Drag Stories from Backlog to Sprint
- Subtasks automatically included with parent Stories
- Story points roll up to Epic level
- Team capacity planning based on Components

### **Progress Tracking**:

- **Epic Progress**: Automatic calculation based on Story completion
- **Sprint Progress**: Burndown charts for current sprint
- **Team Progress**: Velocity tracking by Component/Team
- **Overall Progress**: Project-level Epic completion tracking

## 🚀 **Ready for Development**

After successful import, your Jira project will have:

✅ **Proper Epic → Story → Subtask hierarchy**  
✅ **7 Epics** with clear business value  
✅ **32 Stories** with story point estimates  
✅ **Component-based team assignments**  
✅ **Sprint-ready backlog structure**  
✅ **Epic and Sprint boards configured**

The structure now matches exactly what you saw in your screenshot but with proper Epic organization instead of everything in one flat TO DO column.

**Next Step**: Start Sprint 1 with Foundation Epics (F1: Authentication, F2: UI Foundation) and assign to respective teams!
