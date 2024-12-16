import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Bienvenido a la API de Cloen');
});

router.get('/test', (req, res) => {
  const data = {
    name: 'Cloen',
    website: 'cloen.com',
  };
  res.json(data);
});

export default router;
