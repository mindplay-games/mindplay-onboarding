# מפרט מוצר — MindPlay Onboarding

מסמך זה הוא מקור האמת לפיתוח המערכת. מטרת המוצר היא ללוות מדריך חדש במסלול
עצמאי, מדורג ואינטראקטיבי עד למוכנות להעברת שיעור — לא להציג ספר נהלים ולא
לבנות LMS גנרי.

## עקרונות מוצר

- עברית ו־RTL, עיצוב מקצועי, ידידותי ורספונסיבי.
- micro-learning: רעיון אחד בכל step, תוכן קצר ומשוב מיידי.
- mastery ולא grading: ניסיונות חוזרים, ללא ציון סופי ב־MVP.
- התקדמות ברורה: מיקום נוכחי, מה הושלם, מה נעול ומה הצעד הבא.
- gamification עדין בלבד: progress, סימוני השלמה ו־milestones.
- כל החלטה נבחנת לפי השאלה: האם היא עוזרת למדריך חדש להבין מהר יותר איך לעבוד
  כמדריך ב־MindPlay?

## משתמשים והרשאות

### Instructor

מתחבר, לומד לפי הסדר, מבצע שאלות ומשימות, מקבל משוב, רואה התקדמות וממשיך
מהמקום האחרון. הוא קורא תוכן `published` בלבד וקורא/מעדכן רק את ההתקדמות שלו.

### Training Manager

לכל אחראיות ההדרכה אותה הרשאה מלאה. הן מנהלות יחידות, steps, שאלות,
סימולציות וסטטוס פרסום; צופות בכל המדריכים, ההתקדמות, הניסיונות והפעילות;
ומנהלות כמה מדריכים במקביל.

ערכי role היחידים ב־MVP הם `instructor` ו־`trainingManager` במסמך
`users/{uid}`. אין להסתמך על הסתרת כפתורים בצד הלקוח לצורך אבטחה.

## מסלול ההכשרה

1. **ידע כללי על MindPlay** — החברה, החוגים, קהל היעד, מבנה שיעור, ציפיות,
   התנהלות עם ילדים והורים ומבנה צוות ההדרכה.
2. **הכנה טכנית** — מערכות, Zoom, WhatsApp, חומרי שיעור, ציוד ופתרון תקלות.
   בסיום: checkpoint חובה, הודעה לטל בקבוצת WhatsApp וקביעת Zoom.
3. **לימוד מערך שיעור** — קריאת מערך אמיתי/מדומה, הכנות, זמנים, תרגילים,
   קישורים והערות. היחידה חייבת לכלול שאלות על המערך ולא רק הסבר טקסטואלי.
4. **הכנה לשיעור ניסיון ראשון** — פתיחה, הצגה עצמית, אווירה, פדגוגיה, ניהול
   זמן, סיום ודיווח. בסיום: checkpoint חובה נוסף מול טל.
5. **שיעור החלפה** — איסוף מידע, איתור המערך, כניסה לקבוצה לא מוכרת ודיווח.
   ניתן להציע Zoom אופציונלי.
6. **השלמה אחד על אחד** — תיאום, איתור החומר החסר, החזרה לקצב ודיווח. ניתן
   להציע Zoom אופציונלי.

ברירת המחדל היא פתיחה סדרתית של יחידות. בעתיד ניתן לאפשר לאחראית הדרכה לעקוף
את הנעילה עבור מסלול או מדריך מסוים.

## סוגי steps

`information`, `image`, `video`, `interactiveScreenshot`, `multipleChoice`,
`scenario`, `checklist`, `miniTask`, `reflection`, `zoomCheckpoint`.

לכל step יהיו לפחות `type`, `title`, `order`, `required` ותוכן המותאם לסוג.
ה־renderer של מסך הלמידה צריך לבחור רכיב לפי `type`, כדי לאפשר הוספת תוכן
בניהול בלי לשנות קוד לכל יחידה.

### Interactive Screenshot

הסימולציה מציגה תמונה והוראה, ועליה hotspots. המיקומים נשמרים באחוזים כדי
להישאר תקינים בגדלי מסך שונים:

