// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Navbar';
import Home from './components/Home'; // Importando o componente Home
import ListaClientes from './components/ListaClientes';
import ListaProdutos from './components/ListaProdutos';
import ListaPedidos from './components/ListaPedidos';
import FazerPedido from './components/FazerPedido';

function App() {
  return (
    <Router>
      <Nav />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Página inicial */}
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/produtos" element={<ListaProdutos />} />
          <Route path="/pedidos" element={<ListaPedidos />} />
          <Route path="/fazer-pedido" element={<FazerPedido />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
