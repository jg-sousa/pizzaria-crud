// src/components/FazerPedido.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const FazerPedido = () => {
  const [dadosPedido, setDadosPedido] = useState({
    nomeCliente: "",
    produtos: [],
    total: 0,
  });
  const [listaProdutos, setListaProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const produtos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListaProdutos(produtos);
    };

    fetchProdutos();
  }, []);

  const handleAdicionarProduto = (produto) => {
    setDadosPedido((prevData) => {
      const produtosAtualizados = [...prevData.produtos, produto];
      const totalAtualizado = produtosAtualizados.reduce((acc, p) => acc + p.preco, 0);
      return {
        ...prevData,
        produtos: produtosAtualizados,
        total: totalAtualizado,
      };
    });
  };

  const handleEnviarPedido = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "pedidos"), dadosPedido);
      console.log("Pedido criado com ID: ", docRef.id);
      navigate("/pedidos");  // Redireciona para a página de pedidos
    } catch (error) {
      console.error("Erro ao criar pedido: ", error);
    }
  };

  return (
    <div>
      <h1>Fazer Pedido</h1>
      <form onSubmit={handleEnviarPedido}>
        <input
          type="text"
          placeholder="Nome do Cliente"
          value={dadosPedido.nomeCliente}
          onChange={(e) => setDadosPedido({ ...dadosPedido, nomeCliente: e.target.value })}
          required
        />
        <h2>Produtos</h2>
        <ul>
          {listaProdutos.map((produto) => (
            <li key={produto.id}>
              <button type="button" onClick={() => handleAdicionarProduto(produto)}>
                {produto.nome} - R$ {produto.preco}
              </button>
            </li>
          ))}
        </ul>
        <h3>Total: R$ {dadosPedido.total}</h3>
        <button type="submit">Finalizar Pedido</button>
      </form>
    </div>
  );
};

export default FazerPedido;
