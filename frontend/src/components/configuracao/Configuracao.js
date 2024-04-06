/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { sha256 } from "js-sha256";
import Menu from "./Menu";
import Senha from "./Senha";
import SenhaAlterar from "./SenhaAlterar";
import DespesasGerais from "./DespesasGerais";
import DespesasRegistro from "./DespesasRegistro";
import DespesasCertidao from "./DespesasCertidao";
import BotoesPersistencia from "./BotoesPersistencia";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ModosConfig,
  validarArrObjsNum,
  capitalize,
  SENHA_TAMANHO_MIN,
  hashSenhaDev,
  hashSenhaVisitante,
  endpoints,
  MSG_LIMPAR,
  MSG_LIMPAR2,
  MSG_COLAR,
  MSG_COLAR2,
  MSG_COLAR_FORMATO_INVALIDO,
  MSG_VALORES_INVALIDOS,
  MSG_MODO_CONFIG_INDEFINIDO,
  MSG_MATRICULA_ZERO,
  MSG_PRENOTACAO_ZERO,
  MSG_DIGITAR_SENHA,
  MSG_SENHAS_DIFERENTES,
  MSG_SENHA_PEQUENA,
  MSG_DESPESAS_POR_VALOR_IMOVEL_VAZIAS,
  MSG_DESPESAS_CERTIDAO_VAZIAS,
  MSG_PERC_VALOR_RECURSOS_PROPRIOS_ZERO,
  MSG_PERC_VALOR_FINANCIAMENTO_ZERO,
  MSG_BANCO_VALOR_FINANCIAMENTO_MAX_ZERO,
  MSG_BANCO_VALOR_TAXA_FIXA_ZERO,
  MSG_BANCO_PERC_ZERO,
  MSG_CERTIDAO_PREFEITURA,
} from "../../util";

const RE_COLAR_POR_VALOR_IMOVEL = /(\d+)(\.\d{3})*(,\d*)/g;
const RE_COLAR_CERTIDAO = /(\d{1,2}\t)|((\d+)(\.\d{3})*(,\d*))/g;
const QTD_CAMPOS_PLANILHA1 = 6;
const QTD_CAMPOS_PLANILHA2 = 2;

/* eslint-disable-next-line */
String.prototype.capitalize = function () {
  return capitalize(this);
};

