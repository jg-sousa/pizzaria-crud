import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AdicionarCliente from './components/AdicionarCliente';
import AdicionarProduto from './components/AdicionarProduto';
import ListaClientes from './components/ListaClientes';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adicionar-cliente" element={<AdicionarCliente />} />
        <Route path="/adicionar-produto" element={<AdicionarProduto />} />
        <Route path="/lista-clientes" element={<ListaClientes />} />
      </Routes>
    </Router>
  );
}

export default App;
