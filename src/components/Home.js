import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Bem-vindo à Pizzaria</h1>
      <p>Gerencie seus clientes e produtos aqui.</p>
      <div className="home-buttons">
        <Link to="/adicionar-cliente">
          <button className="btn">Adicionar Cliente</button>
        </Link>
        <Link to="/adicionar-produto">
          <button className="btn">Adicionar Produto</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
