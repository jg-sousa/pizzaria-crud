import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { TextField, Button, Box, Paper, Grid, Container, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, ButtonGroup } from "@mui/material";

const CadastrarProduto = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("Pizza");
  const [isEdit, setIsEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editingProduto, setEditingProduto] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProdutoId, setSelectedProdutoId] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState("Todos");

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const produtosList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setProdutos(produtosList);
  };

  const handleAdicionarProduto = async (e) => {
    e.preventDefault();

    const produtoData = { nome, preco: parseFloat(preco), categoria };

    try {
      if (isEdit) {
        const produtoDoc = doc(db, "produtos", editingProduto.id);  // Corrigido para usar o ID correto
        await updateDoc(produtoDoc, produtoData);
        setSnackbarMessage("Produto atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "produtos"), produtoData);
        setSnackbarMessage("Produto adicionado com sucesso!");
      }

      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchProdutos();
      resetForm();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setSnackbarMessage("Erro ao adicionar produto!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setNome("");
    setPreco("");
    setCategoria("Pizza");
    setIsEdit(false);
    setEditingProduto(null);
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setNome(produto.nome);
    setPreco(produto.preco);
    setCategoria(produto.categoria);
    setIsEdit(true);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "produtos", id));
      setSnackbarMessage("Produto excluído com sucesso!");
      setOpenSnackbar(true);
      fetchProdutos();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setSnackbarMessage("Erro ao excluir produto.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const filteredProdutos = filterCategoria === "Todos"
    ? produtos
    : produtos.filter(produto => produto.categoria === filterCategoria);

  return (
    <Container maxWidth="lg">
      <h1>Gerenciamento de Produtos</h1>
      <Button variant="contained" color="secondary" onClick={() => setOpenEditDialog(true)}>
        Cadastrar Novo Produto
      </Button>

      <ButtonGroup sx={{ marginTop: 2 }}>
        <Button onClick={() => setFilterCategoria("Todos")}>Todos</Button>
        <Button onClick={() => setFilterCategoria("Pizza")}>Pizzas</Button>
        <Button onClick={() => setFilterCategoria("Bebida")}>Bebidas</Button>
        <Button onClick={() => setFilterCategoria("Sobremesa")}>Sobremesas</Button>
      </ButtonGroup>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProdutos.map(produto => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.preco.toFixed(2)}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(produto)} color="primary">Editar</Button>
                  <Button onClick={() => { setSelectedProdutoId(produto.id); setOpenDeleteDialog(true); }} color="eror">Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Edição */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? "Editar Produto" : "Cadastrar Produto"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAdicionarProduto}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nome do Produto"
                  variant="outlined"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Preço"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  required
                  step="0.01"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="categoria-label">Categoria</InputLabel>
                  <Select
                    labelId="categoria-label"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  >
                    <MenuItem value="Pizza">Pizza</MenuItem>
                    <MenuItem value="Bebida">Bebida</MenuItem>
                    <MenuItem value="Sobremesa">Sobremesa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEdit ? "Atualizar Produto" : "Adicionar Produto"}
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

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este produto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(selectedProdutoId)} color="error">
            Excluir
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

export default CadastrarProduto;
