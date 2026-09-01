import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy
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


// ---------------------------
// Elements
// ---------------------------

const loadingSection =
  document.getElementById("loading-section");

const accessDeniedSection =
  document.getElementById("access-denied-section");

const adminSection =
  document.getElementById("admin-section");

const logoutButton =
  document.getElementById("logout-btn");

const backButton =
  document.getElementById("back-btn");

const deniedBackButton =
  document.getElementById("denied-back-btn");

const topicForm =
  document.getElementById("topic-form");

const topicTitle =
  document.getElementById("topic-title");

const topicDescription =
  document.getElementById("topic-description");

const topicOrder =
  document.getElementById("topic-order");

const topicActive =
  document.getElementById("topic-active");

const topicZoom =
  document.getElementById("topic-zoom");

const topicZoomMessage =
  document.getElementById("topic-zoom-message");

const zoomMessageGroup =
  document.getElementById("zoom-message-group");

const formMessage =
  document.getElementById("form-message");

const adminTopicsContainer =
  document.getElementById("admin-topics-container");


// ---------------------------
// Navigation
// ---------------------------

backButton.addEventListener(
  "click",
  () => {

    window.location.href =
      "index.html";

  }
);

deniedBackButton.addEventListener(
  "click",
  () => {

    window.location.href =
      "index.html";

  }
);


// ---------------------------
// Logout
// ---------------------------

logoutButton.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href =
      "index.html";

  }
);


// ---------------------------
// Zoom checkbox
// ---------------------------

topicZoom.addEventListener(
  "change",
  () => {

    if (topicZoom.checked) {

      zoomMessageGroup.classList.remove(
        "hidden"
      );

    }

    else {

      zoomMessageGroup.classList.add(
        "hidden"
      );

      topicZoomMessage.value =
        "";

    }

  }
);


// ---------------------------
// Load Topics
// ---------------------------

async function loadTopics() {

  adminTopicsContainer.innerHTML =
    "<p>טוען נושאים...</p>";

  try {

    const topicsQuery =
      query(
        collection(db, "topics"),
        orderBy("order")
      );

    const snapshot =
      await getDocs(topicsQuery);

    adminTopicsContainer.innerHTML =
      "";

    if (snapshot.empty) {

      adminTopicsContainer.innerHTML =
        "<p>עדיין אין נושאים.</p>";

      return;

    }

    snapshot.forEach(
      (documentSnapshot) => {

        const topic =
          documentSnapshot.data();

        const item =
          document.createElement("div");

        item.classList.add(
          "admin-topic-item"
        );

        item.innerHTML = `
          <h3>
            ${topic.order}. ${topic.title}
          </h3>

          <p>
            ${topic.description || ""}
          </p>

          <p>
            סטטוס:
            ${
              topic.active
                ? "פעיל"
                : "לא פעיל"
            }
          </p>

          ${
            topic.requiresZoomAfter
              ? `
                <p>
                  Zoom לאחר הנושא: כן
                </p>
              `
              : ""
          }
        `;

        adminTopicsContainer.appendChild(
          item
        );

      }
    );

  }

  catch (error) {

    console.error(
      "Error loading topics:",
      error
    );

    adminTopicsContainer.innerHTML =
      "<p>אירעה שגיאה בטעינת הנושאים.</p>";

  }

}


// ---------------------------
// Add Topic
// ---------------------------

topicForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    formMessage.textContent =
      "שומר...";

    try {

      const newTopic = {

        title:
          topicTitle.value.trim(),

        description:
          topicDescription.value.trim(),

        order:
          Number(topicOrder.value),

        active:
          topicActive.checked,

        requiresZoomAfter:
          topicZoom.checked,

        createdAt:
          serverTimestamp()

      };

      if (topicZoom.checked) {

        newTopic.zoomMessage =
          topicZoomMessage.value.trim();

      }

      await addDoc(
        collection(db, "topics"),
        newTopic
      );

      formMessage.textContent =
        "הנושא נוסף בהצלחה.";

      topicForm.reset();

      topicActive.checked =
        true;

      zoomMessageGroup.classList.add(
        "hidden"
      );

      await loadTopics();

    }

    catch (error) {

      console.error(
        "Error adding topic:",
        error
      );

      formMessage.textContent =
        "אירעה שגיאה בשמירת הנושא.";

    }

  }
);


// ---------------------------
// Authentication + Role Check
// ---------------------------

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "index.html";

      return;

    }

    try {

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );

      const userSnapshot =
        await getDoc(userRef);

      loadingSection.classList.add(
        "hidden"
      );

      if (
        !userSnapshot.exists()
        ||
        userSnapshot.data().role
          !== "trainingManager"
      ) {

        accessDeniedSection.classList.remove(
          "hidden"
        );

        return;

      }

      adminSection.classList.remove(
        "hidden"
      );

      await loadTopics();

    }

    catch (error) {

      console.error(
        "Admin authorization error:",
        error
      );

      loadingSection.innerHTML =
        "<p>אירעה שגיאה בבדיקת ההרשאות.</p>";

    }

  }
);
