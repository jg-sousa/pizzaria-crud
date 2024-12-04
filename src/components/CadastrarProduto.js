import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Container, Snackbar, Alert } from "@mui/material";

const CadastrarProduto = () => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("Pizza");
  const [isEdit, setIsEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAdicionarProduto = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateDoc(doc(db, "produtos", id), {
          nome,
          preco: parseFloat(preco),
          categoria,
        });
        setSnackbarMessage("Produto atualizado com sucesso!");
        setSnackbarSeverity("success");
      } else {
        await addDoc(collection(db, "produtos"), {
          nome,
          preco: parseFloat(preco),
          categoria,
        });
        setSnackbarMessage("Produto adicionado com sucesso!");
        setSnackbarSeverity("success");
      }

      setOpenSnackbar(true);
      navigate("/produtos");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setSnackbarMessage("Erro ao adicionar produto!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

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
    <Container maxWidth="sm">
      <Typography>
        <h1>Cadastrar Produto</h1>
      </Typography>
      <form onSubmit={handleAdicionarProduto}>
        <Box mb={2}>
          <TextField
            label="Nome do Produto"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
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
        </Box>
        <Box mb={2}>
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
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-start">
          <Button type="submit" variant="contained" color="primary" size="large">
            {isEdit ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </Box>
      </form>

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
