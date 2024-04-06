import { 
  CASAS_DECIMAIS_PADRAO, Formatos, formatoDecimal, formatoMonetario
} from "../util";

const RE_NUM = /(\d)|(Control|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Home|End|Tab|Enter)/;
const RE_REM_CHARS = /(R\$\s|\.|,)/g;

export default function InputNumber(
  { id, name, value, autoFocus, onChange, formato, casasDecimais, maxLength, onPaste }
) {

  let numericValue = 0;
  let formatedValue = '';

  casasDecimais ??= CASAS_DECIMAIS_PADRAO;
  formato ??= Formatos.Decimal;
  maxLength ??= 20;
  const numberFormat = getNumberFormat();
  formatedValue = value ? formatDefaultValue(value) : formatDefaultValue(0);

  function getNumberFormat() {
    switch (formato) {
      case Formatos.Decimal:
        return formatoDecimal;
      case Formatos.Monetario:
        return formatoMonetario;
      case Formatos.Inteiro:
        casasDecimais = 0;
        return null;
      default:
        formato = Formatos.Decimal;
        return formatoDecimal;
    }
  }

  function formatDefaultValue(val) {
    if (typeof(val) === 'number') {
      numericValue = val;
    } else if (typeof(val) === 'string') {
      numericValue = Number(val);
      if (Number.isNaN(numericValue)) numericValue = 0;
    } else {
      numericValue = 0;
    }
    return numberFormat ? numberFormat.format(numericValue) : numericValue;
  }

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 'v') {
      console.log('InputNumber: aceitar colar através de atalho.');
      return;
    }

    if (
      formato !== Formatos.Inteiro &&
      (e.target.value.length === 0 || e.target.selectionStart === 0) &&
      e.key === '0'
    ) {
      console.log('InputNumber: não pode começar com valor 0.');
      e.preventDefault();
      return;
    }

    if (!RE_NUM.test(e.key)) {
      console.log(`InputNumber: caracter não aceito [${e.key}]!`);
      e.preventDefault();
      return;
    }
  }

  function handleChange(e) {
    const val = e.target.value.replace(RE_REM_CHARS, '');
    e.target.value = toFormatedNumber(val);

    if (onChange) {
      console.debug('InputNumber onChange, numericValue:', numericValue);
      e.target.numericValue = numericValue; 
      onChange(e);
    }
  }

  function handlePaste(e) {
    e.preventDefault();

    if (typeof(onPaste) === 'function') {
      onPaste(e);
      return;
    }

    // ao colar procura primeira sequência numérica até encontrar
    // um caracter não numérico como espaço, por exemplo.
    let strNums = '';
    let foundNum = false;
    const pasteText = e.clipboardData.getData('text');
    for (const char of pasteText) {
      if (char !== ' ' && !Number.isNaN(Number(char))) {
        foundNum = true;
        strNums += char;
      } else if (foundNum && char !== '.' && char !== ',') {
        break;
      }
    }
    if (strNums === '') {
      console.log('InputNumber: Colar texto que contenham números.');
      return;
    }
    e.target.value = toFormatedNumber(strNums);
    // força o handleChange quando colar pra executar como controlled component
    handleChange(e);
  }

  function toFormatedNumber(val) {
    val ??= 0;
    if (numberFormat) {
      numericValue = Number(val) / 10 ** casasDecimais;
      if (Number.isNaN(numericValue)) numericValue = 0;
      return numberFormat.format(numericValue);
    }
    numericValue = Number(val);
    return numericValue;
  }

  return (
    <input
      type="text"
      id={id}
      name={name}
      inputMode="decimal"
      maxLength={maxLength}
      value={formatedValue}
      autoFocus={autoFocus}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
    />
  );
}