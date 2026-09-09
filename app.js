import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  runTransaction
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";
import {
  EMPTY_PROGRESS,
  ONBOARDING_UNITS,
  normalizeProgress,
  summarizeProgress
} from "./progress-model.mjs";

const googleProvider = new GoogleAuthProvider();


// ---------------------------
// HTML Elements
// ---------------------------

const loginSection =
  document.getElementById("login-section");

const dashboardSection =
  document.getElementById("dashboard-section");

const loginButton =
  document.getElementById("google-login-btn");

const logoutButton =
  document.getElementById("logout-btn");

const userName =
  document.getElementById("user-name");

const userEmail =
  document.getElementById("user-email");

const userPhoto =
  document.getElementById("user-photo");

const userRole =
  document.getElementById("user-role");

const userMessage =
  document.getElementById("user-message");

const welcomeMessage =
  document.getElementById("welcome-message");

const topicsContainer =
  document.getElementById("topics-container");

const managerSection =
  document.getElementById("manager-section");

const openAdminButton =
  document.getElementById("open-admin-btn");

const continueButton =
  document.getElementById("continue-btn");

const continueMessage =
  document.getElementById("continue-message");

const overallProgressValue =
  document.getElementById("overall-progress-value");

const overallProgressBar =
  document.getElementById("overall-progress-bar");

const progressTrack =
  document.querySelector(".progress-track");

const progressDetails =
  document.getElementById("progress-details");

const currentUnitLabel =
  document.getElementById("current-unit-label");

let signedOutMessage = "";
let resumeTarget = null;


// ---------------------------
// Google Login
// ---------------------------

loginButton.addEventListener(
  "click",
  async () => {

    try {

      signedOutMessage = "";

      userMessage.textContent =
        "מתחבר...";

      await signInWithPopup(
        auth,
        googleProvider
      );

    }

    catch (error) {

      console.error(
        "Login error:",
        error
      );

      userMessage.textContent =
        "אירעה שגיאה בהתחברות.";

    }

  }
);


// ---------------------------
// Logout
// ---------------------------

logoutButton.addEventListener(
  "click",
  async () => {

    try {

      signedOutMessage = "";

      await signOut(auth);

    }

    catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }

  }
);


// ---------------------------
// Admin Button
// ---------------------------

openAdminButton.addEventListener(
  "click",
  () => {

    window.location.href =
      "admin.html";

  }
);

continueButton.addEventListener("click", () => {
  if (!resumeTarget) {
    return;
  }

  continueMessage.textContent =
    `היחידה הבאה שלך היא „${resumeTarget.title}”. אפשר יהיה לפתוח אותה במסך הלמידה ב־Phase 3.`;
});


// ---------------------------
// Create / Get User
// ---------------------------

async function getOrCreateUser(user) {

  const userRef =
    doc(
      db,
      "users",
      user.uid
    );

  const userSnapshot =
    await getDoc(userRef);


  if (userSnapshot.exists()) {

    return userSnapshot.data();

  }


  const newUser = {

    name:
      user.displayName || "",

    email:
      user.email || "",

    photoURL:
      user.photoURL || "",

    role:
      "instructor",

    active:
      true,

    createdAt:
      serverTimestamp()

  };


  await setDoc(
    userRef,
    newUser
  );


  return newUser;

}


// ---------------------------
// Persistent Progress
// ---------------------------

async function getOrCreateProgress(uid) {
  const progressRef = doc(db, "progress", uid);

  return runTransaction(db, async (transaction) => {
    const progressSnapshot = await transaction.get(progressRef);

    if (progressSnapshot.exists()) {
      return normalizeProgress(progressSnapshot.data());
    }

    const initialProgress = {
      ...EMPTY_PROGRESS,
      startedUnits: [],
      completedUnits: [],
      updatedAt: serverTimestamp()
    };

    transaction.set(progressRef, initialProgress);
    return normalizeProgress(initialProgress);
  });
}


// ---------------------------
// Render Instructor Journey
// ---------------------------

function renderDashboard(progress) {
  topicsContainer.replaceChildren();
  topicsContainer.setAttribute("aria-busy", "false");

  if (!ONBOARDING_UNITS.length) {
    topicsContainer.appendChild(
      createStatusMessage("מסלול ההכשרה עדיין בהכנה.", "empty")
    );
    return;
  }

  const summary = summarizeProgress(progress);
  resumeTarget = summary.targetUnit;

  overallProgressValue.textContent = `${summary.percentage}%`;
  overallProgressBar.style.width = `${summary.percentage}%`;
  progressTrack.setAttribute("aria-valuenow", String(summary.percentage));
  progressDetails.textContent = `${summary.completedCount} מתוך ${ONBOARDING_UNITS.length} יחידות הושלמו`;

  if (summary.isComplete) {
    currentUnitLabel.textContent = "כל הכבוד — השלמת את מסלול ההכשרה!";
    continueButton.textContent = "המסלול הושלם";
    continueButton.disabled = true;
  } else {
    const targetAction = resumeTarget.status === "inProgress" ? "ממשיכים" : "היחידה הבאה";
    currentUnitLabel.textContent = `${targetAction}: ${resumeTarget.title}`;
    continueButton.textContent = resumeTarget.status === "inProgress"
      ? "המשך מאיפה שעצרתי"
      : "מעבר ליחידה הבאה";
    continueButton.disabled = false;
  }

  summary.unitStates.forEach((unit) => {
    topicsContainer.appendChild(createUnitCard(unit));

    if (unit.checkpoint) {
      topicsContainer.appendChild(createCheckpoint(unit.checkpoint));
    }
  });
}

