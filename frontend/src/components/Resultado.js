
export default function Resultado({ dados, setExibirResultado }) {

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={3}><div className="logo Resultado-logo"></div></th>
          </tr>
          <tr>
            <th className="Resultado-titulo" colSpan={3}>Despesas Processo de Financiamento</th>
          </tr>
          <tr>
            <th colSpan={3}>..:: {dados.nomeCliente} ::..</th>
          </tr>
          <tr>
            <th className="Resultado-cabecalho">Item</th>
            <th className="Resultado-cabecalho">Valor</th>
            <th className="Resultado-cabecalho">Despesa</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th colSpan={3} scope="rowgroup">Despesas Prefeitura</th>
          </tr>

          <tr>
            <td>Valor Venda</td>
            <td>{dados.despesasPrefeitura.venda.valor}</td>
            <td></td>
          </tr>
          <tr>
            <td>Financiamento</td>
            <td>{dados.despesasPrefeitura.financiamento.valor}</td>
            <td>{dados.despesasPrefeitura.financiamento.despesa}</td>
          </tr>
          <tr>
            <td>Recursos Próprios</td>
            <td>{dados.despesasPrefeitura.recursosProprios.valor}</td>
            <td>{dados.despesasPrefeitura.recursosProprios.despesa}</td>
          </tr>
          <tr>
            <td colSpan={2}>Certidão + Taxa</td>
            <td>{dados.despesasPrefeitura.certidao}</td>
          </tr>
          <tr>
            <td className="Resultado-total" colSpan={2}>Total Despesas Prefeitura</td>
            <td className="Resultado-total">{dados.despesasPrefeitura.total}</td>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <th colSpan={3} scope="rowgroup">Despesas Cartório</th>
          </tr>

          <tr>
            <td>Prenotação</td>
            <td></td>
            <td>{dados.despesasCartorio.prenotacao}</td>
          </tr>
          <tr>
            <td>Registro Venda</td>
            <td>{dados.despesasCartorio.registroVenda.valor}</td>
            <td>{dados.despesasCartorio.registroVenda.despesa}</td>
          </tr>
          <tr>
            <td>Registro Alienação</td>
            <td>{dados.despesasCartorio.registroAlienacao.valor}</td>
            <td>{dados.despesasCartorio.registroAlienacao.despesa}</td>
          </tr>
          <tr>
            <td>Certidão de Inteiro Teor</td>
            <td style={{textAlign: "right"}}>Quant. Atos<br />{dados.despesasCartorio.certidaoInteiroTeor.quantidadeAtos}</td>
            <td>{dados.despesasCartorio.certidaoInteiroTeor.despesa}</td>
          </tr>
          <tr>
            <td colSpan={2}>Desconto</td>
            <td>{dados.despesasCartorio.desconto}</td>
          </tr>
          <tr>
            <td className="Resultado-total" colSpan={2}>Total Despesas Cartório</td>
            <td className="Resultado-total">{dados.despesasCartorio.total}</td>
          </tr>
        </tbody>
    
        <tbody>
          <tr>
            <th colSpan={3} scope="rowgroup">Despesas Banco (CEF)</th>
          </tr>

          <tr>
            <td colSpan={2}>Despesas</td>
            <td>{dados.despesasBanco.total}</td>
          </tr>
          <tr>
            <td colSpan={2} className="Resultado-total Resultado-totalGeral">Total de Despesas</td>
            <td className="Resultado-total Resultado-totalGeral" colSpan={2}>{dados.totalDespesas}</td>
          </tr>
        </tbody>

      </table>

      <button onClick={(e) => setExibirResultado(false)}>
        Voltar
      </button>
    </>
  );
}
