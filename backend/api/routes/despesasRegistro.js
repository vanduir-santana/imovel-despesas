import { readFile, writeFile } from 'fs';
import { Router } from 'express';
import { pathConfigs } from '../../util.js';

const router = Router();

router.get('/', (req, res, next) => {
  const arq = pathConfigs.despesasRegistro;
  console.log(`Lendo ${arq}`);
  readFile(arq, (err, data) => {
    if (err) {
      if (err.errno === -4058) {
        console.log(`Arquivo ${arq} não existe`);
        return res.send({
          fixas: {},
          porValorRegistro: []
        });
      }

      console.log(`Erro ao ler ${arq}.`);
      console.log(err);
      return res.status(400).json(err);
    }

    res.send(JSON.parse(data));
  });
});

router.post('/', (req, res, next) => {
  const arq = pathConfigs.despesasRegistro;
  const dados = JSON.stringify(req.body);
  console.log(`Escrevendo ${arq}`);
  writeFile(arq, dados, (err) => {
    if (err) {
      console.log(`Erro ao escrever ${arq}: ${err.message}`);
      return res.status(400).json(err);
    }
    res.status(201).json({
      message: `Dados salvos em ${arq}`
    });
  });
});

export { router as despesasRegistroRoutes };