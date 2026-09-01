import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


// ---------------------------
// Firebase Configuration
// ---------------------------

const firebaseConfig = {

  apiKey: "AIzaSyCXPQR1s8Q2oz8YJClxFq7PDosx4RQYosE",

  authDomain: "mindplay-onboarding.firebaseapp.com",

  projectId: "mindplay-onboarding",

  storageBucket: "mindplay-onboarding.firebasestorage.app",

  messagingSenderId: "247923560281",

  appId: "1:247923560281:web:aa4f198aef93f15011c648",

  measurementId: "G-WK3N8F03D3"
};


// ---------------------------
// Initialize Firebase
// ---------------------------

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();


// ---------------------------
// HTML Elements
// ---------------------------

const loginButton =
  document.getElementById("google-login-btn");

const logoutButton =
  document.getElementById("logout-btn");

const loggedInArea =
  document.getElementById("logged-in-area");

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


// ---------------------------
// Google Login
// ---------------------------

loginButton.addEventListener("click", async () => {

  try {

    userMessage.textContent = "מתחבר...";

    await signInWithPopup(
      auth,
      googleProvider
    );

  }

  catch (error) {

    console.error(error);

    userMessage.textContent =
      "אירעה שגיאה בהתחברות.";

  }

});


// ---------------------------
// Logout
// ---------------------------

logoutButton.addEventListener("click", async () => {

  try {

    await signOut(auth);

  }

  catch (error) {

    console.error(error);

  }

});


// ---------------------------
// Create / Get Firestore User
// ---------------------------

async function getOrCreateUser(user) {

  const userRef =
    doc(db, "users", user.uid);

  const userSnapshot =
    await getDoc(userRef);


  // User already exists
  if (userSnapshot.exists()) {

    return userSnapshot.data();

  }


  // First login
  const newUser = {

    name: user.displayName || "",

    email: user.email || "",

    photoURL: user.photoURL || "",

    role: "instructor",

    active: true,

    createdAt: serverTimestamp()

  };


  await setDoc(
    userRef,
    newUser
  );


  return newUser;

}


// ---------------------------
// Authentication State
// ---------------------------

onAuthStateChanged(auth, async (user) => {

  if (user) {

    try {

      const userData =
        await getOrCreateUser(user);


      loginButton.classList.add("hidden");

      loggedInArea.classList.remove("hidden");


      userName.textContent =
        user.displayName || "משתמש";

      userEmail.textContent =
        user.email || "";


      if (user.photoURL) {

        userPhoto.src =
          user.photoURL;

        userPhoto.style.display =
          "inline-block";

      }

      else {

        userPhoto.style.display =
          "none";

      }


      if (userData.role === "trainingManager") {

        userRole.textContent =
          "אחראית הדרכה";

      }

      else {

        userRole.textContent =
          "מדריך/ה";

      }


      userMessage.textContent =
        "התחברת בהצלחה";

    }

    catch (error) {

      console.error(error);

      userMessage.textContent =
        "הייתה בעיה בטעינת המשתמש.";

    }

  }

  else {

    loginButton.classList.remove("hidden");

    loggedInArea.classList.add("hidden");

    userMessage.textContent = "";

  }

});
