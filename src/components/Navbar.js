import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(open);
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)} variant="contained">Menu</Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/clientes" onClick={toggleDrawer(false)}>
            <ListItemText primary="Clientes" />
          </ListItem>
          <ListItem button component={Link} to="/produtos" onClick={toggleDrawer(false)}>
            <ListItemText primary="Produtos" />
          </ListItem>
          <ListItem button component={Link} to="/pedidos" onClick={toggleDrawer(false)}>
            <ListItemText primary="Pedidos" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Navbar;
