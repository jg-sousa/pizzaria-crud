import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const produtosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosList);
    };

    fetchProdutos();
  }, []);

  const handleExcluirProduto = async (id) => {
    try {
      await deleteDoc(doc(db, 'produtos', id));
      setProdutos(produtos.filter(produto => produto.id !== id));
      console.log('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const handleEditarProduto = async (id) => {
    try {
      const produtoRef = doc(db, 'produtos', id);
      await updateDoc(produtoRef, {
        nome: novoNome,
        preco: parseFloat(novoPreco),
      });
      setProdutos(
        produtos.map(produto =>
          produto.id === id
            ? { ...produto, nome: novoNome, preco: parseFloat(novoPreco) }
            : produto
        )
      );
      setProdutoEditando(null);
      console.log('Produto editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }
  };

  return (
    <div className="product-list">
      <h2>Lista de Produtos</h2>
      {produtoEditando ? (
        <div>
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Novo Nome"
          />
          <input
            type="number"
            value={novoPreco}
            onChange={(e) => setNovoPreco(e.target.value)}
            placeholder="Novo Preço"
          />
          <button onClick={() => handleEditarProduto(produtoEditando)}>Salvar Edição</button>
          <button onClick={() => setProdutoEditando(null)}>Cancelar</button>
        </div>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              <span>{produto.nome} - R$ {produto.preco}</span>
              <button onClick={() => {
                setProdutoEditando(produto.id);
                setNovoNome(produto.nome);
                setNovoPreco(produto.preco);
              }}>
                Editar
              </button>
              <button onClick={() => handleExcluirProduto(produto.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaProdutos;
