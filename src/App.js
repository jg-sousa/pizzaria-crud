import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FazerPedido from "./components/FazerPedido";
import ListaProdutos from "./components/ListaProdutos";
import ListaPedidos from "./components/ListaPedidos";
import AdicionarCliente from "./components/AdicionarCliente"; // Supondo que você já tenha esse componente
import AdicionarProduto from "./components/AdicionarProduto"; // Supondo que você já tenha esse componente

function App() {
  return (
    <Router>
      <div>
        {/* Navegação */}
        <nav>
          <ul>
            <li><Link to="/">Fazer Pedido</Link></li>
            <li><Link to="/produtos">Lista de Produtos</Link></li>
            <li><Link to="/pedidos">Lista de Pedidos</Link></li>
            <li><Link to="/adicionar-cliente">Adicionar Cliente</Link></li>
            <li><Link to="/adicionar-produto">Adicionar Produto</Link></li>
          </ul>
        </nav>

        {/* Definindo as rotas */}
        <Routes>
          <Route path="/" element={<FazerPedido />} />
          <Route path="/produtos" element={<ListaProdutos />} />
          <Route path="/pedidos" element={<ListaPedidos />} />
          <Route path="/adicionar-cliente" element={<AdicionarCliente />} />
          <Route path="/adicionar-produto" element={<AdicionarProduto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
