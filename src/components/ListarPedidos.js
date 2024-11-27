import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      const pedidosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(pedidosList);
    };

    fetchPedidos();
  }, []);

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            <strong>Cliente:</strong> {pedido.nomeCliente}
            <br />
            <strong>Produtos:</strong>
            <ul>
              {pedido.produtos.map((produto, index) => (
                <li key={index}>{produto.nome} - R$ {produto.preco}</li>
              ))}
            </ul>
            <strong>Total: </strong> R$ {pedido.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaPedidos;
