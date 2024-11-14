import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Nav/Home';
import Tienda from './components/Nav/Tienda';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/tienda/:idTienda" element={<Tienda />} />
            </Routes>
        </Router>
    );
}

export default App;
