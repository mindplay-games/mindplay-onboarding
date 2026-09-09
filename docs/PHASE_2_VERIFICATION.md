# Phase 2 — Instructor dashboard verification

Run these checks with an active instructor account after the Phase 1 Firebase
setup and security-rule deployment have been completed. Phase 2 does not change
Firestore rules or require a new Firebase deployment.

## Progress document

The dashboard uses exactly `progress/{uid}`, where `{uid}` is the authenticated
Firebase Auth UID. A transaction reads the document and creates it only when it
does not exist, using this initial shape:

```js
{
  currentUnitId: null,
  currentStepId: null,
  startedUnits: [],
  completedUnits: [],
  updatedAt: serverTimestamp()
}
```

For controlled testing, edit only the test instructor's document in the Firebase
Console. Unit IDs are listed in `progress-model.mjs`. Do not edit a real
instructor's progress.

## New instructor

- Delete the test instructor's progress document, then sign in.
- Confirm a single `progress/{uid}` document is created with the schema above.
- Confirm the dashboard shows `0%` and `0 מתוך 6 יחידות הושלמו`.
- Confirm Unit 1 is `available` and Units 2–6 are `locked`.
- Confirm the continue button identifies Unit 1 without navigating to a missing
  Phase 3 screen.

## In-progress instructor

- Set `startedUnits` to `["mindplay-introduction"]` and leave `completedUnits`
  empty.
- Refresh and confirm Unit 1 is `inProgress`.
- Confirm the continue button selects Unit 1 and explains that the learning page
  will become available in Phase 3.

## Completed unit

- Set both arrays to `["mindplay-introduction"]`.
- Refresh and confirm Unit 1 is `completed`, Unit 2 is `available`, and Units 3–6
  are `locked`.
- Confirm the dashboard shows `17%`, `1 מתוך 6`, and Unit 2 as the next unit.

## Returning instructor

- Record the progress document, refresh, and sign out and back in.
- Confirm the same document and dashboard state are restored.
- Confirm no duplicate document is created and the existing arrays are not
  overwritten.

## Fully completed instructor

- Populate `completedUnits` with all six IDs from `progress-model.mjs`.
- Refresh and confirm all units are `completed`, progress is `100%` and `6 מתוך
  6`, and the completed-onboarding message appears.
- Confirm the continue button is disabled and there is no resume target.

## Journey, states, and safety

- Confirm the dashboard always shows the six configured stages in their fixed
  order, regardless of documents in the legacy `topics` collection.
- Confirm required Zoom checkpoints appear after Units 2 and 4, and optional Zoom
  checkpoints appear after Units 5 and 6.
- Confirm a helpful loading state appears while progress is read and an error
  state appears if the progress read fails.
- At 750 px and below, confirm the header, welcome panel, cards and checkpoints
  use a single-column layout without horizontal scrolling.
- The fixed stage labels are rendered with DOM `textContent`. No legacy Firestore
  topic title, description, or Zoom HTML is rendered on this dashboard.

Zoom checkpoints remain informational. Phase 2 does not add scheduling,
WhatsApp workflows, unit learning screens, or migrate the legacy `topics`
collection; those concerns remain in their planned later phases.
