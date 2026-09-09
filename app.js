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
  collection,
  getDocs,
  query,
  where,
  orderBy
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

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

let signedOutMessage = "";


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
// Load Topics
// ---------------------------

async function loadTopics() {

  topicsContainer.innerHTML =
    "<p>טוען נושאים...</p>";


  try {

    const topicsQuery =
      query(

        collection(
          db,
          "topics"
        ),

        where(
          "active",
          "==",
          true
        ),

        orderBy(
          "order"
        )

      );


    const snapshot =
      await getDocs(
        topicsQuery
      );


    topicsContainer.innerHTML =
      "";


    if (snapshot.empty) {

      topicsContainer.innerHTML =
        "<p>עדיין אין נושאים במסלול ההכשרה.</p>";

      return;

    }


    snapshot.forEach(
      (documentSnapshot) => {

        const topic =
          documentSnapshot.data();


        const card =
          document.createElement(
            "article"
          );


        card.classList.add(
          "topic-card"
        );


        card.innerHTML = `

          <div class="topic-number">
            נושא ${topic.order}
          </div>

          <h3>
            ${topic.title}
          </h3>

          <p class="topic-description">
            ${topic.description || ""}
          </p>

          ${
            topic.requiresZoomAfter

              ? `
                <div class="zoom-notice">
                  ${topic.zoomMessage || ""}
                </div>
              `

              : ""
          }

        `;


        topicsContainer.appendChild(
          card
        );

      }
    );

  }

  catch (error) {

    console.error(
      "Error loading topics:",
      error
    );


    topicsContainer.innerHTML =
      "<p>אירעה שגיאה בטעינת נושאי ההכשרה.</p>";

  }

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


        await loadTopics();

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
