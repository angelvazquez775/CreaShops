import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../../../firebase-config'
import { getDocs } from 'firebase/firestore'

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [editId, setEditId] = useState(null)
  const [idTienda, setIdTienda] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        fetchTiendaId(user.uid)
        fetchProductos(user.uid)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribeAuth()
  }, [])

  const fetchTiendaId = async (uid) => {
    const tiendaRef = collection(db, 'tiendas')
    const q = query(tiendaRef, where('userId', '==', uid))
    const querySnapshot = await getDocs(q)
    const tiendaData = querySnapshot.docs.map(doc => doc.data())
    if (tiendaData.length > 0) {
      setIdTienda(tiendaData[0].idTienda)
    }
  }

  const fetchProductos = (uid) => {
    setIsLoading(true)
    const productosRef = collection(db, 'productos')
    const q = query(productosRef, where('userId', '==', uid))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProductos(productosData)
      setIsLoading(false)
    })

    return unsubscribe
  }

  const handleAddProduct = async () => {
    if (!nombre || !categoria || !descripcion || !precio || !stock || !idTienda || !user) {
      alert('Todos los campos son obligatorios y debes estar logueado')
      return
    }

    setIsLoading(true)
    await addDoc(collection(db, 'productos'), {
      nombre,
      categoria,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      idTienda,
      userId: user.uid
    })
    resetForm()
    setIsLoading(false)
  }

  const handleEditProduct = (id) => {
    const productToEdit = productos.find(prod => prod.id === id)
    setNombre(productToEdit.nombre)
    setCategoria(productToEdit.categoria)
    setDescripcion(productToEdit.descripcion)
    setPrecio(productToEdit.precio)
    setStock(productToEdit.stock)
    setIdTienda(productToEdit.idTienda)
    setEditId(id)
  }

  const handleUpdateProduct = async () => {
    if (!nombre || !categoria || !descripcion || !precio || !stock || !idTienda || !user) {
      alert('Todos los campos son obligatorios y debes estar logueado')
      return
    }

    setIsLoading(true)
    const productRef = doc(db, 'productos', editId)
    await updateDoc(productRef, {
      nombre,
      categoria,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      idTienda
    })
    resetForm()
    setIsLoading(false)
  }

  const handleDeleteProduct = async (id) => {
    if (!user) {
      alert('Debes estar logueado para eliminar un producto')
      return
    }

    setIsLoading(true)
    const productRef = doc(db, 'productos', id)
    await deleteDoc(productRef)
    setIsLoading(false)
  }

  const resetForm = () => {
    setNombre('')
    setCategoria('')
    setDescripcion('')
    setPrecio('')
    setStock('')
    setEditId(null)
  }

  if (!user) {
    return <p className="text-center text-red-500">Por favor, inicia sesión para ver y agregar productos.</p>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 p-6 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{editId ? 'Editar Producto' : 'Añadir Producto'}</h2>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        ></textarea>
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        <button
          onClick={editId ? handleUpdateProduct : handleAddProduct}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : (editId ? 'Actualizar Producto' : 'Añadir Producto')}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Productos</h2>
        {isLoading ? (
          <div className="text-center">Cargando productos...</div>
        ) : (
          <ul>
            {productos.map((producto) => (
              <li key={producto.id} className="border p-4 mb-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold">{producto.nombre}</h3>
                <p><strong>Categoría:</strong> {producto.categoria}</p>
                <p><strong>Descripción:</strong> {producto.descripcion}</p>
                <p><strong>Precio:</strong> ${producto.precio}</p>
                <p><strong>Stock:</strong> {producto.stock}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEditProduct(producto.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(producto.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Productos
