import InputNumber from "../InputNumber";
import { formatoMonetario } from "../../util";

export default function DespesasGerais({ valores, onChange }) {
  return (
    <div className="DespesasGerais formGroup">
      <div className="formGroup">
        <h3>Despesas Prefeitura</h3>
        <div>
          <label htmlFor="inpPercValorFinanciamento">Sobre valor financiamento (%):</label>
          <InputNumber
            id="inpPercValorFinanciamento"
            name="prefeitura.percValorFinanciamento"
            formato="decimal"
            maxLength={5}
            autoFocus={true}
            value={valores.prefeitura.percValorFinanciamento}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="inpPercValorRecursosProprios">Sobre valor recursos próprios (%):</label>
          <InputNumber
            id="inpPercValorRecursosProprios"
            name="prefeitura.percValorRecursosProprios"
            formato="decimal"
            maxLength={5}
            value={valores.prefeitura.percValorRecursosProprios}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="inpCertidao">Certidão + Taxa (R$):</label>
          <InputNumber
            id="inpCertidao"
            name="prefeitura.certidao"
            formato="decimal"
            maxLength={5}
            value={valores.prefeitura.certidao}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="formGroup">
        <h3>Despesas Banco (CEF)</h3>
        <div>
          <label htmlFor="inpValorFinanciamentoMax">Valor Financiamento Máx. (R$):</label>
          <InputNumber
            id="inpValorFinanciamentoMax"
            name="banco.valorFinanciamentoMax"
            formato="decimal"
            value={valores.banco.valorFinanciamentoMax}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="inpTaxaFixaValorMax">Taxa Fixa Valor Financiamento Máx. (R$):</label>
          <InputNumber
            id="inpTaxaFixaValorMax"
            name="banco.taxaFixaValorMax"
            formato="decimal"
            value={valores.banco.taxaFixaValorMax}
            onChange={onChange}
          />
        </div>
        <div>
          <label
            htmlFor="inpTaxaPercAcimaValorMax"
          >
            Financ. acima de {formatoMonetario.format(valores.banco.valorFinanciamentoMax)} (%):
          </label>
          <InputNumber
            id="inpTaxaPercAcimaValorMax"
            name="banco.taxaPercAcimaValorMax"
            formato="decimal"
            maxLength={5}
            value={valores.banco.taxaPercAcimaValorMax}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}