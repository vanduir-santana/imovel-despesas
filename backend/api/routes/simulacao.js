import { Router } from "express";
import { readFile } from "node:fs/promises";
import { pathConfigs, outrasConfigs, formatoMonetario } from "../../util.js";

const formatar = formatoMonetario.format;
const router = Router();

router.post("/", async (req, res, next) => {
  /*
    - Validar dados
    - Validar dados de entrada
    - Validar arquivos config.:
    - Verificar se existem arquivos de configuração: despesasRegistro.json,
    despesasCertidao.json, despesasGerais.json, etc
    - Verificar consistência dos arquivos de despesas: valores zerados,
    ao menos um item setado.
    - Simular
  */
  const {
    nome,
    valorVenda,
    valorFinanciamento,
    quantidadeAtos,
    possuiDesconto,
  } = req.body;

  let msgErro = validarEntrada(
    nome,
    valorVenda,
    valorFinanciamento,
    quantidadeAtos,
  );

  if (msgErro)
    return res.status(400).json({
      message: msgErro,
    });

  const arqs = {
    despesasGerais: {
      path: pathConfigs.despesasGerais,
      json: null,
    },
    despesasRegistro: {
      path: pathConfigs.despesasRegistro,
      json: null,
    },
    despesasCertidao: {
      path: pathConfigs.despesasCertidao,
      json: null,
    },
  };

  msgErro = await lerArquivos(arqs);
  if (msgErro)
    return res.status(400).json({
      message: msgErro,
    });

  const despesasGerais = arqs.despesasGerais.json;
  const despesasRegistro = arqs.despesasRegistro.json;
  const despesasCertidao = arqs.despesasCertidao.json;

  msgErro = validarConfigs(
    despesasGerais,
    despesasRegistro,
    despesasCertidao,
    quantidadeAtos,
  );

  if (msgErro)
    return res.status(400).json({
      message: msgErro,
    });

  //-------------------------------------------------------
  console.log("Efetuar simulação.");
  const valorRecursosProprios = valorVenda - valorFinanciamento;

  const resultadoDespesasPrefeitura = calcDespesasPrefeitura(
    valorVenda,
    valorFinanciamento,
    valorRecursosProprios,
    despesasGerais.prefeitura,
  );

  const resultadoDespesasCartorio = calcDespesasCartorio(
    despesasRegistro.fixas,
    despesasRegistro.porValorRegistro,
    despesasCertidao,
    valorVenda,
    valorFinanciamento,
    quantidadeAtos,
    possuiDesconto,
  );

  const resultadoDespesasBanco = calcDespesasBanco(
    despesasGerais.banco,
    valorFinanciamento,
  );

  const total =
    resultadoDespesasPrefeitura.totalValor +
    resultadoDespesasCartorio.totalValor +
    resultadoDespesasBanco.totalValor;

  const resultadoSimulacao = {
    nomeCliente: nome,
    despesasPrefeitura: resultadoDespesasPrefeitura,
    despesasCartorio: resultadoDespesasCartorio,
    despesasBanco: resultadoDespesasBanco,
    totalDespesas: formatar(total),
  };

  //console.log(resultadoSimulacao);
  res.json(resultadoSimulacao);
});

function validarEntrada(nome, valorVenda, valorFinanciamento, quantidadeAtos) {
  if (nome === "" || nome.length < 4) return "Nome vazio ou muito curto.";

  if (valorVenda < outrasConfigs.valorVendaMinimo) {
    const valor = formatoMonetario.format(outrasConfigs.valorVendaMinimo);
    return `Valor Venda precisa ser de no mínimo ${valor}.`;
  }

  if (valorFinanciamento <= 0)
    return "Valor Financiamento precisa ser maior que zero.";

  const perc = outrasConfigs.percMaxFinanciamento;
  const valorFinanciamentoMax = valorVenda * (perc / 100);
  if (valorFinanciamento > valorFinanciamentoMax) {
    const valor = formatoMonetario.format(valorFinanciamentoMax);
    return `Valor Financiamento não pode ser maior que ${perc}% do Valor Venda: ${valor}`;
  }

  if (quantidadeAtos <= 0)
    return "Quantidade de Atos precisa ser maior que zero.";

  return "";
}

async function lerArquivos(oArqs) {
  for (const k in oArqs) {
    let path, data;
    try {
      path = oArqs[k].path;
      console.log(`Lendo ${path}.`);
      data = await readFile(path);
    } catch (err) {
      if (err.errno === -4058) {
        const msg = `${path} não existe, fazer configuração.`;
        console.log(msg);
        return msg;
      }

      console.error(`Erro ao ler ${path}:`);
      console.error(err);
      return err.message;
    }

    oArqs[k].json = JSON.parse(data);
  }

  return "";
}

