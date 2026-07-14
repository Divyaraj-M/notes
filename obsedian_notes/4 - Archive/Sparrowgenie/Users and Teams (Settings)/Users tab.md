---
related:
  - "[[Replace Email-Based User Display with Name and Team]]"
  - "[[Remove User from Workspace]]"
  - "[[Known Unknown Matrix]]"
  - "[[Email Integration_v1.2]]"
  - "[[Project admin settings]]"
  - "[[Functional Requirements]]"
  - "[[UAT vipin 2026-02-23]]"
  - "[[Sparrow Genie Notes]]"
  - "[[Teams check]]"
  - "[[Teams]]"
  - "[[@Nayan Jain]]"
  - "[[Company Info]]"
  - "[[Share assign and review flow]]"
  - "[[Roles and Permissions]]"
  - "[[Block Contact creation of Same Domain_v1]]"
---
#uat/vipin-jan29 

### Problem Statement 

- Admin (who ever has the permission of the Account Management -> Configure Users, Teams and Roles) cannot change the Names of the Users , this makes the users to the sanity over the product , with the auto populated names from the email 
### Objective

Allow authorized admins to edit user profile details directly from the Users & Teams section.
### Scope

#### Entry Point

- Users & Teams → User Profile View
- An **Edit (pencil) button** should be visible only to admins with the required permission.

#### Editable Fields

When Edit mode is enabled, the following fields can be updated:

- **Full Name** (Editable)
- **Email** (Read-only, greyed out)
- **Team**
    - List all available teams
    - Multi-select supported (user can belong to multiple teams)
- **Permission Set**
    
    - Show both default and custom permission sets
    - Single-select
- **Phone Number** (Editable)
- **User Created Date** (Read-only, greyed out)
### Actions

After editing, the admin should see:

- **Save** – persists the updated user details    
- **Cancel** – discards changes and exits Edit mode

## Permissions & Visibility Rules

- Edit button is shown **only** if:
    - Account Management → Configure Users, Teams and Roles permission is enabled
- All other users see the profile in read-only mode

## Success Criteria

- Admin can update user name, team(s), permission set, and phone number
- Email and created date remain non-editable
- Changes are saved correctly and reflected immediately
- No edit access without the required permission
## Out of Scope

- Editing email ID
- Editing user creation metadata
