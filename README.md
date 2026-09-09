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

עדיין אין מסך למידה של יחידה/step, שמירת התקדמות, נעילת יחידות, שאלות או
סימולציות. כללי Firestore עבור המודל הקיים והמודל המתוכנן נמצאים בריפו, אך הם
מגינים על סביבת Firebase רק לאחר פריסה מפורשת.

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

## השלמת Phase 1 ב־Firebase

יש לבצע את הפעולות הבאות פעם אחת מתוך תיקיית הפרויקט:

1. מתקינים את Firebase CLI: `npm install -g firebase-tools`.
2. מתחברים לחשבון שמנהל את הפרויקט: `firebase login`.
3. פורסים את כללי האבטחה לפרויקט הנכון:
   `firebase deploy --only firestore:rules --project mindplay-onboarding`.
4. ב־Firebase Console פותחים **Authentication → Settings → Authorized
   domains** ומוודאים שקיימים `localhost` ו־`mindplay-games.github.io`.
5. יוצרים חשבון דרך מסך ההתחברות. לאחר מכן, רק מנהלת הפרויקט משנה ידנית את
   `users/{uid}.role` מ־`instructor` ל־`trainingManager` עבור אחראיות הדרכה.
6. מבצעים את רשימת הבדיקות הידניות שב־`docs/PHASE_1_VERIFICATION.md` לפני
   שמתחילים את Phase 2.

אין לשנות role מתוך קוד הדפדפן ואין לפרסם Rules ישירות ב־Console בלי לעדכן גם
את `firestore.rules` בריפו.
