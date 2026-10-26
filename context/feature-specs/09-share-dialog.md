Add sharing to the workspace so project owners can invite collaborators by email.

## Share Dialog

Add a `Share` button to the editor navbar that opens the share dialog.

Owners can:

- invite collaborators by email
- view current collaborators
- remove collaborators
- copy the project link with temporary `Copied!` feedback

## People with Access

The "People with access" section (not "Collaborators") lists everyone who can open the
project, starting with the owner, followed by invited collaborators in invite order.

- The section heading is "People with access", not "Collaborators"
- The project owner always appears first in the list, labeled "Owner"
- Invited collaborators follow, each with a remove button (owners only)
- The GET /collaborators endpoint returns the owner as the first row
  (`isOwner: true`) followed by collaborator rows (`isOwner: false`)
- Owner rows never show a remove button

Collaborators can:

- view the collaborator list only
- not invite, remove, or manage access

## Clerk User Data

Collaborators are stored by email in the database.

Use Clerk Backend API to enrich collaborator emails with:

- display name
- avatar image

If a Clerk user is not found for an email, fall back to showing the email only.

## Implementation

Add the required API logic for:

- listing collaborators
- inviting collaborators
- removing collaborators

Enforce ownership server-side for invite and remove actions.

Do not add a local user table.

## Check When Done

- share dialog opens from the workspace
- owners can invite and remove collaborators
- collaborators see read-only access
- collaborator names/avatars load from Clerk when available
- `npm run build` passes
- owner appears at the top of "People with access" with an "Owner" label
- section heading reads "People with access", not "Collaborators"
