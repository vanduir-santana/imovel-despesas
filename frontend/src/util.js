export const SENHA_TAMANHO_MIN = 4;
export const CASAS_DECIMAIS_PADRAO = 2;

// Mensagens configuração
export const MSG_LIMPAR = 'Deseja limpar? Isso irá limpar todos os itens por valor de imóvel.';
export const MSG_LIMPAR2 = 'Deseja limpar? Isso irá limpar todos os itens das despesas por certidão.';
export const MSG_COLAR = 'Deseja colar despesas por valor de imóvel? Isso irá substituir os valores atuais.';
export const MSG_COLAR2 = 'Deseja colar despesas de certidão MCMV? Isso irá substituir os valores atuais.';
export const MSG_COLAR_FORMATO_INVALIDO = 'É preciso colar de acordo com o formato definido na planilha.';
export const MSG_VALORES_INVALIDOS = 'É preciso que os valores sejam diferentes de zero e maiores ou iguais aos valores anteriores.';
export const MSG_MODO_CONFIG_INDEFINIDO = 'Modo de configuração não definido!';
export const MSG_PERC_VALOR_FINANCIAMENTO_ZERO = 'Favor digitar percentual sobre valor do financiamento.';
export const MSG_PERC_VALOR_RECURSOS_PROPRIOS_ZERO = 'Favor digitar percentual do do valor de recursos próprios.';
export const MSG_CERTIDAO_PREFEITURA = 'Favor digitar valor da certidão.';
export const MSG_BANCO_VALOR_FINANCIAMENTO_MAX_ZERO = 'Favor digitar Valor Financiamento Máx.';
export const MSG_BANCO_VALOR_TAXA_FIXA_ZERO = 'Favor digitar Taxa pra Valor Financiamento Máx.';
export const MSG_BANCO_PERC_ZERO = 'Favor digitar Percentual pra Valores acima do Valor Financiamento Máx.';
export const MSG_MATRICULA_ZERO = 'Matrícula não pode ter valor zero!';
export const MSG_PRENOTACAO_ZERO = 'Prenotação não pode ter valor zero!';
export const MSG_DIGITAR_SENHA = 'Favor digitar senha e repetir em seguida.';
export const MSG_SENHAS_DIFERENTES = 'Senhas precisam ser idênticas.';
export const MSG_SENHA_PEQUENA = `Senha precisa ter no mínimo ${SENHA_TAMANHO_MIN} caracteres.`;
export const MSG_DESPESAS_POR_VALOR_IMOVEL_VAZIAS = 'Você precisa adicionar as depesas por valor de imóvel.';
export const MSG_DESPESAS_CERTIDAO_VAZIAS = 'Você precisa adicionar as depesas de certidão.';

export const hashSenhaDev = 'c4739e99f9a6edf332fd40888f7f960996a92f7b0f2b10c309aaeef4bcf66957';
export const hashSenhaVisitante = 'f457b4e2f0d8b9dbdf73a28a32ac8a5bf1d6bfc4ec9d0fe94a470d5929d4f701';

export const Formatos = {
  Decimal: 'decimal',
  Monetario: 'monetario',
  Inteiro: 'inteiro'
};

export const formatoMonetario = Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL',
});

export const formatoDecimal = Intl.NumberFormat('pt-br', {
  style: 'decimal',
  minimumFractionDigits: CASAS_DECIMAIS_PADRAO
});

export const ModosConfig = {
  PedirSenha: 'PedirSenha',
  Menu: 'Menu',
  DespesasGerais: 'DespesasGerais',
  DespesasRegistro: 'DespesasRegistro',
  DespesasCertidao: 'DespesasCertidao',
  DespesasBanco: 'DespesasBanco',
  AlterarSenha: 'AlterarSenha',
  Voltar: 'Voltar'
};

const API_URL = (process.env.NODE_ENV === 'production' ? 
  process.env.REACT_APP_PRODUCTION_API_URL :
  process.env.REACT_APP_DEVELOPMENT_API_URL
);

export const endpoints = {
  pwd: `${API_URL}/configs/pwd`,
  despesasGerais: `${API_URL}/configs/despesas-gerais`,
  despesasRegistro: `${API_URL}/configs/despesas-registro`,
  despesasCertidao: `${API_URL}/configs/despesas-certidao`,
  simular: `${API_URL}/simular/`
};

/**
 * Varre um array de objetos e procura campos que são menores [ou iguais] a
 * itens anteriores. Procura também valores zerados.
 * 
 * @param {Array} arr array contendo valores.
 * @param {Boolean} apenasValoresMenores quando true aceita valores iguais a
 * anteriores.
 * @returns {Array} retorna um array contendo o primeiro índice e a propriedade
 * do objeto onde falhou ou retorna um array contendo o índice = -1 e a
 * propriedade vazia quando não houver falha.
 */
export function validarArrObjsNum(arr, apenasValoresMenores=false) {
  const msg = (prop, indice, valor, valorAntecessor, bol) => {
    const igual = bol ? 'ou igual' : '';
    return `${prop} no indice ${indice} é igual ${valor}. 
    Precisa ser maior que ${igual} seu antecessor = ${valorAntecessor}`;
  };

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j <= i; j++) {
      for (const prop in arr[j]) {
        if (arr[j][prop] === 0) {
          console.log(`${prop} = 0 no índice ${j}. Não pode!`);
          return [j, prop];
        }
        if (
          j > 0 && 
          typeof(arr[j][prop]) === 'number' &&
          ((!apenasValoresMenores && arr[j][prop] <= arr[j-1][prop]) ||
           (apenasValoresMenores && arr[j][prop] < arr[j-1][prop]))
        ) {
          console.log(
            msg(prop, j, arr[j][prop], arr[j-1][prop], apenasValoresMenores)
          );
          return [j, prop];
        }
      }
    }
  }
  return [-1, ''];
}

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);