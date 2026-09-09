import {
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
  writeBatch,
  query,
  orderBy
} from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";


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

const topicSubmitButton =
  topicForm.querySelector('button[type="submit"]');

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

        const heading =
          document.createElement("h3");

        heading.textContent =
          `${topic.order}. ${topic.title}`;

        const description =
          document.createElement("p");

        description.textContent =
          topic.description || "";

        const status =
          document.createElement("p");

        status.textContent =
          `סטטוס: ${topic.active ? "פעיל" : "לא פעיל"}`;

        item.append(
          heading,
          description,
          status
        );

        if (topic.requiresZoomAfter) {

          const zoomStatus =
            document.createElement("p");

          zoomStatus.textContent =
            "Zoom לאחר הנושא: כן";

          item.appendChild(zoomStatus);

        }

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

    topicSubmitButton.disabled =
      true;

    formMessage.textContent =
      "שומר...";

    try {

      const requestedOrder =
        Number(topicOrder.value);

      const topicsQuery =
        query(
          collection(db, "topics"),
          orderBy("order")
        );

      const snapshot =
        await getDocs(topicsQuery);

      if (
        !Number.isInteger(requestedOrder)
        || requestedOrder < 1
        || requestedOrder > snapshot.size + 1
      ) {

        formMessage.textContent =
          `יש להזין מספר בין 1 ל־${snapshot.size + 1}.`;

        return;

      }

      if (snapshot.size >= 499) {

        throw new Error(
          "Topic ordering exceeds the Firestore batch limit."
        );

      }

      const newTopicRef =
        doc(collection(db, "topics"));

      const newTopic = {

        title:
          topicTitle.value.trim(),

        description:
          topicDescription.value.trim(),

        order:
          requestedOrder,

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

      const orderedTopicRefs =
        snapshot.docs.map(
          (documentSnapshot) =>
            documentSnapshot.ref
        );

      orderedTopicRefs.splice(
        requestedOrder - 1,
        0,
        newTopicRef
      );

      const batch =
        writeBatch(db);

      orderedTopicRefs.forEach(
        (topicRef, index) => {

          if (topicRef.path === newTopicRef.path) {

            batch.set(
              topicRef,
              {
                ...newTopic,
                order: index + 1
              }
            );

            return;

          }

          batch.update(
            topicRef,
            {
              order: index + 1
            }
          );

        }
      );

      await batch.commit();

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

    finally {

      topicSubmitButton.disabled =
        false;

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
        ||
        userSnapshot.data().active
          === false
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
