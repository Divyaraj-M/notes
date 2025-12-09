1. **Team Management**
	- Create team
		- User with permission can create a team
		- Required fields: Team name
		- Optional fields: Description
	- Rename a Team
		- Update team name
		- Should not break assignments or logs
	- Delete a Team
		- Must define behaviour if team has:
			- assignments
			- claims
			- parent/child relation
			- members
	- Add Member to Team
		- Add any user
		- User may already be in other teams (many-to-many)

Remove Member from Team

Removing a user must recalc:

claims

section visibility

resource visibility

1.6 Allow users to belong to 0+ teams

No restrictions.
