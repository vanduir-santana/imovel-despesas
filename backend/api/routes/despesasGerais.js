import { Router } from 'express';
import { readFile, writeFile } from 'fs';
import { pathConfigs, despesasGeraisValoresPadrao } from '../../util.js';

const router = Router();

router.get('/', (req, res, next) => {
  const arq = pathConfigs.despesasGerais;
  console.log(`Lendo ${arq}.`);
  readFile(arq, (err, data) => {
    if (err) {
      if (err.errno === -4058) {
        console.log(`${arq} não existe.`);
        return res.json(despesasGeraisValoresPadrao);
      }

      console.error(`Erro ao ler ${arq}.`);
      console.error(err);
      return res.status(400).json(err);
    }

    res.json(JSON.parse(data));
  });
});

router.post('/', (req, res, next) => {
  const arq = pathConfigs.despesasGerais;
  const dados = JSON.stringify(req.body);
  console.log('Escrevendo', arq);
  writeFile(arq, dados, (err) => {
    if (err) {
      console.log(`Erro ao escrever ${arq}.`);
      return res.status(400).json(err);
    }

    res.status(201).json({
      message: `Dados salvos em ${arq}.`
    });
  });
});

export { router as despesasGeraisRoutes };