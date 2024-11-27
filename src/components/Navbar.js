import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Pizzaria</Link>
      <div className="navbar-links">
        <Link to="/adicionar-cliente">Adicionar Cliente</Link>
        <Link to="/adicionar-produto">Adicionar Produto</Link>
      </div>
    </nav>
  );
};

export default Navbar;
