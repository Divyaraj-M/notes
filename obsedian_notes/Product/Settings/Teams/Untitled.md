#new_feature/teams #discovery 

# Teams

TL;DR 
## Summary

Only the creator of a project determines its visibility. Unless you designate a project as sensitive, everyone on any team you are a part of can view it. You and the individuals you specifically add are the only ones with access to sensitive projects. Only the individual user, not their teams, has access to roles like manager or reviewer. Edit rights are never automatically granted to teams. In the future, if the product requires it, we might facilitate the assignment of sections to teams, the addition of team hierarchies, or the creation of distinct "visibility teams" and "working teams.




This document defines how teams influence visibility of resources in the system.  
Resources include projects, sections, questions, answers, and any future project or proposal-level entities.

The model follows a single-layer team structure:

- Users may belong to one or more teams.  
- Teams do not own projects but KH.  
- Visibility is driven entirely by the Project owner, not by participants or roles.  

The goal is to maintain predictable, simple visibility rules that avoid permission leaks while still allowing teams to understand the work their members are producing.

  

## 2. Approach

The system uses a user-centric visibility propagation model:

1. Resource visibility is determined by the OWNER, not the teams directly.  
2. The owner’s team memberships define who can view the resource.  
3. Participation roles (manager, author, reviewer, watcher) provide visibility only to the individual user, never to the user’s teams.  
4. A “Mark as Sensitive” toggle exists to override owner → team visibility and restrict access to only the owner and explicitly added collaborators.  
5. Since teams do not own resources, it keeps the permission model simple and avoids inheritance complexity.      
6. Team hierarchy and dual-layer team models remain future enhancements (if scaling or enterprise needs demand them).  

This approach keeps the system simple, predictable, and secure at early-stage adoption.=

  ---

| Requirement Name                   | Description / Behavior                                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Owner → Team Visibility            | If a project is NOT sensitive, all users in all teams the owner belongs to get view-only visibility. No edit rights.   |
| Role-based Access (No Propagation) | Adding a user as a manager/author/reviewer/watcher gives that user access. It does NOT grant access to their teams.    |
| Sensitive Project Toggle           | If Sensitive = ON, only owner + explicit collaborators can see the project. Owner’s teams cannot see.                  |
| Sensitive — Team Block             | Sensitive blocks visibility for ALL teams owner belongs to. No propagation.                                            |
| Sensitive — Role Access            | Collaborators retain their access (view/edit as per role) but their teams gain nothing.                                |
| Team Membership Changes            | If owner joins or leaves teams, visibility instantly updates: old teams lose, new teams gain (only for non-sensitive). |
| No Team-based Permissions          | Teams never gain edit/manage/delete rights. Teams only gain view visibility through ownership rule.                    |

  
---

## 4. Acceptance Criteria

- When Owner creates a project (non-sensitive), all members of all the owner’s teams can see it (view-only).
- Team members cannot edit unless explicitly added as roles.
- Adding a user as Manager/Author/Reviewer/Watcher does not grant visibility to their teams. Only the user sees it.
- When Sensitive = ON, owner’s teams lose all visibility to the project.
- Sensitive = ON → Only owner + collaborators can see the project.
- Collaborators’ teams do NOT get visibility even if collaborator has multiple teams.
- Sensitive = OFF → Visibility returns to normal owner → team rule.
- If owner changes team: new teams get access immediately; old teams lose access immediately (non-sensitive only).
- No tea ever receives edit/manage/delete rights without manual role assignment.

---

## 5. Future Scope

  

|                               |                                                                                                                    |                                                                                                    |          |                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| Feature                       | Description                                                                                                        | Why Needed                                                                                         | Priority | Notes                                                                                             |
| Assigning a section to a team | Allow a section to be assigned to a team so all team members get view/claim access for that specific section only. | Supports collaborative writing workflows at section level WITHOUT giving project-level visibility. | High     | Section assignments do not affect project visibility. Requires “team-view-only” at section level. |
| Nested Team Hierarchy         | Parent → child visibility for managers                                                                             | Enterprise org modeling                                                                            | Medium   | Complex; requires new rules                                                                       |
| Dual Layer System             | Primary vs addtional Teams                                                                                         | Cleaner visibility + scalable control                                                              | Medium   | Only if needed for enterprises                                                                    |

  

## 6. Summary

You now have a one-layer, owner-driven visibility model where:

- Ownership gives visibility to all teams the owner belongs to.  
- Roles give visibility only to the individual user.  
- Sensitivity overrides everything.  
- Teams never own resources.  
- Changes in team membership affect visibility instantly.  
- Hierarchy and dual-layer systems can be added later if scaling requires them.