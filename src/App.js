import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CssBaseline, Box, Container, List, ListItem, ListItemText, ListItemIcon, Divider, AppBar, Toolbar, Typography, Button, TextField, Grid, Paper } from "@mui/material";
import { Home, Person, ShoppingCart, Store } from "@mui/icons-material"; // Ícones

import HomePage from "./components/Home";
import CadastroCliente from "./components/CadastrarCliente";
import CadastroProduto from "./components/CadastrarProduto";
import CadastroPedido from "./components/CadastrarPedido";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
        {/* Barra lateral fixa */}
        <Box sx={{
          width: 250,
          backgroundColor: "#1976d2",
          color: "white",
          paddingTop: 2,
          position: "fixed",
          height: "100vh",
        }}>
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Typography variant="h5">Pizzaria</Typography>
          </Box>
          <Divider sx={{ borderColor: "white" }} />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <Home sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ color: "white" }} />
            </ListItem>
            <Divider sx={{ borderColor: "white" }} />
            <ListItem button component={Link} to="/clientes">
              <ListItemIcon>
                <Person sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Clientes" sx={{ color: "white" }} />
            </ListItem>
            <Divider sx={{ borderColor: "white" }} />
            <ListItem button component={Link} to="/produtos">
              <ListItemIcon>
                <Store sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Produtos" sx={{ color: "white" }} />
            </ListItem>
            <Divider sx={{ borderColor: "white" }} />
            <ListItem button component={Link} to="/pedidos">
              <ListItemIcon>
                <ShoppingCart sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Pedidos" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Box>

        {/* Área de Conteúdo ao lado da barra lateral */}
        <Box sx={{
          marginLeft: 25,
          paddingTop: 2,
          width: "calc(100% - 250px)",
          overflowX: "hidden",
        }}>

          {/* Conteúdo das páginas */}
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
