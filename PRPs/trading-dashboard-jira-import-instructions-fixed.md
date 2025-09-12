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

### **Step 5: Verify Successful Epic-Story Import**

After import, you should see **automatic Epic → Story hierarchy**:

#### **Expected Results**:

- **7 Epics** created with proper names
- **40 Stories** automatically linked to parent Epics via Epic Link field
- **Immediate hierarchy** visible in Epic panels and boards
- **No manual linking required** - Epic Link creates relationships automatically

#### **Epic Structure Examples**:

```
🔐 Authentication & Security Foundation
├── 👤 User Registration & Login System
├── 🔑 Session Management & Token Handling
├── 🔒 Password Recovery & Account Management
├── 🛡️ Protected Routes & Authorization
└── 🔒 Supabase RLS Policies & Data Security

🎨 UI Foundation & Component Library
├── ⚙️ shadcn/ui Setup & Configuration
├── 📱 Dashboard Layout Components
├── 📊 Data Table Components
├── 📈 Chart & Visualization Components
├── 📝 Form & Input Components
└── 🎛️ Widget & Card Components
```

#### **Board Population**:

- **Epic Boards**: Show all 7 Epics with progress tracking
- **Story Boards**: Display Stories grouped by parent Epic
- **Kanban/Scrum Boards**: Include all issues with proper Epic organization
- **Epic Panels**: Stories automatically appear under parent Epics

### **Step 6: Troubleshooting Common Issues**

#### **Problem: Epic Link Field Not Available During Mapping**

**Solution**:

1. Verify you're using a **Software project** (not Business project)
2. Check **Project Settings → Issue Types → Story** has Epic Link field
3. Add Epic Link field to Story screens if missing

#### **Problem: Labels Not Mapping Automatically**

**Error**: Labels column appears unmapped in field selection

**Solution** (Classic Importer Specific):

1. **Manually select Labels field** from dropdown for Labels column
2. **Don't rely on auto-detection** - classic importer requires manual selection
3. Ensure labels are single words (epic, feature) without special characters

#### **Problem: Stories Import But No Epic Relationships**

**Solution**:

1. Verify **Epic Link** column maps to **Epic Link** field (not Parent or other field)
2. Check Epic names in CSV **exactly match** created Epic summaries
3. Ensure using **classic import experience** for Epic Link support

#### **Problem: Email Address User Creation Warnings**

**Example**: `Cannot create user developer1@company.com: Invalid email`

**Solution**: ✅ **These warnings are ACCEPTABLE**

- Issues will still be created and assigned properly
- Email users can be created manually later if needed
- Epic-Story relationships will work regardless of user warnings

#### **Problem: CSV Format Not Working With Classic Importer**

**Previous Issue**: CSV with Parent field, Issue IDs caused import failures

**Fixed Format**:

```csv
Issue Type,Summary,Epic Link,Priority,Assignee,Labels
Epic,Authentication & Security Foundation,,High,team.alpha@company.com,epic
Story,User Registration & Login System,Authentication & Security Foundation,Medium,developer1@company.com,feature
```

✅ **Solution Applied**: Simplified CSV format optimized for classic importer Epic Link functionality

## 🔧 **Key Differences from Previous Approach**

### **Before (Failed Import)**:

- Used Parent field with Issue IDs
- Complex Issue Key/Issue ID structure
- Status field complications
- Not optimized for classic importer

### **After (Working Import)**:

- Epic Link field with Epic name references
- Simplified 6-field structure
- Classic importer compatible
- Automatic Epic-Story relationships

## 🚀 **Ready for Development**

After successful import using this corrected method, your Jira project will have:

✅ **Automatic Epic → Story hierarchy** via Epic Link field  
✅ **7 Epics** with clear business value and team assignments  
✅ **40 Stories** properly linked to parent Epics  
✅ **Board-ready structure** with Epic panels and Story organization  
✅ **Sprint-ready backlog** with Epic-based planning  
✅ **Progress tracking** with Epic burndown and Story completion

**Next Step**: Use the corrected CSV format to re-import and get automatic Epic-Story relationships without any manual linking! 🎯
