// src/components/ListarPedidos.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ListarPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      const listaPedidos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(listaPedidos);
    };

    fetchPedidos();
  }, []);

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            <strong>Cliente: {pedido.nomeCliente}</strong><br />
            Produtos: {pedido.produtos.map((produto) => produto.nome).join(", ")}<br />
            Total: R$ {pedido.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarPedidos;
