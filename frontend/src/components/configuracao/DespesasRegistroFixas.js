import InputNumber from "../InputNumber"

export default function DespesasRegistroFixas(
  { valores, onChange, onPaste }
) {
  return (
    <div className="Configuracao-fixa1">
      <div className="formGroup">
        <div>
          <label htmlFor="inpMatricula">Matrícula:</label>
          <InputNumber
            id='inpMatricula'
            name='matricula'
            value={valores.matricula}
            autoFocus={true}
            onChange={onChange}
            onPaste={onPaste}
          />
        </div>
        <div>
          <label htmlFor="inpPrenotacao">Prenotação:</label>
          <InputNumber
            id='inpPrenotacao'
            name='prenotacao'
            value={valores.prenotacao}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}