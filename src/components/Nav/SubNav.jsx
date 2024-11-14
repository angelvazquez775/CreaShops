import { FacebookAuthProvider } from "firebase/auth/web-extension"

function SubNav ({setEditar, setProducto, setVentas, setCuenta}) {

    const handleEditar = () => {
        setProducto(false)
        setVentas(false)
        setCuenta(false)
        setEditar(true)
    }
    const handleProducto = () => {
        setEditar(false)
        setVentas(false)
        setCuenta(false)
        setProducto(true)
    }
    const handleVentas = () => {
        setEditar(false)
        setProducto(false)
        setCuenta(false)
        setVentas(true)
    }
    const handleCuentas = () => {
        setEditar(false)
        setProducto(false)
        setVentas(false)
        setCuenta(true)
        
    }

    return(
        <>
            <nav className="bg-blue-950 shadow-md">
                <ul className="flex justify-center space-x-16 p-4">
                    <li className="group relative">
                        <a href="#" onClick={() => handleEditar()} className="text-white hover:text-yellow-300 font-medium">
                            EDITAR
                        </a>
                        <span className="absolute left-0 right-0 bottom-0 mt-1 h-1 bg-yellow-300 rounded scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </li>
                    <li className="group relative">
                        <a href="#" onClick={() => handleProducto()} className="text-white hover:text-yellow-300 font-medium">
                            PRODUCTOS
                        </a>
                        <span className="absolute left-0 right-0 bottom-0 mt-1 h-1 bg-yellow-300 rounded scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </li>
                    <li className="group relative">
                        <a href="#" onClick={() => handleVentas()} className="text-white hover:text-yellow-300 font-medium">
                            VENTAS
                        </a>
                        <span className="absolute left-0 right-0 bottom-0 mt-1 h-1 bg-yellow-300 rounded scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </li>
                    <li className="group relative">
                        <a href="#" onClick={() => handleCuentas()} className="text-white hover:text-yellow-300 font-medium">
                            CUENTA
                        </a>
                        <span className="absolute left-0 right-0 bottom-0 mt-1 h-1 bg-yellow-300 rounded scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default SubNav