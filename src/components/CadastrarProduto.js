import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Certifique-se de ter configurado o Firebase
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const CadastrarProduto = () => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("Pizza");
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do produto da URL

  // Função para adicionar um novo produto
  const handleAdicionarProduto = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateDoc(doc(db, "produtos", id), {
          nome,
          preco: parseFloat(preco),
          categoria,
        });
      } else {
        await addDoc(collection(db, "produtos"), {
          nome,
          preco: parseFloat(preco),
          categoria,
        });
      }

      alert(isEdit ? "Produto editado com sucesso!" : "Produto adicionado com sucesso!");
      navigate("/produtos");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  // Carregar os dados do produto para edição, caso o ID seja passado pela URL
  useEffect(() => {
    if (id) {
      const fetchProduto = async () => {
        const produtoRef = doc(db, "produtos", id);
        const produtoSnap = await getDoc(produtoRef);
        if (produtoSnap.exists()) {
          const produtoData = produtoSnap.data();
          setNome(produtoData.nome);
          setPreco(produtoData.preco);
          setCategoria(produtoData.categoria);
          setIsEdit(true);
        } else {
          alert("Produto não encontrado.");
        }
      };

      fetchProduto();
    }
  }, [id]);

  return (
    <div>
      <h1>{isEdit ? "Editar Produto" : "Cadastrar Produto"}</h1>
      <form onSubmit={handleAdicionarProduto}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Preço:</label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div>
          <label>Categoria:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="Pizza">Pizza</option>
            <option value="Bebida">Bebida</option>
            <option value="Sobremesa">Sobremesa</option>
          </select>
        </div>
        <button type="submit">{isEdit ? "Atualizar Produto" : "Adicionar Produto"}</button>
      </form>
    </div>
  );
};

export default CadastrarProduto;
