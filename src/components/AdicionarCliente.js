import React, { useState } from "react";
import { db } from "../firebase"; // Importa a configuração do Firestore
import { collection, addDoc } from "firebase/firestore";

const AdicionarCliente = () => {
  const [cliente, setCliente] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    telefone: "",
  });

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "clientes"), cliente);
      alert("Cliente adicionado com sucesso!");
      setCliente({ nome: "", endereco: "", cidade: "", telefone: "" }); // Reseta os campos
    } catch (error) {
      console.error("Erro ao adicionar cliente: ", error);
      alert("Erro ao adicionar cliente.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        value={cliente.nome}
        onChange={handleChange}
        placeholder="Nome"
        required
      />
      <input
        type="text"
        name="endereco"
        value={cliente.endereco}
        onChange={handleChange}
        placeholder="Endereço"
        required
      />
      <input
        type="text"
        name="cidade"
        value={cliente.cidade}
        onChange={handleChange}
        placeholder="Cidade"
        required
      />
      <input
        type="text"
        name="telefone"
        value={cliente.telefone}
        onChange={handleChange}
        placeholder="Telefone"
        required
      />
      <button type="submit">Adicionar Cliente</button>
    </form>
  );
};

export default AdicionarCliente;
