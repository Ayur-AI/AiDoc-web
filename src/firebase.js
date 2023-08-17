import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
const config = {
  apiKey: "AIzaSyC6-sGYayi-zSD8blLn0qo_aGKWsxBFvLQ",
  authDomain: "ayurhitam-402d8.firebaseapp.com",
  databaseURL: "https://ayurhitam-402d8-default-rtdb.firebaseio.com",
  projectId: "ayurhitam-402d8",
  storageBucket: "ayurhitam-402d8.appspot.com",
  messagingSenderId: "173448127890",
  appId: "1:173448127890:web:4088a3765955a7d9d84d4b",
  measurementId: "G-EH8GZZ5JNR"
};

const app = initializeApp(config);



export const auth = getAuth(app);
export const db=getDatabase(app)
export default app;