export const ONBOARDING_UNITS = Object.freeze([
  {
    id: "mindplay-introduction",
    order: 1,
    title: "ידע כללי על MindPlay — מבוא",
    description: "היכרות עם MindPlay, החוגים, קהל היעד והעקרונות שמובילים את ההדרכה."
  },
  {
    id: "technical-preparation",
    order: 2,
    title: "הכנה טכנית",
    description: "המערכות, הציוד, חומרי השיעור והפעולות שחשוב להכיר לפני שמתחילים.",
    checkpoint: { optional: false, label: "נקודת Zoom עם אחראית ההדרכה" }
  },
  {
    id: "lesson-plan",
    order: 3,
    title: "לימוד מערך שיעור",
    description: "איך קוראים מערך, מתכוננים לזמנים ומזהים את התרגילים והקישורים החשובים."
  },
  {
    id: "first-trial-lesson",
    order: 4,
    title: "הכנה לשיעור ניסיון ראשון",
    description: "פתיחה בטוחה, יצירת אווירה, ניהול זמן, סיום השיעור ודיווח.",
    checkpoint: { optional: false, label: "נקודת Zoom עם אחראית ההדרכה" }
  },
  {
    id: "substitute-lesson",
    order: 5,
    title: "שיעור החלפה",
    description: "איסוף המידע, מציאת המערך והשתלבות נכונה בקבוצה לא מוכרת.",
    checkpoint: { optional: true, label: "נקודת Zoom אופציונלית" }
  },
  {
    id: "one-on-one-makeup",
    order: 6,
    title: "השלמה אחד על אחד",
    description: "תיאום ההשלמה, איתור החומר החסר והחזרת התלמיד או התלמידה לקצב.",
    checkpoint: { optional: true, label: "נקודת Zoom אופציונלית" }
  }
]);

export const EMPTY_PROGRESS = Object.freeze({
  currentUnitId: null,
  currentStepId: null,
  startedUnits: [],
  completedUnits: []
});

function validUnitIds(units) {
  return new Set(units.map((unit) => unit.id));
}

function normalizedIds(value, allowedIds) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((id) => allowedIds.has(id)))];
}

export function normalizeProgress(progress = {}, units = ONBOARDING_UNITS) {
  const allowedIds = validUnitIds(units);

  return {
    currentUnitId: allowedIds.has(progress.currentUnitId) ? progress.currentUnitId : null,
    currentStepId: progress.currentStepId ?? null,
    startedUnits: normalizedIds(progress.startedUnits, allowedIds),
    completedUnits: normalizedIds(progress.completedUnits, allowedIds)
  };
}

export function calculateUnitStatuses(progress, units = ONBOARDING_UNITS) {
  const normalized = normalizeProgress(progress, units);
  const started = new Set(normalized.startedUnits);
  const completed = new Set(normalized.completedUnits);

  return units.map((unit, index) => {
    let status = "locked";

    if (completed.has(unit.id)) {
      status = "completed";
    } else if (started.has(unit.id)) {
      status = "inProgress";
    } else if (units.slice(0, index).every((previous) => completed.has(previous.id))) {
      status = "available";
    }

    return { ...unit, status };
  });
}

export function summarizeProgress(progress, units = ONBOARDING_UNITS) {
  const unitStates = calculateUnitStatuses(progress, units);
  const completedCount = unitStates.filter((unit) => unit.status === "completed").length;
  const targetUnit = unitStates.find((unit) => unit.status === "inProgress")
    || unitStates.find((unit) => unit.status === "available")
    || null;

  return {
    unitStates,
    completedCount,
    percentage: units.length ? Math.round((completedCount / units.length) * 100) : 0,
    targetUnit,
    isComplete: units.length > 0 && completedCount === units.length
  };
}
