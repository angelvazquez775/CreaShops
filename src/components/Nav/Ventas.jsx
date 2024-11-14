import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../../../firebase-config"

function Ventas() {
  const [ventas, setVentas] = useState([])
  const [totalProductosVendidos, setTotalProductosVendidos] = useState(0)
  const [totalRecaudado, setTotalRecaudado] = useState(0)
  const [idTienda, setIdTienda] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener ID de la tienda del usuario actual
        const tiendaRef = collection(db, "tiendas")
        const q = query(tiendaRef, where("userId", "==", user.uid))
        const querySnapshot = await getDocs(q)
        const tiendaData = querySnapshot.docs.map(doc => doc.data())

        if (tiendaData.length > 0) {
          setIdTienda(tiendaData[0].idTienda)

          // Escuchar los cambios en la colección de compras para la tienda específica
          const ventasCollection = collection(db, "compras")
          const ventasQuery = query(ventasCollection, where("idTienda", "==", tiendaData[0].idTienda))

          const unsubscribeVentas = onSnapshot(ventasQuery, (ventasSnapshot) => {
            const ventasData = ventasSnapshot.docs.map((doc) => doc.data())

            let totalProductos = 0
            let totalIngreso = 0

            ventasData.forEach((venta) => {
              totalProductos += venta.cantidad
              totalIngreso += venta.cantidad * venta.precio
            })

            setVentas(ventasData)
            setTotalProductosVendidos(totalProductos)
            setTotalRecaudado(totalIngreso)
            setIsLoading(false)
          })

          return () => unsubscribeVentas()
        } else {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    })
    return () => unsubscribeAuth()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de Ventas</h2>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-700">
              Total de Productos Vendidos:{" "}
              <span className="text-blue-600">{totalProductosVendidos}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700">
              Total Recaudado:{" "}
              <span className="text-green-600">${totalRecaudado.toFixed(2)}</span>
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Detalle de Ventas</h3>
          <ul className="space-y-4">
            {ventas.map((venta, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">Producto: {venta.nombreProducto}</p>
                  <p className="text-gray-600">Cantidad: {venta.cantidad}</p>
                </div>
                <p className="text-gray-800 font-semibold">
                  ${venta.precio.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Ventas