function createUnitCard(unit) {
  const statusLabels = {
    locked: "נעולה",
    available: "זמינה",
    inProgress: "בתהליך",
    completed: "הושלמה"
  };
  const actionLabels = {
    locked: "ייפתח לאחר השלמת היחידה הקודמת",
    available: "מוכנה להתחלה ב־Phase 3",
    inProgress: "אפשר יהיה להמשיך ב־Phase 3",
    completed: "היחידה הושלמה"
  };

  const card = document.createElement("article");
  card.classList.add("topic-card", `is-${unit.status}`);
  card.dataset.unitId = unit.id;

  const cardHeader = document.createElement("div");
  cardHeader.className = "topic-card-header";

  const number = document.createElement("span");
  number.className = "topic-number";
  number.textContent = `יחידה ${unit.order}`;

  const status = document.createElement("span");
  status.className = "topic-status";
  status.textContent = statusLabels[unit.status];
  cardHeader.append(number, status);

  const title = document.createElement("h3");
  title.textContent = unit.title;

  const description = document.createElement("p");
  description.className = "topic-description";
  description.textContent = unit.description;

  const action = document.createElement("button");
  action.type = "button";
  action.className = `topic-action ${unit.status === "locked" ? "locked-action" : ""}`;
  action.disabled = true;
  action.textContent = actionLabels[unit.status];

  card.append(cardHeader, title, description, action);
  return card;
}

function createCheckpoint(checkpoint) {
  const wrapper = document.createElement("aside");
  wrapper.className = `checkpoint ${checkpoint.optional ? "is-optional" : "is-required"}`;

  const marker = document.createElement("span");
  marker.className = "checkpoint-marker";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = "↓";

  const text = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = checkpoint.label;
  const detail = document.createElement("span");
  detail.textContent = checkpoint.optional ? "מידע בלבד · אופציונלי" : "מידע בלבד · נדרש במסלול";
  text.append(title, detail);

  wrapper.append(marker, text);
  return wrapper;
}

function createStatusMessage(message, state) {
  const wrapper = document.createElement("div");
  wrapper.className = `topics-state topics-state-${state}`;
  wrapper.setAttribute("role", state === "error" ? "alert" : "status");

  const text = document.createElement("p");
  text.textContent = message;
  wrapper.appendChild(text);

  return wrapper;
}

// ---------------------------
// Authentication State
// ---------------------------

onAuthStateChanged(
  auth,
  async (user) => {

    if (user) {

      try {

        const userData =
          await getOrCreateUser(
            user
          );

        if (userData.active === false) {

          signedOutMessage =
            "החשבון שלך אינו פעיל. אפשר לפנות לאחראית ההדרכה לקבלת עזרה.";

          await signOut(auth);

          return;

        }


        loginSection.classList.add(
          "hidden"
        );


        dashboardSection.classList.remove(
          "hidden"
        );


        userName.textContent =
          user.displayName ||
          "משתמש";


        userEmail.textContent =
          user.email ||
          "";


        welcomeMessage.textContent =
          `שלום ${user.displayName || ""}, כאן אפשר לעקוב אחר מסלול ההכשרה שלך.`;


        if (user.photoURL) {

          userPhoto.src =
            user.photoURL;


          userPhoto.style.display =
            "block";

        }

        else {

          userPhoto.style.display =
            "none";

        }


        if (
          userData.role ===
          "trainingManager"
        ) {

          userRole.textContent =
            "אחראית הדרכה";


          managerSection.classList.remove(
            "hidden"
          );

        }

        else {

          userRole.textContent =
            "מדריך/ה";


          managerSection.classList.add(
            "hidden"
          );

        }


        topicsContainer.replaceChildren(
          createStatusMessage("טוען את ההתקדמות שלך...", "loading")
        );
        topicsContainer.setAttribute("aria-busy", "true");

        if (userData.role === "instructor") {
          try {
            const progress = await getOrCreateProgress(user.uid);
            renderDashboard(progress);
          } catch (progressError) {
            console.error("Error loading progress:", progressError);
            topicsContainer.replaceChildren(
              createStatusMessage(
                "לא הצלחנו לטעון את ההתקדמות כרגע. כדאי לרענן את הדף ולנסות שוב.",
                "error"
              )
            );
            topicsContainer.setAttribute("aria-busy", "false");
            continueButton.disabled = true;
          }
        } else {
          renderDashboard(EMPTY_PROGRESS);
        }

      }

      catch (error) {

        console.error(
          "Error loading user:",
          error
        );


        userMessage.textContent =
          "הייתה בעיה בטעינת המשתמש.";

      }

    }

    else {

      loginSection.classList.remove(
        "hidden"
      );


      dashboardSection.classList.add(
        "hidden"
      );


      managerSection.classList.add(
        "hidden"
      );


      userMessage.textContent =
        signedOutMessage;

      signedOutMessage = "";

    }

  }
);
