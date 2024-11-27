import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Produtos = () => {
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "produtos"), formData);
    alert("Produto cadastrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome do Produto" onChange={handleInputChange} />
      <input name="preco" type="number" placeholder="Preço" onChange={handleInputChange} />
      <select name="categoria" onChange={handleInputChange}>
        <option value="">Selecione a Categoria</option>
        <option value="Pizza">Pizza</option>
        <option value="Bebida">Bebida</option>
        <option value="Sobremesa">Sobremesa</option>
      </select>
      <button type="submit">Salvar Produto</button>
    </form>
  );
};

export default Produtos;
