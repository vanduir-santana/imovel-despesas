
export default function BotoesPersistencia(
  { onCancel, centralizarBotoes = false }
) {
  let className = 'Configuracao-botoesPersistencia';
  if (centralizarBotoes) className += ' botoesPersistenciaCentralizar';
  
  return (
    <div className={className}>
      <button type="button" onClick={onCancel}>
          Cancelar
      </button>
      <button type="submit">
          Enviar
      </button>
    </div>
  );
}