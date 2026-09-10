import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routerBiblioTK from './router/routerBiblioTK.js';
import { testConnection }from './config/db.js'

const app = express();
const puerto = Number(process.env.PORT) || 3002;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/DashboardBibliotk', routerBiblioTK);

app.use((error, _req, res, _next) => {
  console.error('Error del servidor:', error);
  res.status(error.status || 500).json({ message: 'Error interno del servidor', error: error.message });
});

app.listen(puerto, async () => {
  console.log(`Servidor BiblioTK corriendo en el puerto ${puerto}`);

  testConnection();

});