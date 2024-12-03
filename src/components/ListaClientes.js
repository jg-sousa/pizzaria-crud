import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const clientesLista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(clientesLista);
    };
    fetchClientes();
  }, []);

  const handleExcluir = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== id));
      alert("Cliente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o cliente:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone}</td>
              <td>
                <button>
                  <Link to={`/clientes/editar/${cliente.id}`}>Editar</Link>
                </button>
                <button onClick={() => handleExcluir(cliente.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaClientes;
