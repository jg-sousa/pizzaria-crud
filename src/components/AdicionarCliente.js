import React, { useState } from "react";
import { db } from "../firebase";  // Verifique o caminho correto do arquivo firebase.js
import { collection, addDoc } from "firebase/firestore";

const AddClient = () => {
  const [clientData, setClientData] = useState({
    nome: "",
    rua: "",
    bairro: "",
    numero: "",
    cidade: "",
    estado: "",
    telefone: "",
    cpf: "",
    sexo: "Masculino", // Defina um valor padrão
  });

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adiciona os dados do cliente ao Firestore
      const docRef = await addDoc(collection(db, "clientes"), clientData);
      console.log("Cliente adicionado com ID: ", docRef.id);
    } catch (error) {
      console.error("Erro ao adicionar cliente: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        value={clientData.nome}
        onChange={handleChange}
        placeholder="Nome"
        required
      />
      <input
        type="text"
        name="rua"
        value={clientData.rua}
        onChange={handleChange}
        placeholder="Rua"
        required
      />
      <input
        type="text"
        name="bairro"
        value={clientData.bairro}
        onChange={handleChange}
        placeholder="Bairro"
        required
      />
      <input
        type="text"
        name="numero"
        value={clientData.numero}
        onChange={handleChange}
        placeholder="Número"
        required
      />
      <input
        type="text"
        name="cidade"
        value={clientData.cidade}
        onChange={handleChange}
        placeholder="Cidade"
        required
      />
      <input
        type="text"
        name="estado"
        value={clientData.estado}
        onChange={handleChange}
        placeholder="Estado"
        required
      />
      <input
        type="text"
        name="telefone"
        value={clientData.telefone}
        onChange={handleChange}
        placeholder="Telefone"
        required
      />
      <input
        type="text"
        name="cpf"
        value={clientData.cpf}
        onChange={handleChange}
        placeholder="CPF"
        required
      />
      <select
        name="sexo"
        value={clientData.sexo}
        onChange={handleChange}
        required
      >
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
      </select>
      <button type="submit">Adicionar Cliente</button>
    </form>
  );
};

export default AddClient;
