import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';  // O caminho correto para o arquivo firebase.js

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);
  
  useEffect(() => {
    // Função para pegar os dados do Firebase
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const clientesList = querySnapshot.docs.map(doc => doc.data());
      setClientes(clientesList);
    };

    fetchClientes();
  }, []);

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="3">Nenhum cliente encontrado</td>
            </tr>
          ) : (
            clientes.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>
                  <button>Editar</button>
                  <button>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarClientes;
