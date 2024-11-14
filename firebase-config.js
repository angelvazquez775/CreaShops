// Importa las funciones necesarias de Firebase SDK
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Configuración de Firebase de tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyB1RdjEZz3TzVvyyV2Pvn8Py742xHwfxKI",
  authDomain: "creashop-bef59.firebaseapp.com",
  projectId: "creashop-bef59",
  storageBucket: "creashop-bef59.appspot.com",
  messagingSenderId: "584557792380",
  appId: "1:584557792380:web:cfbb2fc8ab1fd20b0d8df9",
  measurementId: "G-TE2F5FZNKQ"
}

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig)

// Inicializa los servicios de autenticación y Firestore
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app);

export { auth, db, storage }
