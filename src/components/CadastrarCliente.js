import React, { useState, useEffect } from "react";
import ReactInputMask from "react-input-mask";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, Box, Paper, Grid, Container, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";

const CadastrarCliente = () => {
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

  // Fetch States using the IBGE API
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

  // Fetch Municipalities based on the selected State
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
    // Fetch Municipalities when State changes
    buscarMunicipios(estado);
  }, [estado]);

  // Automatically fill in address details using ViaCEP
  const buscarEnderecoViaCEP = async (cep) => {
    if (!cep.match(/\d{5}-\d{3}/)) return;
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        setSnackbarMessage("CEP não encontrado.");
        setOpenSnackbar(true);
        return;
      }
      // Update address fields
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
      buscarEnderecoViaCEP(value); // Fetch CEP when format is correct
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple CEP validation
    if (!cep.match(/\d{5}-\d{3}/)) {
      setSnackbarMessage("CEP inválido.");
      setOpenSnackbar(true);
      return;
    }

    try {
      await addDoc(collection(db, "clientes"), {
        nome,
        rua,
        bairro,
        numero,
        cidade,
        cep,
        estado,
        telefone,
        cpf,
        sexo,
      });
      setSnackbarMessage("Cliente cadastrado com sucesso!");
      setOpenSnackbar(true);

      // Limpar o formulário após sucesso
      resetForm();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setSnackbarMessage("Erro ao cadastrar cliente.");
      setOpenSnackbar(true);
    }
  };

  // Função para limpar os campos do formulário
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
  };

  return (
    <Container maxWidth="lg">
      <h1>Cadastrar Cliente</h1>
      <Paper sx={{ padding: 3 }}>
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
                <ReactInputMask
                    mask="999.999.999-99" // Máscara de CPF
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                >
                    {(inputProps) => (
                    <TextField
                        {...inputProps} // Espalha as props do ReactInputMask
                        label="CPF"
                        variant="outlined"
                        fullWidth
                    />
                    )}
                </ReactInputMask>
            </Grid>
            <Grid item xs={12} sm={6}>
                <ReactInputMask
                    mask="(99) 99999-9999" // Máscara de Telefone
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                >
                    {(inputProps) => (
                    <TextField
                        {...inputProps} // Espalha as props do ReactInputMask
                        label="Telefone"
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
              Cadastrar Cliente
            </Button>
          </Box>
        </form>
      </Paper>
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
