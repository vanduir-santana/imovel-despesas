import DespesasRegistroFixas from "./DespesasRegistroFixas";
import DespesasRegistroPorValor from "./DespesasRegistroPorValor";
import BotoesPorValor from "./BotoesPorValor";

export default function DespesasRegistro({ 
  despesasRegistroFixas, despesasRegistroPorValor, 
  onChangeDespesasRegistroFixas, onChangeDespesasRegistroPorValor,
  onPaste, onClickAdicionar, onClickLimpar
}) {
  return (
    <div className="Configuracao-porValor">
      <h3>Despesas Registro</h3>
      <p>
        É possível importar os dados de configuração de Despesas de Registro. 
        Para isso é necessário copiar da 'Tabela de Custas Registro'
        selecionando todos os campos e linhas e em seguida colando aqui nessa
        tela, no campo Matrícula.
      </p>
      <DespesasRegistroFixas
        valores={despesasRegistroFixas}
        onChange={onChangeDespesasRegistroFixas}
        onPaste={onPaste}
      />
      <h4>Despesas por valor do registro</h4>
      <DespesasRegistroPorValor
        valores={despesasRegistroPorValor}
        onChange={onChangeDespesasRegistroPorValor} 
      />
      <BotoesPorValor
        onClickAdicionar={onClickAdicionar}
        onClickLimpar={onClickLimpar}
        btnLimparDisabled={(despesasRegistroPorValor.length === 0)}
      />
    </div>
  );
}

