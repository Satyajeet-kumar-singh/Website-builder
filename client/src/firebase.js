// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8KwbMN8C1vuRvGJpsiu2Dq3ontr3G87A",
  authDomain: "genwebai-35865.firebaseapp.com",
  projectId: "genwebai-35865",
  storageBucket: "genwebai-35865.firebasestorage.app",
  messagingSenderId: "73631382235",
  appId: "1:73631382235:web:f2df1229102dcf9396eafe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}