import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXPQR1s8Q2oz8YJClxFq7PDosx4RQYosE",
  authDomain: "mindplay-onboarding.firebaseapp.com",
  projectId: "mindplay-onboarding",
  storageBucket: "mindplay-onboarding.firebasestorage.app",
  messagingSenderId: "247923560281",
  appId: "1:247923560281:web:aa4f198aef93f15011c648",
  measurementId: "G-WK3N8F03D3"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
