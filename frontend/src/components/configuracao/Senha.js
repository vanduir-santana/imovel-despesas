
export default function Senha({ id, name, value, onChange, autoFocus = true }) {
  return (
    <input
      id={id}
      name={name}
      type="password" 
      required
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
    />
  );
}