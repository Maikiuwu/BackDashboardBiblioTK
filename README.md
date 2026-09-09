# BiblioTK Servidor

Servidor para el dashboard de una biblioteca, organizado con la arquitectura mostrada en el proyecto de referencia:

```text
src/
	config/db.js
	controllers/dashboardController.js
	router/routerBiblioTK.js
	app.js
database/schema.sql
```

## Ejecutar

```bash
npm install
```

1. Ejecuta `database/schema.sql` en MySQL.
2. Copia `.env.example` como `.env` y configura tus credenciales.
3. Inicia el servidor con `npm run dev`.

El servidor escucha en `http://localhost:3000`.

## Rutas

- `GET /api/bibliotk/health`: comprueba el servidor.
- `GET /api/bibliotk/dashboard`: devuelve métricas, libros populares, préstamos próximos y actividad mensual.
- `GET /api/bibliotk/libros`: lista libros con `busqueda`, `categoria`, `estado`, `pagina` y `limite`.
## Ejemplo de respuesta del dashboard:

```json
{
	"metricas": {
		"totalLibros": 1284,
		"librosDisponibles": 1198,
		"usuariosActivos": 248,
		"prestamosActivos": 86,
		"prestamosAtrasados": 4,
		"tasaDevolucion": 92.4
	}
}
```

El frontend será el cliente de este servidor. La configuración de CORS permite conectar un frontend en `localhost:5173` o `localhost:5174` mediante `CLIENT_ORIGIN`.