export default function Configuracao({ setEhConfiguracao }) {
  const [isLoading, setIsLoading] = useState(false);
  const [modoConfig, setModoConfig] = useState(ModosConfig.PedirSenha);
  const [senha, setSenha] = useState("");
  const [despesasGerais, setDespesasGerais] = useState({
    prefeitura: {
      percValorFinanciamento: 0,
      percValorRecursosProprios: 0,
      certidao: 0,
    },
    banco: {
      valorFinanciamentoMax: 0,
      taxaFixaValorMax: 0,
      taxaPercAcimaValorMax: 0,
    },
  });
  const [despesasRegistroFixas, setDespesasRegistroFixas] = useState({
    matricula: 0,
    prenotacao: 0,
  });
  const [despesasRegistroPorValor, setDespesasRegistroPorValor] = useState([]);
  const [despesasCertidao, setDespesasCertidao] = useState([
    getDespesasCertidaoZerado,
  ]);
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaNovaRepetir, setSenhaNovaRepetir] = useState("");

  function getDepesasPorValorRegistroZerado() {
    return {
      valor: 0,
      emolumentos: 0,
      fundos: 0,
    };
  }

  function getDespesasCertidaoZerado() {
    return {
      quantidadeAtos: 0,
      valorCertidao: 0,
    };
  }

  function validarDespesasGerais() {
    if (despesasGerais.prefeitura.percValorFinanciamento === 0) {
      const inpPercValorFinanciamento = document.getElementById(
        "inpPercValorFinanciamento",
      );
      toast.error(MSG_PERC_VALOR_FINANCIAMENTO_ZERO);
      inpPercValorFinanciamento && inpPercValorFinanciamento.focus();
      return false;
    }

    if (despesasGerais.prefeitura.percValorRecursosProprios === 0) {
      const inpPercValorRecursosProprios = document.getElementById(
        "inpPercValorRecursosProprios",
      );
      toast.error(MSG_PERC_VALOR_RECURSOS_PROPRIOS_ZERO);
      inpPercValorRecursosProprios && inpPercValorRecursosProprios.focus();
      return false;
    }

    if (despesasGerais.prefeitura.certidao === 0) {
      const inpCertidao = document.getElementById("inpCertidao");
      toast.error(MSG_CERTIDAO_PREFEITURA);
      inpCertidao && inpCertidao.focus();
      return false;
    }

    if (despesasGerais.banco.valorFinanciamentoMax === 0) {
      const inpValorFinanciamentoMax = document.getElementById(
        "inpValorFinanciamentoMax",
      );
      toast.error(MSG_BANCO_VALOR_FINANCIAMENTO_MAX_ZERO);
      inpValorFinanciamentoMax && inpValorFinanciamentoMax.focus();
      return false;
    }

    if (despesasGerais.banco.taxaFixaValorMax === 0) {
      const inpTaxaFixaValorMax = document.getElementById(
        "inpTaxaFixaValorMax",
      );
      toast.error(MSG_BANCO_VALOR_TAXA_FIXA_ZERO);
      inpTaxaFixaValorMax && inpTaxaFixaValorMax.focus();
      return false;
    }

    if (despesasGerais.banco.taxaPercAcimaValorMax === 0) {
      const inpTaxaPercAcimaValorMax = document.getElementById(
        "inpTaxaPercAcimaValorMax",
      );
      toast.error(MSG_BANCO_PERC_ZERO);
      inpTaxaPercAcimaValorMax && inpTaxaPercAcimaValorMax.focus();
      return false;
    }

    return true;
  }

  function validarDespesasRegistro(adicionando = false) {
    if (
      despesasRegistroFixas.matricula === undefined ||
      despesasRegistroFixas.matricula === 0
    ) {
      const inpMatricula = document.getElementById("inpMatricula");
      toast.error(MSG_MATRICULA_ZERO);
      inpMatricula && inpMatricula.focus();
      return false;
    }

    if (
      despesasRegistroFixas.prenotacao === undefined ||
      despesasRegistroFixas.prenotacao === 0
    ) {
      const inpPrenotacao = document.getElementById("inpPrenotacao");
      toast.error(MSG_PRENOTACAO_ZERO);
      inpPrenotacao && inpPrenotacao.focus();
      return false;
    }

    if (!adicionando && despesasRegistroPorValor.length === 0) {
      toast.warn(MSG_DESPESAS_POR_VALOR_IMOVEL_VAZIAS);
      return false;
    }

    const [indice, prop] = validarArrObjsNum(despesasRegistroPorValor, true);
    if (indice !== -1) {
      toast.warn(MSG_VALORES_INVALIDOS);
      const el = document.getElementById(`inp${prop.capitalize()}${indice}`);
      el && el.focus();
      return false;
    }

    return true;
  }

  function validarDespesasCertidao(adicionando = false) {
    if (!adicionando && despesasCertidao.length === 0) {
      toast.warn(MSG_DESPESAS_CERTIDAO_VAZIAS);
      return;
    }

    const [indice, prop] = validarArrObjsNum(despesasCertidao);
    if (indice !== -1) {
      toast.warn(MSG_VALORES_INVALIDOS);
      const el = document.getElementById(`inp${prop.capitalize()}${indice}`);
      el && el.focus();
      return false;
    }

    return true;
  }

  function validarSenhaAlterar() {
    if (senhaNova === "" && senhaNovaRepetir === "") {
      toast.warn(MSG_DIGITAR_SENHA);
      return false;
    }

    if (senhaNova !== senhaNovaRepetir) {
      toast.warn(MSG_SENHAS_DIFERENTES);
      return false;
    }

    if (
      senhaNova.length < SENHA_TAMANHO_MIN ||
      senhaNovaRepetir.length < SENHA_TAMANHO_MIN
    ) {
      toast.warn(MSG_SENHA_PEQUENA);
      return false;
    }

    return true;
  }

  function handleAdicionarDespesasRegistroPorValor(e) {
    e.preventDefault();
    if (validarDespesasRegistro(true)) {
      setDespesasRegistroPorValor([
        ...despesasRegistroPorValor,
        getDepesasPorValorRegistroZerado(),
      ]);
    }
  }

  function handleAdicionarDespesasCertidao(e) {
    e.preventDefault();
    if (validarDespesasCertidao(true)) {
      setDespesasCertidao([...despesasCertidao, getDespesasCertidaoZerado()]);
    }
  }

  function handleChangeDespesasGerais(e) {
    const [categoria, campo] = e.target.name.split(".");
    setDespesasGerais({
      ...despesasGerais,
      [categoria]: {
        ...despesasGerais[categoria],
        [campo]: e.target.numericValue,
      },
    });
  }

  function handleChangeDespesasRegistroFixas(e) {
    setDespesasRegistroFixas({
      ...despesasRegistroFixas,
      [e.target.name]: e.target.numericValue,
    });
  }

  const handleChangeDespesasRegistroPorValor = (index) => (e) => {
    const key = e.target.name;
    const value = e.target.numericValue;
    if (despesasRegistroPorValor[index][key] === value) {
      console.debug(
        "handleChangeDespesasRegistroPorValor: não processar se repetidos.",
      );
      return;
    }

    setDespesasRegistroPorValor((current) => [
      ...current.slice(0, index),
      { ...current[index], [key]: value },
      ...current.slice(index + 1),
    ]);
  };

  const handleChangeDespesasCertidao = (index) => (e) => {
    const key = e.target.name;
    let value = e.target.numericValue;

    setDespesasCertidao((current) => [
      ...current.slice(0, index),
      { ...current[index], [key]: value },
      ...current.slice(index + 1),
    ]);
  };

  function handleLimparDespesasRegistroPorValor(e) {
    e.preventDefault();
    if (confirm(MSG_LIMPAR)) {
      setDespesasRegistroFixas({});
      setDespesasRegistroPorValor([]);
    }
  }

  function toDecimalNumber(value) {
    value = Number(value.replace(/(\.*)(,*)/g, "")) / 100;
    if (Number.isNaN(value)) value = 0;
    return value;
  }

  function handleLimparDespesasCertidao(e) {
    e.preventDefault();
    if (confirm(MSG_LIMPAR2)) setDespesasCertidao([]);
  }

  function handleColarDespesasRegistro(e) {
    if (!confirm(MSG_COLAR)) return;

    const pasteText = e.clipboardData.getData("text");
    let arr = pasteText.match(RE_COLAR_POR_VALOR_IMOVEL);
    if (!Array.isArray(arr) || arr.length % QTD_CAMPOS_PLANILHA1 !== 0) {
      toast.error(MSG_COLAR_FORMATO_INVALIDO);
      return;
    }

    setDespesasRegistroFixas({
      matricula: toDecimalNumber(arr[1]),
      prenotacao: toDecimalNumber(arr[3]),
    });

    // obtem apenas campos necessários
    const novoArr = [];
    for (
      let i = 0, j = 2, l = 4;
      i < arr.length;
      i += QTD_CAMPOS_PLANILHA1, j = i + 2, l = i + 4
    ) {
      novoArr.push({
        valor: toDecimalNumber(arr[i]),
        emolumentos: toDecimalNumber(arr[j]),
        fundos: toDecimalNumber(arr[l]),
      });
    }
    setDespesasRegistroPorValor(novoArr);
  }

  function handleColarDespesasCertidao(e) {
    if (!confirm(MSG_COLAR2)) return;

    const pasteText = e.clipboardData.getData("text");
    let arr = pasteText.match(RE_COLAR_CERTIDAO);
    if (!Array.isArray(arr) || arr.length < 4) {
      toast.error(MSG_COLAR_FORMATO_INVALIDO);
      return;
    }

    // obtem campos
    const novoArr = [];
    for (let i = 0; i < arr.length; i += QTD_CAMPOS_PLANILHA2) {
      const quantidadeAtos = Number(arr[i]);
      if (Number.isNaN(quantidadeAtos)) {
        toast.error(MSG_COLAR_FORMATO_INVALIDO);
        return;
      }
      novoArr.push({
        quantidadeAtos: quantidadeAtos,
        valorCertidao: toDecimalNumber(arr[i + 1]),
      });
    }

    setDespesasCertidao(novoArr);
  }

  async function obterDados() {
    try {
      const result0 = await fetch(endpoints.despesasGerais);
      if (!result0.ok) {
        alert(`Problemas ao obter despesas gerais: ${result0.statusText}.`);
      } else {
        const jsonDespesasGerais = await result0.json();
        setDespesasGerais(jsonDespesasGerais);
      }
    } catch (err) {
      console.error("Erro ao obter despesas gerais:", err.message);
    }

    try {
      const result1 = await fetch(endpoints.despesasRegistro);
      if (!result1.ok) {
        alert("Erro ao obter despesas registro!");
      }
      const jsonDespesasRegistro = await result1.json();
      setDespesasRegistroFixas(jsonDespesasRegistro.fixas);
      setDespesasRegistroPorValor(jsonDespesasRegistro.porValorRegistro);
    } catch (err) {
      console.error("Erro ao obter despesas registro:", err.message);
      throw err;
    }

    try {
      const result2 = await fetch(endpoints.despesasCertidao);
      if (!result2.ok) {
      }
      setDespesasCertidao(await result2.json());
    } catch (err) {
      console.error("Erro ao obter despesas certidão:", err.message);
      throw err;
    }
  }

  async function testeSenha() {
    const hashSenha = sha256(senha);
    if (hashSenha === hashSenhaVisitante) {
      // TODO: implementar senha visitante: pd apenas visualizar config.
      alert("Implementar senha visitante...");
      return;
    } else if (hashSenha === hashSenhaDev) {
      console.log("Carregar configs. como dev...");
    } else {
      console.log("Buscando pwd servidor...");
      setIsLoading(true);
      const result = await fetch(endpoints.pwd);
      const json = await result.json();
      if (hashSenha !== json.pwd) {
        setIsLoading(false);
        setTimeout(() => {
          const inpPwd = document.querySelector('input[type="password"]');
          if (inpPwd) {
            inpPwd.select();
            inpPwd.focus();
          }
          toast.warn("Senha inválida!");
        }, 10);
        return;
      }
    }

    console.log("Obtendo configs...");
    await obterDados();
    setIsLoading(false);
    setModoConfig(ModosConfig.Menu);
  }

  function limparSenhaAlteracao() {
    setSenhaNova("");
    setSenhaNovaRepetir("");
  }

  async function enviarDados() {
    switch (modoConfig) {
      case ModosConfig.DespesasGerais:
        if (!validarDespesasGerais()) return false;

        try {
          await toast.promise(enviarDespesasGerais, {
            pending: "Salvando despesas gerais...",
            success: "Salvo!",
            error: "Erro ao enviar despesas gerais.",
          });
          return true;
        } catch (err) {
          toast.error("Erro ao enviar despesas gerais.");
          return false;
        }

      case ModosConfig.DespesasRegistro:
        if (!validarDespesasRegistro()) return false;

        try {
          await toast.promise(enviarDespesasRegistro, {
            pending: "Salvando despesas registro...",
            success: "Salvo!",
            error: "Erro ao salvar",
          });
          return true;
        } catch (err) {
          toast.error("Erro ao enviar despesas de registro.");
          return false;
        }

      case ModosConfig.DespesasCertidao:
        if (!validarDespesasCertidao()) return false;

        try {
          await toast.promise(enviarDespesasCertidao, {
            pending: "Salvando despesas certidão...",
            success: "Salvo!",
            error: "Erro ao salvar",
          });
          return true;
        } catch (err) {
          toast.error("Erro ao enviar despesas certidão.");
          return false;
        }

      case ModosConfig.AlterarSenha:
        if (!validarSenhaAlterar()) return false;

        return await toast.promise(enviarSenhaNova, {
          pending: "Salvando senha...",
          success: "Salvo!",
          error: "Erro ao salvar",
        });

      default:
        toast.error(MSG_MODO_CONFIG_INDEFINIDO);
    }
  }

  async function enviarSenhaNova() {
    const hashSenha = await sha256(senhaNova);
    const dados = { pwd: hashSenha };

    let result;
    try {
      result = await fetch(endpoints.pwd, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
    } catch (err) {
      const msg = `Erro ao enviar nova senha: ${err.message}`;
      console.log(msg);
      toast.error(msg);
      return false;
    }

    const json = await result.json();
    if (!result.ok) {
      console.log(json.message);
      toast.error("Problemas ao enviar nova senha");
      return false;
    }

    console.log(json);
    return true;
  }

  async function enviarDespesasGerais() {
    let result;
    try {
      result = await fetch(endpoints.despesasGerais, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(despesasGerais),
      });
    } catch (err) {
      throw Error(`Erro ao enviar despesas gerais: ${err.message}`);
    }

    const json = await result.json();
    if (!result.ok) {
      throw Error(`Problemas ao enviar despesas gerais: ${result.message}.`);
    }

    console.log("despesasGerais enviado com sucesso", json);
    return true;
  }

  async function enviarDespesasRegistro() {
    const dados = {
      fixas: despesasRegistroFixas,
      porValorRegistro: despesasRegistroPorValor,
    };

    try {
      const result = await fetch(endpoints.despesasRegistro, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!result.ok) throw new Error("Problemas ao enviar despesas registro.");

      const json = await result.json();
      console.log("despesasRegistro enviado com sucesso:", json);
      return true;
    } catch (err) {
      throw new Error("Erro ao enviar despesas registro:", err.message);
    }
  }

  async function enviarDespesasCertidao() {
    try {
      const result = await fetch(endpoints.despesasCertidao, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(despesasCertidao),
      });

      if (!result.ok) throw new Error("Problemas ao enviar despesas certidão.");

      const json = await result.json();
      console.log("despesasCertidao enviado com sucesso:", json);
      return true;
    } catch (err) {
      throw new Error("Erro ao enviar despesas certidão:", err.message);
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    if (modoConfig !== ModosConfig.PedirSenha) {
      limparSenhaAlteracao();
      setModoConfig(ModosConfig.Menu);
    } else {
      setEhConfiguracao(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (modoConfig === ModosConfig.PedirSenha) {
      await testeSenha();
      return;
    }

    console.log("Clicou no submit do form config.");
    console.debug("despesasGerais:", despesasGerais);
    console.debug("despesasRegistroFixas:", despesasRegistroFixas);
    console.debug("DespesasRegistroPorValor:", despesasRegistroPorValor);
    console.debug("despesasCertidao:", despesasCertidao);
    if ((await enviarDados()) === false) return;

    setModoConfig(ModosConfig.Menu);
  }

  if (isLoading) return <h4 style={{ color: "white" }}>Carregando...</h4>;

  const conteudoSenha = (
    <Senha
      id="inpPwd"
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
    />
  );

  const conteudoMenu = (
    <Menu setModoConfig={setModoConfig} setEhConfiguracao={setEhConfiguracao} />
  );

  const conteudoDespesasGerais = (
    <DespesasGerais
      valores={despesasGerais}
      onChange={handleChangeDespesasGerais}
    />
  );

  const conteudoDespesasRegistro = (
    <DespesasRegistro
      despesasRegistroFixas={despesasRegistroFixas}
      despesasRegistroPorValor={despesasRegistroPorValor}
      onChangeDespesasRegistroFixas={handleChangeDespesasRegistroFixas}
      onChangeDespesasRegistroPorValor={handleChangeDespesasRegistroPorValor}
      onPaste={handleColarDespesasRegistro}
      onClickAdicionar={handleAdicionarDespesasRegistroPorValor}
      onClickLimpar={handleLimparDespesasRegistroPorValor}
    />
  );

  const conteudoDespesasCertidao = (
    <DespesasCertidao
      valores={despesasCertidao}
      onChange={handleChangeDespesasCertidao}
      onClickAdicionar={handleAdicionarDespesasCertidao}
      onClickLimpar={handleLimparDespesasCertidao}
      onPaste={handleColarDespesasCertidao}
    />
  );

  const conteudoSenhaAlterar = (
    <SenhaAlterar
      value1={senhaNova}
      value2={senhaNovaRepetir}
      onChange1={(e) => setSenhaNova(e.target.value)}
      onChange2={(e) => setSenhaNovaRepetir(e.target.value)}
    />
  );

  const conteudoOpcoes = {
    [ModosConfig.PedirSenha]: {
      conteudo: conteudoSenha,
      exibirBotoesPersistencia: true,
    },
    [ModosConfig.Menu]: {
      conteudo: conteudoMenu,
      exibirBotoesPersistencia: false,
    },
    [ModosConfig.DespesasGerais]: {
      conteudo: conteudoDespesasGerais,
      exibirBotoesPersistencia: true,
    },
    [ModosConfig.DespesasRegistro]: {
      conteudo: conteudoDespesasRegistro,
      exibirBotoesPersistencia: true,
    },
    [ModosConfig.DespesasCertidao]: {
      conteudo: conteudoDespesasCertidao,
      exibirBotoesPersistencia: true,
    },
    [ModosConfig.AlterarSenha]: {
      conteudo: conteudoSenhaAlterar,
      exibirBotoesPersistencia: true,
    },
  };

  return (
    <div className="Configuracao">
      <form onSubmit={handleSubmit}>
        {conteudoOpcoes[modoConfig].conteudo}
        {conteudoOpcoes[modoConfig].exibirBotoesPersistencia && (
          <BotoesPersistencia
            onCancel={handleCancel}
            centralizarBotoes={modoConfig === ModosConfig.PedirSenha}
          />
        )}
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
}
