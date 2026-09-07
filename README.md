# MindPlay Onboarding

מערכת אונבורדינג אינטראקטיבית למדריכים חדשים של MindPlay. הממשק נכתב בעברית,
ב־RTL, וב־HTML/CSS/JavaScript ללא framework. Firebase משמש ל־Authentication
ול־Firestore.

## מצב נוכחי

הגרסה הקיימת היא בסיס ל־Phase 1 ותחילת ממשק הניהול:

- התחברות Google ויצירת מסמך משתמש חדש בתפקיד `instructor`.
- הבחנה בין `instructor` לבין `trainingManager` לפי `users/{uid}.role`.
- הצגת נושאים פעילים מ־`topics` לפי הסדר.
- מסך ניהול מוגן ברמת הממשק, שמאפשר ליצור נושא ולסמן אם נדרש Zoom אחריו.

עדיין אין מסך למידה של יחידה/step, שמירת התקדמות, נעילת יחידות, שאלות,
סימולציות או Firestore Security Rules בריפו. לכן אין להתייחס לממשק הקיים כאל
מערכת הרשאות מלאה: בדיקת role בצד הלקוח היא UX בלבד, והאכיפה חייבת להתבצע גם
ב־Firestore Rules.

## מסמך המוצר

הדרישות הקנוניות, החלטות מבנה הנתונים, סדר הפיתוח והפערים שהתגלו בבדיקת הקוד
מתועדים ב־[`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md). לפני פיתוח feature חדש
יש לבדוק אותו מול המסמך ולעבוד ב־phase אחד בכל פעם.

## הרצה מקומית

הקבצים משתמשים ב־ES modules ולכן יש להגיש אותם דרך שרת HTTP ולא לפתוח את
`index.html` ישירות מהדיסק:

```bash
python3 -m http.server 8000
```

לאחר מכן פותחים `http://localhost:8000` בדפדפן. כדי ש־Google Sign-In יעבוד,
הדומיין המקומי צריך להיות מורשה ב־Firebase Authentication.
