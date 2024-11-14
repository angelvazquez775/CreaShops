import { useState } from 'react'
import { auth } from '../../../firebase-config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const LoginModal = ({ isOpen, onClose, setOnSubNav, setIsLogIn }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password)
            } else {
                await signInWithEmailAndPassword(auth, email, password)
                setOnSubNav(true)
                setIsLogIn(true)
            }

            setEmail('')
            setPassword('')
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl mb-4 text-center text-blue-800 font-medium">{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="border rounded w-full px-2 py-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="border rounded w-full px-2 py-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>
                </form>
                <p className="mt-4 text-sm">
                    {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                    <button
                        className="text-blue-500 ml-1"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </p>
                <button
                    className="mt-4 text-red-500"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default LoginModal
