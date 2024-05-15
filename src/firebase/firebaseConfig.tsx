// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD3ulfAPHBGm6W0G9HBVL5zB9PMDpFwQPg",
  authDomain: "front-testtask.firebaseapp.com",
  databaseURL: "https://front-testtask-default-rtdb.firebaseio.com",
  projectId: "front-testtask",
  storageBucket: "front-testtask.appspot.com",
  messagingSenderId: "601521205513",
  appId: "1:601521205513:web:633e3cb321ab07793863d8",
  measurementId: "G-R3X7QRDG5Q",
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
