import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AdicionarProduto.css';

const AdicionarProduto = () => {
  const [dadosProduto, setDadosProduto] = useState({
    nome: '',
    preco: '',
    categoria: '',
  });

  const handleChange = (e) => {
    setDadosProduto({ ...dadosProduto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'produtos'), dadosProduto); // Coleção 'produtos' no Firestore
      alert('Produto adicionado com sucesso!');
      setDadosProduto({
        nome: '',
        preco: '',
        categoria: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar produto: ', error);
    }
  };

  return (
    <div className="adicionar-produto-form">
      <h2>Adicionar Produto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={dadosProduto.nome}
          onChange={handleChange}
          placeholder="Nome do Produto"
          required
        />
        <input
          type="number"
          name="preco"
          value={dadosProduto.preco}
          onChange={handleChange}
          placeholder="Preço"
          required
        />
        <select
          name="categoria"
          value={dadosProduto.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Escolha a Categoria</option>
          <option value="Pizza">Pizza</option>
          <option value="Bebida">Bebida</option>
          <option value="Sobremesa">Sobremesa</option>
        </select>
        <button type="submit" className="btn">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default AdicionarProduto;
