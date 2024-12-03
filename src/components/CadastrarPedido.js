import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const CadastrarPedido = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);

  // Carregar clientes e produtos ao inicializar o componente
  useEffect(() => {
    const fetchClientes = async () => {
      const clientesSnapshot = await getDocs(collection(db, "clientes"));
      const clientesList = clientesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClientes(clientesList);
    };

    const fetchProdutos = async () => {
      const produtosSnapshot = await getDocs(collection(db, "produtos"));
      const produtosList = produtosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProdutos(produtosList);
    };

    fetchClientes();
    fetchProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "pedidos"), {
        clienteId: clienteSelecionado,
        itens,
        total,
        data: new Date(),
      });
      alert("Pedido realizado com sucesso!");
      setItens([]); // Limpa os itens após enviar o pedido
      setTotal(0); // Limpa o total após o pedido
    } catch (error) {
      console.error("Erro ao realizar o pedido:", error);
    }
  };

  const handleCheckboxChange = (produto, checked) => {
    if (checked) {
      setItens((prevItens) => {
        const novoItem = { produtoId: produto.id, nome: produto.nome, preco: produto.preco };
        setTotal(prevTotal => prevTotal + produto.preco); // Atualiza o total
        return [...prevItens, novoItem];
      });
    } else {
      setItens((prevItens) => {
        const itensRestantes = prevItens.filter(item => item.produtoId !== produto.id);
        setTotal(prevTotal => prevTotal - produto.preco); // Atualiza o total
        return itensRestantes;
      });
    }
  };

  return (
    <div>
      <h1>Cadastrar Pedido</h1>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              required
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mb={2}>
          <h3>Produtos</h3>
          {produtos.map((produto) => (
            <FormControlLabel
              key={produto.id}
              control={
                <Checkbox
                  onChange={(e) => handleCheckboxChange(produto, e.target.checked)}
                  name={produto.nome}
                  value={produto.id}
                />
              }
              label={`${produto.nome} - R$${produto.preco}`}
            />
          ))}
        </Box>

        <div>
          <h3>Itens Selecionados</h3>
          {itens.map((item, index) => (
            <div key={index}>
              <p>{item.nome} - R${item.preco}</p>
            </div>
          ))}
        </div>

        <div>
          <h3>Total: R${total}</h3>
        </div>

        <Button type="submit" variant="contained" color="primary">
          Realizar Pedido
        </Button>
      </form>
    </div>
  );
};

export default CadastrarPedido;
