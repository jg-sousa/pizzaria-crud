import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AdicionarCliente.css';  // Estilo para AdicionarCliente

const AdicionarCliente = () => {
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    telefone: '',
  });

  const handleChange = (e) => {
    setDadosCliente({ ...dadosCliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'clientes'), dadosCliente); // Coleção 'clientes' no Firestore
      alert('Cliente adicionado com sucesso!');
      setDadosCliente({
        nome: '',
        endereco: '',
        cidade: '',
        telefone: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar cliente: ', error);
    }
  };

  return (
    <div className="adicionar-cliente-form">
      <h2>Adicionar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={dadosCliente.nome}
          onChange={handleChange}
          placeholder="Nome do Cliente"
          required
        />
        <input
          type="text"
          name="endereco"
          value={dadosCliente.endereco}
          onChange={handleChange}
          placeholder="Endereço"
          required
        />
        <input
          type="text"
          name="cidade"
          value={dadosCliente.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          required
        />
        <input
          type="text"
          name="telefone"
          value={dadosCliente.telefone}
          onChange={handleChange}
          placeholder="Telefone"
          required
        />
        <button type="submit" className="btn">Adicionar Cliente</button>
      </form>
    </div>
  );
};

export default AdicionarCliente;
