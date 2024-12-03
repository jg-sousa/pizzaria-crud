import React, { useState } from "react";
import ReactInputMask from "react-input-mask";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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

  const validarFormulario = () => {
    // Validação do CEP
    if (!cep.match(/\d{5}-\d{3}/)) {
      alert("CEP inválido.");
      return false;
    }
    // Validação para outros campos pode ser adicionada aqui
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return; // Se a validação falhar, não envia o formulário
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
      alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    }
  };

  return (
    <div>
      <h1>Cadastrar Cliente</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rua:</label>
          <input
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bairro:</label>
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Número:</label>
          <input
            type="number"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cidade:</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CEP:</label>
          <ReactInputMask
            mask="99999-999"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            required
          >
            {(inputProps) => <input {...inputProps} />}
          </ReactInputMask>
        </div>
        <div>
          <label>Estado:</label>
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Telefone:</label>
          <ReactInputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          >
            {(inputProps) => <input {...inputProps} />}
          </ReactInputMask>
        </div>
        <div>
          <label>CPF:</label>
          <ReactInputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          >
            {(inputProps) => <input {...inputProps} />}
          </ReactInputMask>
        </div>
        <div>
          <label>Sexo:</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        <button type="submit">Cadastrar Cliente</button>
      </form>
    </div>
  );
};

export default CadastrarCliente;
