import React, { useState, useEffect } from "react";
import ReactInputMask from "react-input-mask";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { TextField, Button, Box, Paper, Grid, Container, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axios from "axios";

const CadastrarCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [sexo, setSexo] = useState("");
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editingCliente, setEditingCliente] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState(null);

  // Buscar clientes ao carregar o componente
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    const clientesList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setClientes(clientesList);
  };

  // Buscar Estados usando a API do IBGE
  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(response => {
        const estadosList = response.data.map(item => ({
          sigla: item.sigla,
          nome: item.nome
        }));
        setEstados(estadosList);
      })
      .catch(error => {
        console.error("Erro ao buscar estados:", error);
      });
  }, []);

  // Buscar Municípios com base no estado selecionado
  const buscarMunicipios = (estadoSigla) => {
    if (!estadoSigla) return;
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`)
      .then(response => {
        const municipiosList = response.data.map(item => ({
          nome: item.nome,
        }));
        setMunicipios(municipiosList);
      })
      .catch(error => {
        console.error("Erro ao buscar municípios:", error);
      });
  };

  useEffect(() => {
    buscarMunicipios(estado);
  }, [estado]);

  // Preencher os dados do endereço automaticamente com o ViaCEP
  const buscarEnderecoViaCEP = async (cep) => {
    if (!cep.match(/\d{5}-\d{3}/)) return;
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        setSnackbarMessage("CEP não encontrado.");
        setOpenSnackbar(true);
        return;
      }
      setRua(response.data.logradouro || "");
      setBairro(response.data.bairro || "");
      setCidade(response.data.localidade || "");
      setEstado(response.data.uf || "");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setSnackbarMessage("Erro ao buscar dados do CEP.");
      setOpenSnackbar(true);
    }
  };

  const handleCepChange = (e) => {
    const value = e.target.value;
    setCep(value);
    if (value.length === 9) {
      buscarEnderecoViaCEP(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cep.match(/\d{5}-\d{3}/)) {
      setSnackbarMessage("CEP inválido.");
      setOpenSnackbar(true);
      return;
    }

    const clienteData = { nome, rua, bairro, numero, cidade, cep, estado, telefone, cpf, sexo };

    try {
      if (editingCliente) {
        const clienteDoc = doc(db, "clientes", editingCliente.id);
        await updateDoc(clienteDoc, clienteData);
        setSnackbarMessage("Cliente atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "clientes"), clienteData);
        setSnackbarMessage("Cliente cadastrado com sucesso!");
      }

      setOpenSnackbar(true);
      fetchClientes();
      resetForm();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setSnackbarMessage("Erro ao salvar cliente.");
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setNome("");
    setRua("");
    setBairro("");
    setNumero("");
    setCidade("");
    setCep("");
    setEstado("");
    setTelefone("");
    setCpf("");
    setSexo("");
    setEditingCliente(null);
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setNome(cliente.nome);
    setRua(cliente.rua);
    setBairro(cliente.bairro);
    setNumero(cliente.numero);
    setCidade(cliente.cidade);
    setCep(cliente.cep);
    setEstado(cliente.estado);
    setTelefone(cliente.telefone);
    setCpf(cliente.cpf);
    setSexo(cliente.sexo);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      setSnackbarMessage("Cliente excluído com sucesso!");
      setOpenSnackbar(true);
      fetchClientes();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      setSnackbarMessage("Erro ao excluir cliente.");
      setOpenSnackbar(true);
    }
  };

  return (
      <Container maxWidth="lg">
        <h1>Gerenciamento de Clientes</h1>
        <Button variant="contained" color="success" onClick={() => setOpenEditDialog(true)}>
          Cadastrar Novo Cliente
        </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Rua</TableCell>
              <TableCell>Bairro</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Sexo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map(cliente => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.rua}</TableCell>
                <TableCell>{cliente.bairro}</TableCell>
                <TableCell>{cliente.numero}</TableCell>
                <TableCell>{cliente.cidade}</TableCell>
                <TableCell>{cliente.cep}</TableCell>
                <TableCell>{cliente.estado}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.cpf}</TableCell>
                <TableCell>{cliente.sexo}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(cliente)} color="sucess">Editar</Button>
                  <Button onClick={() => { setSelectedClienteId(cliente.id); setOpenDeleteDialog(true); }} color="error">Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Edição */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingCliente ? "Editar Cliente" : "Cadastrar Cliente"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rua"
                  variant="outlined"
                  fullWidth
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  required
                />
              </Grid>
                            <Grid item xs={12} sm={6}>
                <TextField
                  label="Bairro"
                  variant="outlined"
                  fullWidth
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Número"
                  variant="outlined"
                  fullWidth
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReactInputMask
                  mask="99999-999"
                  value={cep}
                  onChange={handleCepChange}
                  required
                >
                  {(inputProps) => <TextField {...inputProps} label="CEP" variant="outlined" fullWidth />}
                </ReactInputMask>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    label="Estado"
                    required
                  >
                    <MenuItem value="">Selecione o Estado</MenuItem>
                    {estados.map((estado) => (
                      <MenuItem key={estado.sigla} value={estado.sigla}>
                        {estado.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Cidade</InputLabel>
                  <Select
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    label="Cidade"
                    required
                  >
                    <MenuItem value="">Selecione a Cidade</MenuItem>
                    {municipios.map((municipio) => (
                      <MenuItem key={municipio.nome} value={municipio.nome}>
                        {municipio.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Grid item xs={12} sm={6}>
                <ReactInputMask
                  mask="(99) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                >
                  {(inputProps) => <TextField {...inputProps} label="Telefone" variant="outlined" fullWidth />}
                </ReactInputMask>
              </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReactInputMask
                  mask="999.999.999-99"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="CPF"
                      variant="outlined"
                      fullWidth
                    />
                  )}
              </ReactInputMask>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    label="Sexo"
                    required
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Feminino">Feminino</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 3 }}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                {editingCliente ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="error">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este cliente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="error">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(selectedClienteId)}
            color="error"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CadastrarCliente;
