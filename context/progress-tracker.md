# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 04: Project Dialogs & Editor Home

## Current Goal

- Build the /editor home screen, project dialogs, and sidebar project actions with mock data.

## Completed

- 01-design-system: shadcn/ui installed and configured (Tailwind v4, Next.js 16); Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea added to components/ui/; lucide-react installed; lib/utils.ts with cn() helper created; globals.css updated with full dark-only theme variables and Tailwind token mappings.
- 02-editor-chrome: EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose icons, dark background, bottom border) and ProjectSidebar (floating overlay, slides in from left, Projects title + close button, My Projects/Shared tabs with empty states, New Project button) created in components/editor/. Dialog pattern ready via existing shadcn Dialog component and color tokens in globals.css.
- 03-auth: Clerk wired into Next.js 16. proxy.ts at root with clerkMiddleware and matcher. ClerkProvider in root layout with dark theme from @clerk/ui/themes and CSS variable overrides. Sign-in (/sign-in/[[...sign-in]]) and sign-up (/sign-up/[[...sign-up]]) pages with two-panel layout (left: logo + tagline + feature list, right: Clerk form; mobile: form only). / redirects authenticated users to /editor, unauthenticated to /sign-in. app/editor/page.tsx protected with auth.protect(). EditorNavbar right section has UserButton. @clerk/ui installed.
- 04-project-dialogs: Editor home screen (heading + description + New Project button). Create/Rename/Delete project dialogs with form state and slug preview. Shared slug converter used for preview and stored project slugs; create and rename reject empty slugs with inline validation feedback. Sidebar project list with per-item rename/delete actions (owned projects only), mobile backdrop scrim. useProjectDialogs hook manages all dialog/form/loading state with mock data. No API calls.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
