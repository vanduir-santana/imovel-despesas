import express from 'express';
import { readFile, writeFile } from 'fs';
import { pathConfigs } from '../../util.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(`Lendo ${pathConfigs.pwd}.`);
  readFile(pathConfigs.pwd, (err, data) => {
    if (err) {
      res.status(400);
      return res.json(err);
    }
    res.send(JSON.parse(data));
  });
});

router.post('/', (req, res, next) => {
  console.log(`Escrevendo ${pathConfigs.pwd}`);
  const dados = JSON.stringify(req.body);
  writeFile(pathConfigs.pwd, dados, (err) => {
    if (err) {
      console.log('Erro ao escrever json pwd:', err.message);
      res.status(400)
      return res.json(err);
    }
    
    res.status(201).json({
      message: `Nova senha escrita no ${pathConfigs.pwd}`
    });
  });
});

export { router as pwdRoutes };