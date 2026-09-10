# BiblioTK Servidor

Servidor para el dashboard de una biblioteca, organizado con la arquitectura mostrada en el proyecto de referencia:

```text
src/
	config/db.js
	controllers/dashboardController.js
	router/routerBiblioTK.js
	app.js
```

## Ejecutar

```bash
npm install
```

1. Copia `.env.example` como `.env` y configura las credenciales de la base de datos existente.
2. Inicia el servidor con `npm run dev`.

El servidor escucha en `http://localhost:3000`.

## Rutas

- `GET /api/bibliotk/health`: comprueba el servidor.
- `GET /api/bibliotk/dashboard`: devuelve el conteo de usuarios por rol.
- `GET /api/bibliotk/libros`: lista libros con `busqueda`, `categoria`, `estado`, `pagina` y `limite`.
## Ejemplo de respuesta del dashboard:

```json
{
	"roles": {
		"admin": 2,
		"usuario": 248,
		"superadmin": 1
	}
}
```

El frontend será el cliente de este servidor. La configuración de CORS permite conectar un frontend en `localhost:5173` o `localhost:5174` mediante `CLIENT_ORIGIN`.
