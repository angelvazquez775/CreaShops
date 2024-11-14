import { useState, useEffect } from "react"
import { collection, query, getDocs, where, doc, updateDoc, addDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"
import { useParams } from "react-router-dom"

function Tienda() {
  const { idTienda } = useParams()
  const [tiendaData, setTiendaData] = useState(null)
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCarrito, setShowCarrito] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState({})
  const [isFinalizingPurchase, setIsFinalizingPurchase] = useState(false)

  useEffect(() => {
    if (!idTienda) {
      setError("El idTienda no está disponible.")
      setLoading(false)
      return
    }

    const fetchTiendaData = async () => {
      try {
        const tiendaQuery = query(collection(db, "tiendas"), where("idTienda", "==", idTienda))
        const tiendaSnapshot = await getDocs(tiendaQuery)

        if (!tiendaSnapshot.empty) {
          const tiendaDoc = tiendaSnapshot.docs[0]
          setTiendaData(tiendaDoc.data())
        } else {
          setError("No se encontró la tienda")
          setLoading(false)
          return
        }

        const productosQuery = query(collection(db, "productos"), where("idTienda", "==", idTienda))
        const productosSnapshot = await getDocs(productosQuery)
        const productosData = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setProductos(productosData)
      } catch (error) {
        setError("Error al cargar los datos de la tienda")
        console.error("Error al cargar los datos de la tienda: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTiendaData()
  }, [idTienda])

  const getColorForTema = (tema) => {
    const temaColores = {
      tema1: "bg-blue-500",
      tema2: "bg-green-500",
      tema3: "bg-red-500"
    }
    return temaColores[tema] || "bg-gray-500"
  }

  const handleAddToCart = (producto) => {
    setIsAddingToCart((prev) => ({ ...prev, [producto.id]: true }))
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item.id === producto.id)
      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }]
      }
    })
    setTimeout(() => setIsAddingToCart((prev) => ({ ...prev, [producto.id]: false })), 1000)
  }

  const handleRemoveFromCart = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== id))
  }

  const handleFinalizarCompra = async () => {
    setIsFinalizingPurchase(true)
    try {
      for (const item of carrito) {
        const productRef = doc(db, "productos", item.id)
        const newStock = item.stock - item.cantidad
        if (newStock >= 0) {
          await updateDoc(productRef, { stock: newStock })
          await addDoc(collection(db, "compras"), {
            idTienda,
            idProducto: item.id,
            nombreProducto: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            fecha: new Date()
          })
        } else {
          alert(`No hay suficiente stock para el producto: ${item.nombre}`)
          setIsFinalizingPurchase(false)
          return
        }
      }
      setCarrito([])
      const productosQuery = query(collection(db, "productos"), where("idTienda", "==", idTienda))
      const productosSnapshot = await getDocs(productosQuery)
      const productosData = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setProductos(productosData)
      alert("Compra finalizada con éxito")
    } catch (error) {
      console.error("Error al finalizar la compra:", error)
    } finally {
      setIsFinalizingPurchase(false)
    }
  }

  if (error) {
    return <div>{error}</div>
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <nav className={`${getColorForTema(tiendaData?.temaSeleccionado)} p-4 flex justify-between items-center`}>
        <h1 className="text-white text-2xl font-semibold">{tiendaData?.nombreTienda || 'Tienda sin nombre'}</h1>
        <button
          onClick={() => setShowCarrito(!showCarrito)}
          className="text-white text-xl bg-gray-800 p-2 rounded-lg"
        >
          Carrito ({carrito.length})
        </button>
      </nav>

      {showCarrito && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-96 h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold">Carrito</h2>
            {carrito.length === 0 ? (
              <div className="text-center">
                <p>No hay productos en el carrito.</p>
                <button
                  onClick={() => setShowCarrito(false)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <ul>
                  {carrito.map((producto) => (
                    <li key={producto.id} className="flex justify-between items-center py-2">
                      <span>{producto.nombre}</span>
                      <span>{producto.cantidad} x ${producto.precio}</span>
                      <button
                        onClick={() => handleRemoveFromCart(producto.id)}
                        className="text-red-500"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleFinalizarCompra}
                  disabled={isFinalizingPurchase}
                  className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isFinalizingPurchase ? "Finalizando..." : "Finalizar Compra"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-6">Productos</h2>
        {productos.length === 0 ? (
          <div className="text-center text-xl font-semibold">
            No hay productos disponibles en esta tienda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between"
              >
                <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                <p className="text-gray-600">Precio: ${producto.precio}</p>
                <p className="text-gray-600">Stock: {producto.stock}</p>
                <p className="text-gray-600">{producto.descripcion}</p>
                <button
                  onClick={() => handleAddToCart(producto)}
                  disabled={isAddingToCart[producto.id]}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  {isAddingToCart[producto.id] ? "Añadiendo..." : "Añadir al Carrito"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tienda
