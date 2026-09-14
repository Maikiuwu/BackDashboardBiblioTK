# BackDashboardBiblioTK — Servicio de estadísticas del panel

Parte del sistema BiblioTK (ver `../CLAUDE.md`). Entrega datos agregados para el panel de administración.

- **Puerto:** 3002 (`PORT` en `.env`)
- **Arranque:** `npm run dev` (`node --watch src/app.js`, se recarga solo)
- **Dependencias clave:** express 5, mysql2, cors, dotenv (versiones fijas, sin `^`)
- **Postman:** colección en `postman/` y `.postman/`

## Estructura

- `src/app.js` — express + CORS con `credentials: true` + router en `/DashboardBibliotk` + middleware global de errores (500 con `error.message`)
- `src/config/db.js` — pool mysql2 y `testConnection()` (**no ejecuta ninguna consulta**)
- `src/router/routerBiblioTK.js`
- `src/controllers/dashboardController.js` — `obtenerDashboard`. Los errores se pasan con `next(error)`.

## Endpoints

| Método | Ruta | Controlador | Respuesta |
|---|---|---|---|
| GET | `/DashboardBibliotk/health` | inline | `{ message }` |
| GET | `/DashboardBibliotk/Udashboard` | `obtenerDashboard` | `{ roles: { admin, usuario, superadmin } }` |

`obtenerDashboard` hace un `LEFT JOIN` de una lista fija de roles contra `usuarios`, así los roles sin usuarios devuelven 0. La usa `FrontBiblioTK/src/service/UserService.js` → página `UserDashboard.jsx`.

## Problemas conocidos

- **`/Udashboard` no tiene autenticación**: cualquiera puede consultarlo, y el front tampoco envía la cookie.
- El `README.md` está desactualizado: indica el puerto 3000 y rutas `/api/bibliotk/...` (incluida `/libros`) que no existen.
- `.env` define `JWT_SECRET`, pero este servicio no lo usa.
- `testConnection()` no prueba realmente la conexión.
