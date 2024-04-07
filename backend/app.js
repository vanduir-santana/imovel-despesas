import express from 'express';
import cors from 'cors';
import { corsAllowedOrigins } from './util.js';
import { pwdRoutes } from './api/routes/pwd.js';
import { despesasGeraisRoutes } from './api/routes/despesasGerais.js';
import { despesasRegistroRoutes } from './api/routes/despesasRegistro.js';
import { despesasCertidaoRoutes } from './api/routes/despesasCertidao.js'
import { simulacaoRoutes } from './api/routes/simulacao.js';

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: corsAllowedOrigins,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/configs/pwd', pwdRoutes);
app.use('/api/configs/despesas-gerais/', despesasGeraisRoutes);
app.use('/api/configs/despesas-registro/', despesasRegistroRoutes);
app.use('/api/configs/despesas-certidao/', despesasCertidaoRoutes);
app.use('/api/simular', simulacaoRoutes);

app.get(['/', '/api/'], (req, res) => {
  res.send({
    app: 'API Despesas Imóvel',
    version: '1.0.0',
    author: 'Vanduir Santana Medeiros'
  });
});

app.listen(port, () => {
  console.log('API Despesas imóvel escutando na porta:', port);
});
