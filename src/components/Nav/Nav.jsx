import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import logo from "../../assets/crea-shops-logo.png"

function Nav({ onLoginClick, isLogIn }) {
    const [nombreUsuario, setNombreUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setNombreUsuario(user.displayName || user.email || "Usuario")
            } else {
                setNombreUsuario(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <div className="flex items-center justify-between p-4 px-8 bg-blue-800 shadow-md">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-14 w-50 mr-3" />
            </div>
            {!loading && ( 
                isLogIn === true ? (
                    <span className="text-white text-xl font-medium">
                        {nombreUsuario}
                    </span>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="px-4 py-2 text-white text-xl hover:text-yellow-300 font-medium"
                    >
                        INICIAR SESION
                    </button>
                )
            )}
        </div>
    )
}

export default Nav
