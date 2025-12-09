## Known Unknown Matrix

		Known Knowns → clear, decided behaviour==
			- User can create teams
			- User can be members of many group
			- Team do not have rules
			    - Rationale
			        - Teams only give visibility
				        -Resources follow the owner's team
				        - Teams don’t own content
        - Editing requires [[claiming]]
        - Sensitivity([[Confidential projects]]) overrides teams
        - Collaborators override teams
- User can add and remove members or rename the team
- User may have zero or many teams.
- You can set a parent team(feature flag)
- Can a child team have multiple parents?
    - No, a child can only have one parent

#### ==Known Unknowns → we know the problem exists, but need decisions==

- Who can create a team?, Who can add/remove members to a team?, Who can delete a team?
    - Whoever has admin access
- Can a user leave a team by themselves?
    - No, users cannot change their own team or remove themselves from a team. This is only possible when they have admin access.
- What happens if a team is deleted?(Critical edge case)
    - TBD
- Who can set or change the parent team?
    - Only admin
- Max depth for nested hierarchy
    - No
- Should teams be unique by name?
    - Yes
- [[Team Overlap]] + Claim Conflict
	- We have to handle the Team conflict better

