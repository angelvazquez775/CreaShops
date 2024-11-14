import { useState, useEffect } from "react"
import { auth } from "../../../firebase-config"
import { onAuthStateChanged, signOut } from "firebase/auth"

const Cuenta = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada")
        setUser(null)
        window.location.reload()
      })
      .catch((error) => {
        console.error("Error al cerrar sesión", error)
      })
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      {user ? (
        <div>
          <p className="text-xl font-semibold text-gray-700">
            Bienvenido,{" "}
            <span className="text-blue-600">
              {user.displayName ? user.displayName : user.email}
            </span>
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No estás autenticado.</p>
        </div>
      )}
    </div>
  )
}

export default Cuenta
