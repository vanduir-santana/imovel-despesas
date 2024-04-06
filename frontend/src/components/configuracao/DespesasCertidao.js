import InputNumber from "../InputNumber";
import BotoesPorValor from "./BotoesPorValor";

export default function DespesasCertidao({
  valores,
  onChange,
  onPaste,
  onClickAdicionar,
  onClickLimpar,
}) {
  return (
    <div className="DespesasCertidao formGroup">
      {valores.map((item, index) => (
        <div key={index} className="formGroup">
          <div>
            <label htmlFor={`inpQuantidadeAtos${index}`}>
              Quantidade de Atos:
            </label>
            <InputNumber
              id={`inpQuantidadeAtos${index}`}
              name="quantidadeAtos"
              type="text"
              maxLength={2}
              casasDecimais={0}
              formato={"inteiro"}
              value={item.quantidadeAtos}
              onChange={onChange(index)}
              onPaste={onPaste}
            />
          </div>
          <div>
            <label htmlFor={`inpValorCertidao${index}`}>
              Valor da Certidão:
            </label>
            <InputNumber
              id={`inpValorCertidao${index}`}
              name="valorCertidao"
              value={item.valorCertidao}
              onChange={onChange(index)}
            />
          </div>
        </div>
      ))}
      <BotoesPorValor
        onClickAdicionar={onClickAdicionar}
        onClickLimpar={onClickLimpar}
        btnLimparDisabled={valores.length === 0}
      />
    </div>
  );
}

