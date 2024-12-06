import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Container, Snackbar, Alert, Paper, Grid, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const CadastrarPedido = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editingPedido, setEditingPedido] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  const fetchPedidos = async () => {
    try {
      const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
      const pedidosList = pedidosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(pedidosList);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesSnapshot = await getDocs(collection(db, "clientes"));
      const clientesList = clientesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(clientesList);
    };

    const fetchProdutos = async () => {
      const produtosSnapshot = await getDocs(collection(db, "produtos"));
      const produtosList = produtosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosList);
    };

    fetchClientes();
    fetchProdutos();
    fetchPedidos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pedidoData = {
      clienteId: clienteSelecionado,
      itens,
      total,
      data: new Date(),
      status: "Pendente",
    };
    try {
      if (editingPedido) {
        const pedidoDoc = doc(db, "pedidos", editingPedido.id);
        await updateDoc(pedidoDoc, pedidoData);
        setSnackbarMessage("Pedido atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "pedidos"), pedidoData);
        setSnackbarMessage("Pedido realizado com sucesso!");
      }
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchPedidos();
      resetForm();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Erro ao realizar o pedido:", error);
      setSnackbarMessage("Erro ao realizar o pedido.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCheckboxChange = (produto, checked) => {
    if (checked) {
      setItens((prevItens) => {
        const novoItem = { produtoId: produto.id, nome: produto.nome, preco: produto.preco };
        setTotal(prevTotal => prevTotal + produto.preco);
        return [...prevItens, novoItem];
      });
    } else {
      setItens((prevItens) => {
        const itensRestantes = prevItens.filter(item => item.produtoId !== produto.id);
        setTotal(prevTotal => prevTotal - produto.preco);
        return itensRestantes;
      });
    }
  };

  const resetForm = () => {
    setClienteSelecionado("");
    setItens([]);
    setTotal(0);
    setEditingPedido(null);
  };

  const handleEdit = (pedido) => {
    setEditingPedido(pedido);
    setClienteSelecionado(pedido.clienteId);
    setItens(pedido.itens);
    setTotal(pedido.total);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pedidos", id));
      setSnackbarMessage("Pedido cancelado com sucesso!");
      setOpenSnackbar(true);
      fetchPedidos();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Erro ao cancelar o pedido:", error);
      setSnackbarMessage("Erro ao cancelar o pedido.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleMarkAsDelivered = async (id) => {
    try {
      const pedidoDoc = doc(db, "pedidos", id);
      await updateDoc(pedidoDoc, { status: "Entregue" });
      setSnackbarMessage("Pedido marcado como entregue!");
      setOpenSnackbar(true);
      fetchPedidos();
    } catch (error) {
      console.error("Erro ao marcar o pedido como entregue:", error);
      setSnackbarMessage("Erro ao marcar o pedido como entregue.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg">
      <h1>Gerenciamento de Pedidos</h1>
      <Button variant="contained" color="sucess" onClick={() => setOpenEditDialog(true)}>
        Cadastrar Novo Pedido
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Itens</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map(pedido => (
              <TableRow key={pedido.id}>
                <TableCell>{clientes.find(cliente => cliente.id === pedido.clienteId)?.nome}</TableCell>
                <TableCell>{pedido.itens.map(item => item.nome).join(", ")}</TableCell>
                <TableCell>R${pedido.total.toFixed(2)}</TableCell>
                <TableCell>{pedido.status}</TableCell>
                <TableCell>{new Date(pedido.data.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(pedido)} color="primary">Editar</Button>
                  <Button onClick={() => { setSelectedPedidoId(pedido.id); setOpenDeleteDialog(true); }} color="error">Cancelar</Button>
                  <Button onClick={() => handleMarkAsDelivered(pedido.id)} color="success">Entregue</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Edição */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingPedido ? "Editar Pedido" : "Cadastrar Pedido"}</DialogTitle>
        <DialogContent>
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
              <Typography variant="h6">Produtos</Typography>
              {produtos.map((produto) => (
                <FormControlLabel
                  key={produto.id}
                  control={
                    <Checkbox
                      checked={itens.some(item => item.produtoId === produto.id)}
                      onChange={(e) => handleCheckboxChange(produto, e.target.checked)}
                      name={produto.nome}
                      value={produto.id}
                    />
                  }
                  label={`${produto.nome} - R$${produto.preco}`}
                />
              ))}
            </Box>

            <Box>
              <Typography variant="h6">Itens Selecionados</Typography>
              {itens.map((item, index) => (
                <Typography key={index}>{item.nome} - R${item.preco}</Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="h6">Total: R${total.toFixed(2)}</Typography>
            </Box>

            <Box mt={3}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editingPedido ? "Atualizar Pedido" : "Realizar Pedido"}
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação de Cancelamento */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Cancelamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja cancelar este pedido?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(selectedPedidoId)} color="error">
            Cancelar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CadastrarPedido;
