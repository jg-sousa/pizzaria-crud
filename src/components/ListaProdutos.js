import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const produtos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtos);
    };

    fetchProdutos();
  }, []);

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>{produto.nome} - R$ {produto.preco}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProdutos;
