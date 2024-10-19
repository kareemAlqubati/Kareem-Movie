import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDV7Dm52PFFV4AI3bVkBTkHnzU7pbnw46M",
  authDomain: "movie-web-25c61.firebaseapp.com",
  projectId: "movie-web-25c61",
  storageBucket: "movie-web-25c61.appspot.com",
  messagingSenderId: "287012084090",
  appId: "1:287012084090:web:08f08aa436c69eca30dec3",
  measurementId: "G-X1G0HLLML9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
