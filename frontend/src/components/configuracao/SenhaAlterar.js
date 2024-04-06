import Senha from "./Senha";

export default function SenhaAlterar({ value1, value2, onChange1, onChange2 }) {

  return (
    <div className="SenhaAlterar formGroup">
      <div>
        <label htmlFor="inpSenha">Nova Senha:</label>
        <Senha
          id={"inpSenha"}
          value={value1}
          onChange={onChange1}
          autoFocus={true}
        />
      </div>
      <div>
        <label htmlFor="inpSenhaRepetir">Repetir Senha:</label>
        <Senha
          id={"inpSenhaRepetir"}
          value={value2}
          onChange={onChange2}
          autoFocus={false}
        />
      </div>
    </div>
  );
}