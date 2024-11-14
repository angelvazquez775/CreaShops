import Nav from './Nav.jsx'
import LoginModal from './LoginModal.jsx'
import SubNav from './SubNav.jsx'
import Editar from './Editar.jsx'
import { useState } from "react"
import Productos from './Productos.jsx'
import Ventas from './Ventas.jsx'
import Cuenta from './Cuenta.jsx'

function Home () {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [onSubNav, setOnSubNav] = useState(false)
    const [isLogIn, setIsLogIn] = useState(false)
    const [editar, setEditar] = useState(false)
    const [producto, setProducto] = useState(false)
    const [ventas, setVentas] = useState(false)
    const [cuenta, setCuenta] = useState(false)
    return( 
        <>
            <Nav 
                onLoginClick={() => setIsModalOpen(true)} 
                isLogIn = {isLogIn}
            />
            {onSubNav === true && <SubNav 
                setEditar = {setEditar}
                setProducto = {setProducto}
                setVentas = {setVentas}
                setCuenta = {setCuenta}
            />}
            <LoginModal 
                isOpen={isModalOpen} 
                setOnSubNav = {setOnSubNav}
                setIsLogIn = {setIsLogIn}
                onClose={() => setIsModalOpen(false)} 
            />
            {editar === true && <Editar 
                editar={editar}
            />}
            {producto === true && <Productos></Productos>}
            {ventas === true && <Ventas></Ventas>}
            {cuenta === true && <Cuenta></Cuenta>}
        </>
    )
}

export default Home
