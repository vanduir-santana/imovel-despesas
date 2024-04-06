// dbit22
const HASH_SENHA_PADRAO =
  "b093c8aca395d0c093275dc4f3368502e4bf106f6d19b72a952c744b8280cffa";
const PATH_CONFIGS = "./configs";
export const corsAllowedOrigins = [
  "http://localhost:3000",
  "http://172.16.0.22:3000",
];

export const pathConfigs = {
  pwd: `${PATH_CONFIGS}/pwd.json`,
  despesasGerais: `${PATH_CONFIGS}/despesas-gerais.json`,
  despesasRegistro: `${PATH_CONFIGS}/despesas-registro.json`,
  despesasCertidao: `${PATH_CONFIGS}/despesas-certidao.json`,
};

export const despesasGeraisValoresPadrao = {
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
};

export const formatoMonetario = Intl.NumberFormat("pt-br", {
  style: "currency",
  currency: "BRL",
});

export const outrasConfigs = {
  valorVendaMinimo: 10_000,
  percMaxFinanciamento: 80,
};

