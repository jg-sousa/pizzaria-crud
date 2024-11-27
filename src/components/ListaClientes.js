import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ListaClientes.css';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, 'clientes'));
      const listaClientes = querySnapshot.docs.map(doc => doc.data());
      setClientes(listaClientes);
    };
    fetchClientes();
  }, []);

  return (
    <div className="lista-clientes">
      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map((cliente, index) => (
          <li key={index}>
            {cliente.nome} - {cliente.telefone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaClientes;
