# Multiple Ustads Implementation - Testing Checklist

## 🎯 **CRITICAL FUNCTIONALITY TESTS**

### **Phase 5: User Editing Interface** ✅ (Completed)

- [x] **view-registration page updated** - Users can edit ustads when marked for update
- [x] **UstadManager integrated** - Dynamic add/remove functionality for users
- [x] **Validation integrated** - Users see validation errors for ustad editing
- [x] **Visual indicators** - Shows when ustads need updating

### **Phase 4: Admin Interface** ✅ (Completed)

- [x] **RegistrationDetailModal updated** - Admin can view/edit ustads
- [x] **Admin validation** - Proper validation in admin interface
- [x] **Field display names** - Updated FIELD_DISPLAY_NAMES mapping
- [x] **Admin notes tracking** - Uses ustads in requested_updates

### **Remaining References Cleanup** ✅ (Completed)

- [x] **recent-registrations.tsx** - Updated to use formatUstadsDisplay()
- [x] **form-transformer.ts** - Removed old ustad needs_update fields
- [x] **No remaining ustad_name/ustad_email** - All references updated

---

## 🧪 **MANUAL TESTING STEPS**

### **1. Database Migration Testing**

```sql
-- Run in Supabase SQL Editor to verify migration worked:
SELECT form_token, ustads, ustad_name, ustad_email
FROM registrations
WHERE ustads != '[]'::jsonb
LIMIT 5;

-- Verify indexing:
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM registrations
WHERE ustads @> '[{"name": "test"}]';
```

### **2. Form Submission Testing**

- [ ] **New Registration Flow**
  - [ ] Visit `/register`
  - [ ] Add multiple ustads (test 1-5 ustads)
  - [ ] Verify validation (empty names, invalid emails, duplicates)
  - [ ] Submit form and verify data saves correctly
  - [ ] Check database to confirm JSONB structure

### **3. Admin Interface Testing**

- [ ] **Registrations Table**

  - [ ] Visit `/dashboard/registrations`
  - [ ] Verify ustads display with comma-separated names
  - [ ] Test hover tooltips show name:email pairs
  - [ ] Test search functionality with ustad names/emails
  - [ ] Test CSV export includes ustads properly

- [ ] **Registration Detail Modal**
  - [ ] Click "View Details" on any registration
  - [ ] Verify ustads display properly in view mode
  - [ ] Click edit on ustads section
  - [ ] Add/remove ustads and verify validation
  - [ ] Save changes and verify they persist

### **4. User Editing Interface Testing**

- [ ] **User View Registration**
  - [ ] Admin marks ustads for update in detail modal
  - [ ] User visits their registration via token
  - [ ] Verify ustads section shows "needs update" indicator
  - [ ] Test editing ustads (add/remove/modify)
  - [ ] Submit changes and verify they save

### **5. PDF Generation Testing**

- [ ] **PDF Download**
  - [ ] Download PDF from registrations table
  - [ ] Verify ustads show as "Ustad: Name (email)" format
  - [ ] Test with single ustad: "Ustad: John Singh (john@example.com)"
  - [ ] Test with multiple ustads: "Ustad: John Singh (john@example.com), Jane Kaur (jane@example.com)"
  - [ ] Test with no ustads: "Ustad: None"

### **6. Search & Export Testing**

- [ ] **Search Functionality**

  - [ ] Search for ustad names in registrations table
  - [ ] Search for ustad emails in registrations table
  - [ ] Verify search finds registrations with matching ustads

- [ ] **CSV Export**
  - [ ] Export registrations with ustads column selected
  - [ ] Verify ustads appear as "Name1 (email1), Name2 (email2)" format
  - [ ] Test export with various ustad configurations

---

## 🔧 **TECHNICAL VALIDATION**

### **Database Schema Verification**

```sql
-- Verify ustads column exists and is indexed:
\d+ registrations;

-- Check sample data structure:
SELECT jsonb_pretty(ustads) FROM registrations WHERE ustads != '[]'::jsonb LIMIT 1;

-- Verify ustads_needs_update field:
SELECT COUNT(*) FROM registrations WHERE ustads_needs_update = true;
```

### **Component Integration Check**

- [ ] **UstadManager Component**

  - [ ] Validates unique emails within registration
  - [ ] Enforces 5 ustad maximum
  - [ ] Requires both name and email
  - [ ] Shows proper validation errors
  - [ ] Add/remove buttons work correctly

- [ ] **Display Utilities**
  - [ ] formatUstadsDisplay() works in tables
  - [ ] formatUstadsTooltip() works in tooltips
  - [ ] formatUstadsForPDF() works in documents

---

## 🚨 **ROLLBACK PLAN** (if needed)

If issues are discovered:

1. **Database Rollback** (if data corruption occurs):

   ```sql
   -- Emergency rollback script
   BEGIN;

   -- Restore from ustads back to individual fields (if needed)
   UPDATE registrations
   SET
     ustad_name = CASE
       WHEN jsonb_array_length(ustads) > 0
       THEN ustads->0->>'name'
       ELSE NULL
     END,
     ustad_email = CASE
       WHEN jsonb_array_length(ustads) > 0
       THEN ustads->0->>'email'
       ELSE NULL
     END
   WHERE ustads IS NOT NULL;

   COMMIT;
   ```

2. **Code Rollback**: Revert file changes to previous ustad_name/ustad_email implementation

3. **Run second migration** only after confirming everything works:
   ```sql
   -- scripts/supabase/migrations/002_drop_old_ustad_columns.sql
   -- (Don't run until fully tested)
   ```

---

## ✅ **SUCCESS CRITERIA**

### **Must Pass:**

- [ ] New registrations save with ustads JSONB structure
- [ ] Admin can view/edit ustads in modal
- [ ] Users can edit ustads when marked for update
- [ ] Search finds registrations by ustad name/email
- [ ] PDF generation shows proper ustad format
- [ ] CSV export includes ustads properly
- [ ] No console errors in browser
- [ ] Database queries perform well

### **Should Pass:**

- [ ] Mobile responsiveness maintained
- [ ] All validation messages are user-friendly
- [ ] Tooltips work on all supported browsers
- [ ] Export handles edge cases (no ustads, many ustads)

### **Performance Check:**

- [ ] Registration table loads quickly with ustads
- [ ] Search performance acceptable with JSONB queries
- [ ] No memory leaks in ustad management component

---

## 📋 **DEPLOYMENT SEQUENCE**

When ready for production:

1. ✅ **Phase 1**: Run `001_add_ustads_jsonb.sql` migration
2. ✅ **Phase 2**: Deploy application code with ustads support
3. ⏳ **Phase 3**: Test thoroughly in production
4. 🔄 **Phase 4**: Run `002_drop_old_ustad_columns.sql` (after confirming stability)

---

**Status**: Implementation Complete - Ready for Testing
**Next Step**: Run manual tests above to verify functionality
