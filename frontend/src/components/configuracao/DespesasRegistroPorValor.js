import React from "react";
import InputNumber from "../InputNumber";

export default function DespesasRegistroPorValor({ valores, onChange }) {
  return (
    <>
      {valores.map((item, index) => (
        <div key={index} className="formGroup">
          <div>
            <label htmlFor={`inpValor${index}`}>Valor Registro Máx.:</label>
            <InputNumber 
              id={`inpValor${index}`}
              value={item.valor}
              name='valor'
              onChange={onChange(index)}
              autoFocus={index === valores.length - 1 ? true : false}
            />
          </div>
          <div>
            <label htmlFor={`inpEmolumentos${index}`}>Emolumentos:</label>
            <InputNumber
              id={`inpEmolumentos${index}`}
              value={item.emolumentos}
              name='emolumentos'
              onChange={onChange(index)}
            />
          </div>
          <div>
            <label htmlFor={`inpFundos${index}`}>Fundos:</label>
            <InputNumber
              id={`inpFundos${index}`}
              value={item.fundos}
              name='fundos'
              onChange={onChange(index)}
            />
          </div>
        </div>
      ))}
    </>
  );
}