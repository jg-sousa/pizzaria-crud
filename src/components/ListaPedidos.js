import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [editandoPedido, setEditandoPedido] = useState(null);
  const [dadosPedido, setDadosPedido] = useState({
    nomeCliente: "",
    produtos: [],
    total: 0,
  });

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

  const handleDelete = async (id) => {
    try {
      const pedidoDoc = doc(db, "pedidos", id);
      await deleteDoc(pedidoDoc);
      setPedidos(pedidos.filter((pedido) => pedido.id !== id));
    } catch (error) {
      console.error("Erro ao excluir pedido: ", error);
    }
  };

  const handleEdit = (pedido) => {
    setEditandoPedido(pedido.id);
    setDadosPedido(pedido);
  };

  const handleSave = async (id) => {
    try {
      const pedidoDoc = doc(db, "pedidos", id);
      await updateDoc(pedidoDoc, dadosPedido);
      setPedidos(pedidos.map((pedido) => (pedido.id === id ? dadosPedido : pedido)));
      setEditandoPedido(null);
    } catch (error) {
      console.error("Erro ao atualizar pedido: ", error);
    }
  };

  return (
    <div className="pedido-lista">
      <h2>Pedidos</h2>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            {editandoPedido === pedido.id ? (
              <>
                <input
                  type="text"
                  value={dadosPedido.nomeCliente}
                  onChange={(e) => setDadosPedido({ ...dadosPedido, nomeCliente: e.target.value })}
                />
                <button onClick={() => handleSave(pedido.id)} className="save">
                  Salvar
                </button>
                <button onClick={() => setEditandoPedido(null)} className="cancel">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <p>{pedido.nomeCliente}</p>
                <p>Total: R$ {pedido.total}</p>
                <button onClick={() => handleDelete(pedido.id)} className="delete">
                  Excluir
                </button>
                <button onClick={() => handleEdit(pedido)} className="edit">
                  Editar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaPedidos;
