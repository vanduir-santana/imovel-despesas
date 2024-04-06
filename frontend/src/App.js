import './App.css';
import { useState } from 'react';
import FormCorretor from './components/FormCorretor';
import Configuracao from './components/configuracao/Configuracao';
import configImg from './assets/images/config.png';

function App() {
  const [ehConfiguracao, setEhConfiguracao] = useState(false);
  const [exibirResultado, setExibirResultado] = useState(false);

  function handleBtnConfigurar(e) {
    console.log('Clicou no botão configurar.');
    setEhConfiguracao(current => !current);
  }

  if (ehConfiguracao) {
    return (
      <div className='App'>
        <div className='App-container'>
          <div>
            <Configuracao setEhConfiguracao={setEhConfiguracao}/>
          </div>
        </div>
    </div>
    );
  }

  return (
    <div className='App'>
      {!exibirResultado && (
        <div className='App-containerBtnConfig'>
          <button onClick={handleBtnConfigurar}>
            <img src={configImg} alt='Config.'/>
          </button>
        </div>
      )}
      <div className='App-container'>
        <FormCorretor
          exibirResultado={exibirResultado}
          setExibirResultado={setExibirResultado}
        />
      </div>

    </div>
  );

}

export default App;
