import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDocs, collection, query, where, updateDoc, deleteDoc, setDoc } from "firebase/firestore"
import { db } from "../../../firebase-config.js"
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

function Editar() {
    const [nombreTienda, setNombreTienda] = useState("")
    const [temaSeleccionado, setTemaSeleccionado] = useState("tema1")
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [idTienda, setIdTienda] = useState("")
    const [tiendaCreada, setTiendaCreada] = useState(false)
    const [userTienda, setUserTienda] = useState("")  
    const [emailTienda, setEmailTienda] = useState("")  
    const [editando, setEditando] = useState(false) 
    const [productos, setProductos] = useState([])

    const navigate = useNavigate()

    const temasColores = {
        tema1: "bg-pink-200",
        tema2: "bg-blue-200",
        tema3: "bg-green-200"
    }

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
                setTiendaCreada(false)
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (currentUser) {
            fetchTiendas() 
        }
    }, [currentUser])
    useEffect(() => {
        if (idTienda) {
            fetchProductos()
        }
    }, [idTienda])



    const fetchProductos = async () => {
        if (!currentUser) return
        const productosRef = collection(db, "productos")
        const q = query(productosRef, where("tiendaId", "==", idTienda))
        const querySnapshot = await getDocs(q)
        const productosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setProductos(productosList)
    }

    const fetchTiendas = async () => {
        if (!currentUser) return

        setLoading(true)
        const tiendasRef = collection(db, "tiendas")
        const q = query(tiendasRef, where("userId", "==", currentUser.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const tiendaData = doc.data()
                setNombreTienda(tiendaData.nombreTienda)
                setTemaSeleccionado(tiendaData.temaSeleccionado)
                setIdTienda(tiendaData.idTienda)
                setUserTienda(tiendaData.userId)
                setEmailTienda(tiendaData.email)
            })
            setTiendaCreada(true)
        } else {
            setTiendaCreada(false)
        }
        setLoading(false)
    }

    const handleCrear = async () => {
        if (!currentUser) {
            alert("Debes iniciar sesión para crear la tienda")
            return
        }

        setLoading(true)
        const tiendaId = uuidv4()
        const tiendaRef = doc(db, "tiendas", tiendaId)

        await setDoc(tiendaRef, {
            nombreTienda,
            temaSeleccionado,
            temaColor: temasColores[temaSeleccionado],
            userId: currentUser.uid,
            email: currentUser.email,
            idTienda: tiendaId
        })

        alert("Tienda creada con éxito")
        setIdTienda(tiendaId)
        setUserTienda(currentUser.uid)
        setEmailTienda(currentUser.email)
        setTiendaCreada(true)
        setLoading(false)
    }

    const handleEditar = async () => {
        if (!currentUser || !idTienda) {
            alert("No se puede editar la tienda. Verifica si estás logueado y si existe una tienda.")
            return
        }

        setLoading(true)
        const tiendaRef = doc(db, "tiendas", idTienda)
        await updateDoc(tiendaRef, {
            nombreTienda,
            temaSeleccionado,
            temaColor: temasColores[temaSeleccionado]
        })

        alert("Datos de la tienda actualizados")
        setLoading(false)
        setEditando(false)
    }

    const handleEliminar = async () => {
        if (!currentUser || !idTienda) {
            alert("No se puede eliminar la tienda. Verifica si estás logueado y si existe una tienda.")
            return
        }

        const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta tienda?")
        if (confirmacion) {
            setLoading(true)
            const tiendaRef = doc(db, "tiendas", idTienda)
            await deleteDoc(tiendaRef)

            alert("Tienda eliminada con éxito")
            setTiendaCreada(false)
            setLoading(false)
        }
    }

    const handleVerPagina = () => {
        if (!idTienda) {
            alert("No se ha asignado un ID a la tienda.")
            return
        }
    
        const tiendaURL = `/tienda/${idTienda}`
        const nuevaVentana = window.open(tiendaURL, '_blank')
    
        if (nuevaVentana) {
            nuevaVentana.onload = () => {
                nuevaVentana.postMessage({ productos }, "*")
            }
        }
    }

    return (
        <div className="flex justify-center items-center p-6 mt-16">
            <div className="mt-6 bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full max-w-md">
                {!tiendaCreada ? (
                    <form className="flex flex-col gap-4 bg-white p-6 border border-gray-200 rounded-lg shadow-md w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="nombreTienda" className="text-gray-700 font-medium">Nombre de la Tienda</label>
                        <input type="text" name="nombreTienda" id="nombreTienda" value={nombreTienda} onChange={(e) => setNombreTienda(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

                        <label htmlFor="temas" className="text-gray-700 font-medium">Tema</label>
                        <select name="temas" id="temas" value={temaSeleccionado} onChange={(e) => setTemaSeleccionado(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="tema1">Tema 1 (Rosa pastel)</option>
                            <option value="tema2">Tema 2 (Azul pastel)</option>
                            <option value="tema3">Tema 3 (Verde pastel)</option>
                        </select>

                        <button type="button" onClick={handleCrear} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading}>
                            {loading ? 'Cargando...' : 'Crear Tienda'}
                        </button>
                    </form>
                ) : (
                    <form className="flex flex-col gap-4 bg-white p-6 border border-gray-200 rounded-lg shadow-md w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="nombreTienda" className="text-gray-700 font-medium">Nombre de la Tienda</label>
                        <input type="text" name="nombreTienda" id="nombreTienda" value={nombreTienda} onChange={(e) => setNombreTienda(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

                        <label htmlFor="temas" className="text-gray-700 font-medium">Tema</label>
                        <select name="temas" id="temas" value={temaSeleccionado} onChange={(e) => setTemaSeleccionado(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="tema1">Tema 1 (Azul pastel)</option>
                            <option value="tema2">Tema 2 (Verde pastel)</option>
                            <option value="tema3">Tema 3 (Rojo pastel)</option>
                        </select>

                        <div className="flex justify-between mt-4">
                            <button onClick={handleEditar} className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500" disabled={loading}>
                                {loading ? 'Cargando...' : 'Actualizar'}
                            </button>
                            <button onClick={handleEliminar} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500" disabled={loading}>
                                {loading ? 'Cargando...' : 'Eliminar'}
                            </button>
                        
                            <button onClick={handleVerPagina} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                                Ver Página
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Editar
