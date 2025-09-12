# Trading Dashboard - Two-Step Jira Import Process

## 🎯 **Two-Step Import Method (Works with Classic Importer)**

Due to Epic Link field limitations in the classic Jira CSV importer, we'll use a **two-step process**:

1. **Step 1**: Import all issues (Epics + Stories) without Epic Links
2. **Step 2**: Import Epic Link relationships using Issue Keys

This ensures all issues are created first, then relationships are established using the actual Jira-assigned Issue Keys.

## 📋 **Step 1: Import All Issues**

### **File**: `trading-dashboard-jira-import.csv`

**Format**:

```csv
Issue Type,Summary,Priority,Assignee,Labels
Epic,Authentication & Security Foundation,High,team.alpha@company.com,epic
Story,User Registration & Login System,Medium,developer1@company.com,feature
```

### **Import Process**:

1. **Navigate to Classic Import**:

   - Go to **Settings (cog icon) → System**
   - Navigate to **External system import**
   - Select **CSV**

2. **Upload File**:

   - Select `trading-dashboard-jira-import.csv`
   - Click **Next**

3. **Field Mapping**:

   ```
   CSV Column    → Jira Field
   ─────────────────────────
   Issue Type    → Issue Type ✅
   Summary       → Summary ✅
   Priority      → Priority ✅
   Assignee      → Assignee ✅
   Labels        → Labels ✅ (manually select)
   ```

4. **Complete Import**:
   - All 47 issues (7 Epics + 40 Stories) will be created
   - Note the Issue Key range (e.g., TD-1 through TD-47)

## 📋 **Step 2: Link Stories to Epics**

### **File**: `trading-dashboard-epic-links.csv`

**Format**:

```csv
Issue Key,Epic Link
TD-8,TD-1
TD-9,TD-1
```

### **Epic Link Mapping**:

**Epic 1 - Authentication & Security Foundation (TD-1)**:

- Stories: TD-8, TD-9, TD-10, TD-11, TD-12

**Epic 2 - UI Foundation & Component Library (TD-2)**:

- Stories: TD-13, TD-14, TD-15, TD-16, TD-17, TD-18

**Epic 3 - Trading Dashboard & Position Management (TD-3)**:

- Stories: TD-19, TD-20, TD-21, TD-22, TD-23, TD-24

**Epic 4 - Market Data Integration & Trading Signals (TD-4)**:

- Stories: TD-25, TD-26, TD-27, TD-28, TD-29, TD-30

**Epic 5 - Top Gainers & Market Analytics (TD-5)**:

- Stories: TD-31, TD-32, TD-33, TD-34, TD-35

**Epic 6 - Advanced Trading Statistics & Analytics (TD-6)**:

- Stories: TD-36, TD-37, TD-38, TD-39, TD-40, TD-41

**Epic 7 - Real-time Data Synchronization & Performance Optimization (TD-7)**:

- Stories: TD-42, TD-43, TD-44, TD-45, TD-46, TD-47

### **Import Process**:

1. **Verify Issue Keys**:

   - Check your Jira project to confirm Issue Key range
   - If keys are different (e.g., TRD-1 instead of TD-1), update the CSV accordingly

2. **Upload Epic Links File**:

   - Use same classic import process
   - Select `trading-dashboard-epic-links.csv`

3. **Field Mapping**:

   ```
   CSV Column    → Jira Field
   ─────────────────────────
   Issue Key     → Issue Key ✅
   Epic Link     → Epic Link ✅
   ```

4. **Complete Import**:
   - This will create all Epic → Story relationships
   - Stories will automatically appear under their parent Epics

## ✅ **Expected Final Result**

After both imports:

```
🔐 Authentication & Security Foundation (TD-1)
├── 👤 User Registration & Login System (TD-8)
├── 🔑 Session Management & Token Handling (TD-9)
├── 🔒 Password Recovery & Account Management (TD-10)
├── 🛡️ Protected Routes & Authorization (TD-11)
└── 🔒 Supabase RLS Policies & Data Security (TD-12)

🎨 UI Foundation & Component Library (TD-2)
├── ⚙️ shadcn/ui Setup & Configuration (TD-13)
├── 📱 Dashboard Layout Components (TD-14)
├── 📊 Data Table Components (TD-15)
├── 📈 Chart & Visualization Components (TD-16)
├── 📝 Form & Input Components (TD-17)
└── 🎛️ Widget & Card Components (TD-18)

[... and so on for all 7 Epics]
```

## 🔧 **Troubleshooting**

### **Problem: Different Issue Key Range**

If your project uses different keys (e.g., TRD-1 instead of TD-1):

1. **Update Epic Links CSV**:
   - Change all TD- references to your actual prefix
   - Maintain the number sequence (1-7 for Epics, 8-47 for Stories)

### **Problem: Epic Link Field Not Available**

**Solution**:

1. Verify you're using a **Software project** (not Business)
2. Check **Project Settings → Issue Types → Story** has Epic Link field
3. Add Epic Link field to Story screens if missing

### **Problem: Stories Don't Link After Step 2**

**Solution**:

1. Verify Issue Keys in Epic Links CSV match actual Jira Issue Keys
2. Confirm Epic Link field mapping in Step 2 import
3. Check that all referenced Epic keys exist (TD-1 through TD-7)

## 🚀 **Benefits of Two-Step Method**

✅ **Guaranteed Success**: Works with all Jira CSV importer limitations  
✅ **Proper Relationships**: Epic → Story links created correctly  
✅ **Easy Troubleshooting**: Can verify each step independently  
✅ **Flexible Keys**: Adapts to any Issue Key format your project uses  
✅ **Board Ready**: Final result shows proper Epic panels and Story grouping

This two-step approach eliminates all Epic Link import issues and ensures your project structure is created exactly as intended! 🎯
