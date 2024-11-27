import React from "react";
import Clientes from "./components/Clientes";
import Produtos from "./components/Produtos";
import Pedidos from "./components/Pedidos";
import Listagem from "./components/Listagem";

const App = () => {
  return (
    <div>
      <h1>CRUD Pizzaria</h1>
      <Clientes />
      <Produtos />
      <Pedidos />
      <Listagem />
    </div>
  );
};

export default App;
