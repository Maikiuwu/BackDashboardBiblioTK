import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routerBiblioTK from './router/routerBiblioTK.js';
import { testConnection } from './config/db.js';

const app = express();
const puerto = Number(process.env.PORT) || 3002;

app.use(express.json());
app.use(cors({
    origin: [
      "http://localhost:5172",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5145",
    ],
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/DashboardBibliotk', routerBiblioTK);

// Los detalles del error se quedan en la consola: al cliente solo le llega un mensaje genérico
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') {
    return res
      .status(400)
      .json({ message: 'El cuerpo de la solicitud no es un JSON válido' });
  }

  console.error('Error del servidor:', error);
  return res.status(error.status || 500).json({ message: 'Error interno del servidor' });
});

async function iniciarServidor() {
  try {
    await testConnection();
    app.listen(puerto, () => {
      console.log(`Servidor BiblioTK corriendo en el puerto ${puerto}`);
    });
  } catch {
    process.exitCode = 1;
  }
}

iniciarServidor();
