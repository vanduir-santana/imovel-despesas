
export default function BotoesPorValor({ onClickAdicionar, onClickLimpar,  btnLimparDisabled }) {
  return (
    <div className="Configuracao-botoesPorValor">
      <button
        onClick={onClickAdicionar}>
          +
      </button>
      <button
        onClick={onClickLimpar}
        disabled={(btnLimparDisabled)}>
          Limpar
      </button>
    </div>
  );
}