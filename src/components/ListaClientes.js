import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoRua, setNovoRua] = useState('');
  const [novoBairro, setNovoBairro] = useState('');
  const [novoNumero, setNovoNumero] = useState('');
  const [novoCidade, setNovoCidade] = useState('');
  const [novoEstado, setNovoEstado] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoCpf, setNovoCpf] = useState('');
  const [novoSexo, setNovoSexo] = useState('Masculino');

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, 'clientes'));
      const clientesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(clientesList);
    };

    fetchClientes();
  }, []);

  // Função para excluir o cliente
  const handleExcluirCliente = async (id) => {
    try {
      await deleteDoc(doc(db, 'clientes', id));
      setClientes(clientes.filter(cliente => cliente.id !== id));
      console.log('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  // Função para editar o cliente
  const handleEditarCliente = async (id) => {
    try {
      const clienteRef = doc(db, 'clientes', id);
      await updateDoc(clienteRef, {
        nome: novoNome,
        rua: novoRua,
        bairro: novoBairro,
        numero: novoNumero,
        cidade: novoCidade,
        estado: novoEstado,
        telefone: novoTelefone,
        cpf: novoCpf,
        sexo: novoSexo,
      });
      setClientes(
        clientes.map(cliente =>
          cliente.id === id
            ? { ...cliente, nome: novoNome, rua: novoRua, bairro: novoBairro, numero: novoNumero, cidade: novoCidade, estado: novoEstado, telefone: novoTelefone, cpf: novoCpf, sexo: novoSexo }
            : cliente
        )
      );
      setClienteEditando(null); // Fecha o formulário de edição
      console.log('Cliente editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  return (
    <div className="client-list">
      <h2>Lista de Clientes</h2>

      {clienteEditando ? (
        <div>
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do Cliente"
          />
          <input
            type="text"
            value={novoRua}
            onChange={(e) => setNovoRua(e.target.value)}
            placeholder="Rua"
          />
          <input
            type="text"
            value={novoBairro}
            onChange={(e) => setNovoBairro(e.target.value)}
            placeholder="Bairro"
          />
          <input
            type="text"
            value={novoNumero}
            onChange={(e) => setNovoNumero(e.target.value)}
            placeholder="Número"
          />
          <input
            type="text"
            value={novoCidade}
            onChange={(e) => setNovoCidade(e.target.value)}
            placeholder="Cidade"
          />
          <input
            type="text"
            value={novoEstado}
            onChange={(e) => setNovoEstado(e.target.value)}
            placeholder="Estado"
          />
          <input
            type="text"
            value={novoTelefone}
            onChange={(e) => setNovoTelefone(e.target.value)}
            placeholder="Telefone"
          />
          <input
            type="text"
            value={novoCpf}
            onChange={(e) => setNovoCpf(e.target.value)}
            placeholder="CPF"
          />
          <select
            value={novoSexo}
            onChange={(e) => setNovoSexo(e.target.value)}
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          <button onClick={() => handleEditarCliente(clienteEditando)}>Salvar Edição</button>
          <button onClick={() => setClienteEditando(null)}>Cancelar</button>
        </div>
      ) : (
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id}>
              <span>
                <strong>Nome:</strong> {cliente.nome} <br />
                <strong>Rua:</strong> {cliente.rua} <br />
                <strong>Bairro:</strong> {cliente.bairro} <br />
                <strong>Número:</strong> {cliente.numero} <br />
                <strong>Cidade:</strong> {cliente.cidade} <br />
                <strong>Estado:</strong> {cliente.estado} <br />
                <strong>Telefone:</strong> {cliente.telefone} <br />
                <strong>CPF:</strong> {cliente.cpf} <br />
                <strong>Sexo:</strong> {cliente.sexo}
              </span>
              <button onClick={() => {
                setClienteEditando(cliente.id);
                setNovoNome(cliente.nome);
                setNovoRua(cliente.rua);
                setNovoBairro(cliente.bairro);
                setNovoNumero(cliente.numero);
                setNovoCidade(cliente.cidade);
                setNovoEstado(cliente.estado);
                setNovoTelefone(cliente.telefone);
                setNovoCpf(cliente.cpf);
                setNovoSexo(cliente.sexo);
              }}>
                Editar
              </button>
              <button onClick={() => handleExcluirCliente(cliente.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaClientes;
