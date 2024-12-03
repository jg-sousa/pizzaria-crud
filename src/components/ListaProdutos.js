import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const produtosLista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosLista);
    };
    fetchProdutos();
  }, []);

  const handleExcluir = async (id) => {
    try {
      await deleteDoc(doc(db, "produtos", id));
      setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>R$ {produto.preco.toFixed(2)}</td>
              <td>{produto.categoria}</td>
              <td>
                <button>
                  <Link to={`/produtos/editar/${produto.id}`}>Editar</Link>
                </button>
                <button onClick={() => handleExcluir(produto.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProdutos;