```json
{
  "x": 72,
  "y": 88,
  "width": 10,
  "height": 8,
  "isCorrect": true,
  "feedback": "מעולה. זה הכפתור שבו משתמשים כדי לשתף מסך."
}
```

העורך העתידי יאפשר העלאת תמונה, גרירת מלבן, בחירת תשובה נכונה/לא נכונה והזנת
משוב. ניסיון שגוי נותן רמז חיובי ומאפשר לנסות שוב; הצלחה מאפשרת להמשיך.

### Zoom Checkpoint

checkpoint הוא step מפורש ולא שדה מיוחד על יחידה. ב־MVP כפתור
"סיימתי ושלחתי הודעה" משלים אותו; אין אינטגרציה אוטומטית ל־WhatsApp. יש לשמור
אם ה־checkpoint חובה או אופציונלי ואת הפעולה שהמדריך אישר.

## מסכים מרכזיים

### Dashboard למדריך

- ברכה: "ברוכה הבאה למסלול ההכשרה שלך ב־MindPlay".
- אחוז השלמה כולל וכפתור "המשך מאיפה שעצרתי".
- כרטיס לכל אחת משש היחידות: שם, תיאור, progress, status ו־CTA.
- מצבים עקביים: `locked`, `available`, `inProgress`, `completed`.

### מסך למידה

Header מצומצם, "יחידה X מתוך 6", progress של היחידה, step מרכזי יחיד וכפתורי
"חזרה"/"המשך". אין navigation ניהולי עמוס בזמן הלמידה.

### Training Manager

ניווט: Dashboard, Instructors, Units, Content, Simulations, Questions. טבלת
המדריכים כוללת שם, אימייל, יחידה נוכחית, progress, פעילות אחרונה וסטטוס. מסך
פרטים מציג השלמות, תשובות, ניסיונות, מיקום נוכחי וחותמות זמן.

## מבנה נתונים מכוון

המבנה החדש משתמש במונח `units`, ולא ב־`topics` הקיים:

```text
users/{uid}
units/{unitId}
units/{unitId}/steps/{stepId}
questions/{questionId}
simulations/{simulationId}
progress/{uid}
```

- `users`: `name`, `email`, `photoURL`, `role`, `active`, `createdAt`.
- `units`: `title`, `description`, `order`, `status`, `isRequired`,
  `unlockMode`, `createdAt`, `updatedAt`.
- `steps`: `type`, `title`, `content`, `order`, `required`, `status`, references
  רלוונטיים וחותמות זמן.
- `questions`: נוסח, תשובות, תשובה נכונה ומשובי הצלחה/ניסיון נוסף.
- `simulations`: כותרת, הוראה, `imageUrl` ומערך `hotspots` באחוזים.
- `progress`: `currentUnitId`, `currentStepId`, `completedUnitIds`,
  `completedStepIds`, תשובות, תוצאות סימולציה, checkpoint acknowledgements,
  `startedAt`, `updatedAt`.

סטטוס תוכן הוא אחד מ־`draft`, `published`, `archived`. timestamps ייכתבו באמצעות
`serverTimestamp()`.

### החלטת migration

כרגע הקוד קורא וכותב collection בשם `topics` עם השדות `active`,
`requiresZoomAfter` ו־`zoomMessage`. אין לבצע migration לפני Phase 3. בעת
מימוש Units + Steps יש לבצע migration קטן ומפורש אל `units`:

1. לגבות/לייצא את `topics`.
2. ליצור מסמכי `units` מקבילים; להמיר `active: true` ל־`status: published`
   ואת היתר ל־`draft`.
3. להפוך Zoom ל־step מסוג `zoomCheckpoint`, ולא להשאירו כשדה יחידה.
4. לעדכן את הקורא והעורך ל־`units`, לוודא נתונים ורק אז להפסיק להשתמש ב־topics.

כך נמנעת שמירת שני מודלים מקבילים לאורך זמן, בלי rewrite מוקדם.

## אבטחה

יש להוסיף לריפו ולפרוס Firestore Security Rules לפני שמרחיבים את הניהול:

