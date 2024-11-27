// src/components/Nav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Nav = () => {
  return (
    <nav className="nav">
      <ul className="nav-links">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/clientes" className="nav-link">Clientes</Link></li>
        <li><Link to="/produtos" className="nav-link">Produtos</Link></li>
        <li><Link to="/pedidos" className="nav-link">Pedidos</Link></li>
        <li><Link to="/fazer-pedido" className="nav-link">Fazer Pedido</Link></li>
      </ul>
    </nav>
  );
}

export default Nav;
