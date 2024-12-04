import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CssBaseline, Box, Container, List, ListItem, ListItemText, ListItemIcon, Divider, Typography } from "@mui/material";
import { Home, Person, ShoppingCart, Store } from "@mui/icons-material"; // Ícones
import HomePage from "./components/Home";
import CadastroCliente from "./components/CadastrarCliente";
import CadastroProduto from "./components/CadastrarProduto";
import CadastroPedido from "./components/CadastrarPedido";
import './App.css';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
        {/* Barra lateral fixa */}
        <Box className="sidebar">
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Typography variant="h5" className="sidebar-title">Pizzaria</Typography>
          </Box>
          <Divider className="divider" />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <Home className="icon" />
              </ListItemIcon>
              <ListItemText primary="Home" className="sidebar-text" />
            </ListItem>
            <Divider className="divider" />
            <ListItem button component={Link} to="/clientes">
              <ListItemIcon>
                <Person className="icon" />
              </ListItemIcon>
              <ListItemText primary="Clientes" className="sidebar-text" />
            </ListItem>
            <Divider className="divider" />
            <ListItem button component={Link} to="/produtos">
              <ListItemIcon>
                <Store className="icon" />
              </ListItemIcon>
              <ListItemText primary="Produtos" className="sidebar-text" />
            </ListItem>
            <Divider className="divider" />
            <ListItem button component={Link} to="/pedidos">
              <ListItemIcon>
                <ShoppingCart className="icon" />
              </ListItemIcon>
              <ListItemText primary="Pedidos" className="sidebar-text" />
            </ListItem>
          </List>
        </Box>

        {/* Área de Conteúdo ao lado da barra lateral */}
        <Box className="content">
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/clientes" element={<CadastroCliente />} />
              <Route path="/produtos" element={<CadastroProduto />} />
              <Route path="/pedidos" element={<CadastroPedido />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
