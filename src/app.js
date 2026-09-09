import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routerBiblioTK from './router/routerBiblioTK.js';
import { probarConexion } from './config/db.js';

const app = express();
const puerto = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/bibliotk', routerBiblioTK);

app.use((error, _req, res, _next) => {
  console.error('Error del servidor:', error);
  res.status(error.status || 500).json({ message: 'Error interno del servidor', error: error.message });
});

app.listen(puerto, async () => {
  console.log(`Servidor BiblioTK corriendo en el puerto ${puerto}`);
  try {
    await probarConexion();
    console.log('Conexion a BD exitosa');
  } catch (error) {
    console.error('Error al conectar a la BD:', error.message);
  }
});