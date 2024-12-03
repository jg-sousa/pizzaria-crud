import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      const pedidosLista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(pedidosLista);
    };
    fetchPedidos();
  }, []);

  const handleExcluir = async (id) => {
    try {
      await deleteDoc(doc(db, "pedidos", id));
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== id));
      alert("Pedido excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o pedido:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Total</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.clienteId}</td>
              <td>{pedido.total}</td>
              <td>{pedido.dataPedido}</td>
              <td>
                <Link to={`/pedidos/editar/${pedido.id}`}>Editar</Link>
                <button onClick={() => handleExcluir(pedido.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPedidos;