- משתמש מחובר רשאי לקרוא את מסמך המשתמש שלו; manager רשאית לקרוא משתמשים.
- יצירת משתמש עצמית מוגבלת ל־role `instructor`; אסור למשתמש לקדם את עצמו.
- מדריך קורא רק תוכן `published`; manager קוראת וכותבת את כל התוכן.
- מדריך קורא וכותב רק `progress/{uid}` התואם ל־`request.auth.uid`.
- manager קוראת את כל ההתקדמות; רק שדות מערכת מאושרים ניתנים לכתיבה.
- הרשאת manager נבדקת מול `users/{request.auth.uid}.role`.

כל query בצד הלקוח חייב להתאים ל־Rules; Rules אינן filters. שינוי Rules או index
מחייב תיעוד של הפקודה/הפעולה המדויקת לפריסה.

## ביקורת הקוד הקיים

### מה כבר עובד

- Firebase מאותחל ו־Google popup מחובר למסך login.
- משתמש חדש נוצר כברירת מחדל כ־`instructor`.
- ה־dashboard מציג פרטי משתמש ותכני `topics` פעילים.
- קיים שער role למסך admin וטופס יצירת topic בסיסי.

### פערים וסיכונים שיש לטפל בהם בהדרגה

1. **אין Rules בריפו** — בדיקת role ב־JavaScript אינה מנגנון אבטחה.
2. **פער במודל** — `topics/active` אינו תואם ל־`units/status/steps` שבמוצר.
3. **אין progress** — לא ניתן להמשיך מהמקום האחרון או לנעול יחידות.
4. **יצירת משתמש בצד הלקוח** — Rules חייבות למנוע בחירת role ניהולי.
5. **HTML מנתוני Firestore** — שימוש ב־`innerHTML` עם כותרות ותיאורים עלול
   לאפשר הזרקת markup. יש לרנדר טקסט לא מהימן באמצעות `textContent`.
6. **קונפיגורציה כפולה** — Firebase config משוכפל ב־`app.js` וב־`admin.js`;
   כדאי לחלץ מודול משותף בשינוי קטן כאשר נוגעים באתחול הבא.
7. **אין states מלאים** — נדרשים loading, empty ו־error נגישים ועקביים וכן
   מניעת submit כפול.
8. **אין תשתית בדיקות או deployment מתועד** — יש להוסיף checks מינימליים לפני
   הרחבת הלוגיקה.

## סדר פיתוח מחייב

1. Authentication + roles, כולל Security Rules.
2. Instructor dashboard.
3. Units + Steps והמיגרציה מ־topics.
4. Progress tracking.
5. Training Manager dashboard.
6. Content editor.
7. Questions.
8. Interactive screenshot simulations.
9. Zoom checkpoints.
10. Polish, responsive ו־analytics.

בכל phase מבצעים שינוי קטן, בודקים שהמסלול הקיים עדיין עובד ומתעדים במפורש כל
פעולה ידנית הנדרשת ב־Firebase Console או GitHub.

## השלמות מומלצות ל־SPEC

הנקודות הבאות אינן משנות את הדרישות, אך כדאי להכריע בהן לפני המימוש הרלוונטי:

- הגדרת "תקוע" (למשל אין פעילות במשך מספר ימים) וה־timezone להצגת פעילות.
- מדיניות מחיקה: archive כברירת מחדל במקום מחיקה קשיחה של תוכן שכבר נלמד.
- נגישות: ניווט מקלדת, focus ברור, alt לתמונות ודרך חלופית נגישה לסימולציה.
- versioning לתוכן, כדי ששינוי יחידה שפורסמה לא ישבור progress קיים.
- מדיניות שמירת attempts ונתוני מדריכים, כולל זמן שמירה ומחיקה.
- התנהגות במקרה שתוכן השתנה או הוסר בזמן שמדריך נמצא באמצע יחידה.
- האם checkpoint חובה דורש רק אישור עצמי או בעתיד גם אישור manager.

פיצ'רים עתידיים כגון התראות, WhatsApp, תעודות, branching, אישורי manager ו־AI
יישמרו כהרחבות אפשריות; אין לממש אותם לפני השלמת מסלול ה־MVP.
