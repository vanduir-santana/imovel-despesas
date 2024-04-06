import { ModosConfig } from "../../util";

export default function Menu({ setModoConfig, setEhConfiguracao }) {
  const handleClick = (modoConfig) => (e) => {
    e.preventDefault();
    if (modoConfig !== ModosConfig.Voltar) {
      console.log("Menu config. modo:", modoConfig);
      setModoConfig(modoConfig);
    } else {
      console.log("Voltar, sair de configs...");
      setEhConfiguracao(false);
    }
  };

  return (
    <div className="Menu formGroup">
      <button onClick={handleClick(ModosConfig.DespesasGerais)}>
        Despesas Gerais
      </button>
      <button onClick={handleClick(ModosConfig.DespesasRegistro)}>
        Despesas Registro
      </button>
      <button onClick={handleClick(ModosConfig.DespesasCertidao)}>
        Despesas Certidão MCMV
      </button>
      <button onClick={handleClick(ModosConfig.AlterarSenha)}>
        Alterar Senha
      </button>
      <button onClick={handleClick(ModosConfig.Voltar)}>Voltar</button>
    </div>
  );
}
