import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const Pedidos = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedido, setPedido] = useState({
    clienteId: "",
    itens: [],
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const clientesSnapshot = await getDocs(collection(db, "clientes"));
      setClientes(clientesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const produtosSnapshot = await getDocs(collection(db, "produtos"));
      setProdutos(produtosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const handleAddItem = (produto) => {
    const newItem = { ...produto, quantidade: 1 };
    setPedido({
      ...pedido,
      itens: [...pedido.itens, newItem],
      total: pedido.total + produto.preco,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "pedidos"), pedido);
    alert("Pedido cadastrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        onChange={(e) => setPedido({ ...pedido, clienteId: e.target.value })}
        value={pedido.clienteId}
      >
        <option value="">Selecione o Cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nome}
          </option>
        ))}
      </select>
      <div>
        {produtos.map((produto) => (
          <button type="button" key={produto.id} onClick={() => handleAddItem(produto)}>
            {produto.nome} - R${produto.preco}
          </button>
        ))}
      </div>
      <p>Total: R${pedido.total}</p>
      <button type="submit">Salvar Pedido</button>
    </form>
  );
};

export default Pedidos;
