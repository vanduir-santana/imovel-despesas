import { readFile, writeFile } from 'fs';
import { Router } from 'express';
import { pathConfigs } from '../../util.js';

const router = Router();

router.get('/', (req, res, next) => {
  const arq = pathConfigs.despesasCertidao;
  console.log(`Lendo ${arq}`);
  readFile(arq, (err, data) => {
    if (err) {
      if (err.errno === -4058) {
        console.log(`${arq} não existe.`);
        return res.send([]);
      }

      console.log(`Erro ao ler ${arq}.`);
      console.log(err);
      return res.status(400).json(err);
    }

    res.send(JSON.parse(data));
  });
});

router.post('/', (req, res, next) => {
  const arq = pathConfigs.despesasCertidao;
  const dados = JSON.stringify(req.body);
  console.log(`Escrevendo ${arq}.`);
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

export { router as despesasCertidaoRoutes };