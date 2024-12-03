import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CadastroCliente from "./components/CadastrarCliente";
import CadastroProduto from "./components/CadastrarProduto";
import CadastroPedido from "./components/CadastrarPedido";
import './App.css';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div">
            Pizzaria CRUD
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/clientes">Clientes</Button>
          <Button color="inherit" href="/produtos">Produtos</Button>
          <Button color="inherit" href="/pedidos">Pedidos</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<CadastroCliente />} />
          <Route path="/produtos" element={<CadastroProduto />} />
          <Route path="/pedidos" element={<CadastroPedido />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
