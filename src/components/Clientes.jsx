import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Clientes = () => {
  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    bairro: "",
    numero: "",
    cidade: "",
    cep: "",
    estado: "",
    telefone: "",
    cpf: "",
    sexo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCepChange = async (cep) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    setFormData({
      ...formData,
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "clientes"), formData);
    alert("Cliente cadastrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" onChange={handleInputChange} />
      <input name="cep" placeholder="CEP" onBlur={(e) => handleCepChange(e.target.value)} />
      <input name="rua" placeholder="Rua" value={formData.rua} readOnly />
      <input name="bairro" placeholder="Bairro" value={formData.bairro} readOnly />
      <input name="numero" placeholder="Número" onChange={handleInputChange} />
      <input name="cidade" placeholder="Cidade" value={formData.cidade} readOnly />
      <input name="estado" placeholder="Estado" value={formData.estado} readOnly />
      <input name="telefone" placeholder="Telefone" onChange={handleInputChange} />
      <input name="cpf" placeholder="CPF" onChange={handleInputChange} />
      <select name="sexo" onChange={handleInputChange}>
        <option value="">Selecione</option>
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
      </select>
      <button type="submit">Salvar Cliente</button>
    </form>
  );
};

export default Clientes;
