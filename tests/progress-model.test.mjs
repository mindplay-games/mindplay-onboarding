import assert from "node:assert/strict";
import test from "node:test";

import {
  ONBOARDING_UNITS,
  calculateUnitStatuses,
  summarizeProgress
} from "../progress-model.mjs";

const ids = ONBOARDING_UNITS.map((unit) => unit.id);

test("a new instructor starts with only unit 1 available", () => {
  const summary = summarizeProgress({ startedUnits: [], completedUnits: [] });

  assert.equal(summary.percentage, 0);
  assert.equal(summary.completedCount, 0);
  assert.equal(summary.targetUnit.id, ids[0]);
  assert.deepEqual(summary.unitStates.map((unit) => unit.status), [
    "available", "locked", "locked", "locked", "locked", "locked"
  ]);
});

test("a started unit is in progress and selected as the resume target", () => {
  const summary = summarizeProgress({ startedUnits: [ids[0]], completedUnits: [] });

  assert.equal(summary.unitStates[0].status, "inProgress");
  assert.equal(summary.targetUnit.id, ids[0]);
});

test("completing unit 1 unlocks unit 2 and reports one sixth", () => {
  const summary = summarizeProgress({ startedUnits: [ids[0]], completedUnits: [ids[0]] });

  assert.equal(summary.completedCount, 1);
  assert.equal(summary.percentage, 17);
  assert.deepEqual(summary.unitStates.slice(0, 3).map((unit) => unit.status), [
    "completed", "available", "locked"
  ]);
  assert.equal(summary.targetUnit.id, ids[1]);
});

test("completed state wins over a stale started entry", () => {
  assert.equal(calculateUnitStatuses({
    startedUnits: [ids[0]],
    completedUnits: [ids[0]]
  })[0].status, "completed");
});

test("six completed units produce 100% and no resume target", () => {
  const summary = summarizeProgress({ startedUnits: ids, completedUnits: ids });

  assert.equal(summary.percentage, 100);
  assert.equal(summary.completedCount, 6);
  assert.equal(summary.isComplete, true);
  assert.equal(summary.targetUnit, null);
});

test("unknown and duplicate IDs do not inflate progress", () => {
  const summary = summarizeProgress({ completedUnits: [ids[0], ids[0], "legacy-topic"] });

  assert.equal(summary.completedCount, 1);
});
