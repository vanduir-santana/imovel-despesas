import "../App.css";
import { useState } from "react";
import InputNumber from "./InputNumber";
import Resultado from "./Resultado";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endpoints } from "../util";

export default function FormCorretor({ exibirResultado, setExibirResultado }) {
  const [dadosEntrada, setDadosEntrada] = useState({
    nome: "",
    valorVenda: 0,
    valorFinanciamento: 0,
    quantidadeAtos: 0,
    possuiDesconto: false,
  });

  const [jsonResultado, setJsonResultado] = useState({});

  function handleChangeInputs(e) {
    const key = e.target.name;
    const value =
      e.target.type !== "checkbox"
        ? e.target.numericValue ?? e.target.value
        : e.target.checked;
    setDadosEntrada({ ...dadosEntrada, [key]: value });
  }

  function validar() {
    if (dadosEntrada.nome.length < 3) {
      toast.warn("Nome muito curto.");
      const elNome = document.getElementsByName("nome");
      elNome && elNome.focus();
      return false;
    }

    if (dadosEntrada.valorVenda === 0) {
      toast.warn("Digitar valor venda.");
      const elValorVenda = document.getElementById("inpValorVenda");
      elValorVenda && elValorVenda.focus();
      return false;
    }

    const elValorFinanciamento = document.getElementById(
      "inpValorFinanciamento",
    );
    if (dadosEntrada.valorFinanciamento === 0) {
      toast.warn("Digitar valor financiamento.");
      elValorFinanciamento && elValorFinanciamento.focus();
      return false;
    }

    if (dadosEntrada.valorFinanciamento >= dadosEntrada.valorVenda) {
      toast.warn("Valor Financiamento não pode ser maior que o Valor Venda.");
      elValorFinanciamento && elValorFinanciamento.focus();
      return false;
    }

    if (dadosEntrada.quantidadeAtos === 0) {
      toast.warn("Digitar quantidade de atos.");
      const elQuantidadeAtos = document.getElementById("inpQuantidadeAtos");
      elQuantidadeAtos && elQuantidadeAtos.focus();
      return false;
    }

    return true;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validar()) return;

    let result;
    try {
      result = await fetch(endpoints.simular, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEntrada),
      });
    } catch (err) {
      toast.error(err.message);
      return;
    }

    const oResultado = await result.json();
    setJsonResultado(oResultado);
    if (!result.ok) {
      if (result.status === 400) {
        toast.warn(oResultado.message);
        return;
      }

      const msg = `Problemas ao fazer simulação: ${result.statusText}`;
      console.log(msg);
      toast.warn(msg);
      return;
    }

    setExibirResultado(true);
  }

  if (exibirResultado && jsonResultado.nomeCliente !== undefined) {
    return (
      <Resultado
        dados={jsonResultado}
        setExibirResultado={setExibirResultado}
      />
    );
  }

  return (
    <>
      <div className="FormCorretor">
        <form onSubmit={handleFormSubmit}>
          <div className="formGroup">
            <h3>Despesas Imóvel</h3>
            <div>
              <label htmlFor="inpNome">Nome Cliente:</label>
              <input
                id="inpNome"
                name="nome"
                type="text"
                placeholder=""
                required
                maxLength={50}
                value={dadosEntrada.nome}
                onChange={handleChangeInputs}
              />
            </div>
            <div>
              <label htmlFor="inpValorVenda">Valor Venda (R$):</label>
              <InputNumber
                id="inpValorVenda"
                name="valorVenda"
                value={dadosEntrada.valorVenda}
                onChange={handleChangeInputs}
              />
            </div>
            <div>
              <label htmlFor="inpValorFinanciamento">
                Valor Financiamento (R$):
              </label>
              <InputNumber
                id="inpValorFinanciamento"
                name="valorFinanciamento"
                value={dadosEntrada.valorFinanciamento}
                onChange={handleChangeInputs}
              />
            </div>
            <div>
              <label htmlFor="inpQuantidadeAtos">Quantidade de Atos:</label>
              <InputNumber
                id="inpQuantidadeAtos"
                name="quantidadeAtos"
                formato={"inteiro"}
                inputMode="decimal"
                maxLength={2}
                value={dadosEntrada.quantidadeAtos}
                onChange={handleChangeInputs}
              />
            </div>
            <div>
              <label htmlFor="inpPossuiDesconto">Possui desconto?</label>
              <input
                id="inpPossuiDesconto"
                name="possuiDesconto"
                type="checkbox"
                checked={dadosEntrada.possuiDesconto}
                onChange={handleChangeInputs}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button id="btnSubmit" type="submit">
              Simular
            </button>
          </div>
        </form>
        <ToastContainer position="top-center" />
      </div>
      <div className="logo"></div>
    </>
  );
}