function validarConfigs(
  despesasGerais,
  despesasRegistro,
  despesasCertidao,
  quantidadeAtos,
) {

  for (const [categoria, oValores] of Object.entries(despesasGerais)) {
    for (const [item, valor] of Object.entries(oValores)) {
      if (valor === 0) {
        console.log(`${categoria}.${item} não pode ter valor zerado!`);
        return "Valor zerado em Despesas Gerais, favor verificar configs.";
      }
    }
  }

  if (
    despesasRegistro.fixas.matricula === 0 ||
    despesasRegistro.fixas.prenotacao === 0
  ) {
    return "É preciso configurar Despesas Registro Fixas.";
  }

  if (despesasRegistro.porValorRegistro.length === 0) {
    return "É preciso configurar Despesas Registro por Valor do Imóvel.";
  }

  if (despesasCertidao.length === 0) {
    return "Despesas certidão vazia, favor configurar.";
  }

  const quantidadeAtosMax = Math.max(
    ...despesasCertidao.map((item) => item.quantidadeAtos),
  );
  if (quantidadeAtos > quantidadeAtosMax) {
    console.error("quantidadeAtosMax:", quantidadeAtosMax);
    return `Quantidade de atos não pode ser maior que ${quantidadeAtosMax}`;
  }

  return "";
}

function calcDespesasPrefeitura(
  valorVenda,
  valorFinanciamento,
  valorRecursosProprios,
  despesasPrefeitura,
) {
  const despesaSobreValorFinanciamento = () => {
    const perc = despesasPrefeitura.percValorFinanciamento;
    return valorFinanciamento * (perc / 100);
  };

  const despesaSobreValorRecursosProprios = () => {
    const perc = despesasPrefeitura.percValorRecursosProprios;
    return valorRecursosProprios * (perc / 100);
  };

  const despesasTotal = () => {
    const certidao = despesasPrefeitura.certidao;
    return [
      despesaSobreValorFinanciamento(),
      despesaSobreValorRecursosProprios(),
      certidao,
    ].reduce((prev, cur) => prev + cur);
  };

  const total = despesasTotal();

  return {
    venda: {
      valor: formatar(valorVenda),
      despesa: null,
    },
    financiamento: {
      valor: formatar(valorFinanciamento),
      despesa: formatar(despesaSobreValorFinanciamento()),
    },
    recursosProprios: {
      valor: formatar(valorRecursosProprios),
      despesa: formatar(despesaSobreValorRecursosProprios()),
    },
    certidao: formatar(despesasPrefeitura.certidao),
    total: formatar(total),
    totalValor: total,
  };
}

function calcDespesasCartorio(
  despesasRegistroFixas,
  despesasRegistroPorValor,
  despesasCertidao,
  valorVenda,
  valorFinanciamento,
  quantidadeAtos,
  possuiDesconto,
) {
  const prenotacao = despesasRegistroFixas.prenotacao;
  let totalDescontos = 0;

  const calcDespesasRegistroPorValor = (valor) => {
    const matricula = despesasRegistroFixas.matricula;

    const [despesasRegistroPorValorItem] = despesasRegistroPorValor.filter(
      (item, index) => {
        if (index === 0) {
          if (valor <= item.valor) return true;
        } else if (
          index === despesasRegistroPorValor.length - 1 &&
          valor > item.valor
        ) {
          return true;
        } else if (
          valor > despesasRegistroPorValor[index - 1].valor &&
          valor <= item.valor
        ) {
          return true;
        }
      },
    );

    if (!despesasRegistroPorValorItem) return 0;

    const emolumentos = despesasRegistroPorValorItem.emolumentos;
    const fundos = despesasRegistroPorValorItem.fundos;
    let descontoEmolumentos = 0,
      descontoFundos = 0;

    if (possuiDesconto) {
      const DESC_FATOR = 50 / 100;
      descontoEmolumentos = emolumentos * DESC_FATOR;
      descontoFundos = fundos * DESC_FATOR;
      totalDescontos += descontoEmolumentos + descontoFundos;
    }

    return [
      matricula,
      prenotacao,
      emolumentos - descontoEmolumentos,
      fundos - descontoFundos,
    ].reduce((prev, cur) => prev + cur);
  };

  const despesaCertidaoValor = () => {
    const certidaoItem = despesasCertidao.filter(
      (item) => item.quantidadeAtos === quantidadeAtos,
    );

    return certidaoItem[0].valorCertidao;
  };

  const despesaVenda = calcDespesasRegistroPorValor(valorVenda);
  const despesaAlienacao = calcDespesasRegistroPorValor(valorFinanciamento);
  const despesaCertidao = despesaCertidaoValor();

  const despesasTotal = () => {
    return prenotacao + despesaVenda + despesaAlienacao + despesaCertidao;
  };

  const total = despesasTotal();

  return {
    prenotacao: formatar(prenotacao),
    registroVenda: {
      valor: formatar(valorVenda),
      despesa: formatar(despesaVenda),
    },
    registroAlienacao: {
      valor: formatar(valorFinanciamento),
      despesa: formatar(despesaAlienacao),
    },
    certidaoInteiroTeor: {
      quantidadeAtos: quantidadeAtos,
      despesa: formatar(despesaCertidao),
    },
    desconto: formatar(totalDescontos),
    total: formatar(total),
    totalValor: total,
  };
}

function calcDespesasBanco(despesasBanco, valorFinanciamento) {
  const valorFinanciamentoMax = despesasBanco.despesasBanco;
  const taxaFixaValorMax = despesasBanco.taxaFixaValorMax;
  const taxaPercAcimaValorMax = despesasBanco.taxaPercAcimaValorMax;

  const total =
    valorFinanciamento <= valorFinanciamentoMax
      ? taxaFixaValorMax
      : valorFinanciamento * (taxaPercAcimaValorMax / 100);

  return {
    total: formatar(total),
    totalValor: total,
  };
}

export { router as simulacaoRoutes };

