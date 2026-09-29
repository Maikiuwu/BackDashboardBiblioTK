# BackDashboardBiblioTK — Servicio de estadísticas del panel

Parte del sistema BiblioTK (ver `../CLAUDE.md`). Entrega datos agregados para el panel de administración.

- **Puerto:** 3002 (`PORT` en `.env`)
- **Arranque:** `npm run dev` (`node --watch src/app.js`, se recarga solo)
- **Dependencias clave:** express 5, mysql2, cors, dotenv (versiones fijas, sin `^`)
- **Postman:** colección en `postman/` y `.postman/`

## Estructura

- `src/app.js` — express + CORS con `credentials: true` + router en `/DashboardBibliotk` + middleware global de errores (mensaje genérico, sin filtrar el detalle). Arranca solo si `testConnection()` (un `SELECT 1` real) funciona.
- `src/config/db.js` — pool mysql2 y `testConnection()` real
- `src/router/routerBiblioTK.js`
- `src/controllers/dashboardController.js` — `obtenerDashboard`. Los errores se pasan con `next(error)`.

## Endpoints

| Método | Ruta | Controlador | Respuesta |
|---|---|---|---|
| GET | `/DashboardBibliotk/health` | inline | `{ message }` |
| GET | `/DashboardBibliotk/Udashboard` | `obtenerDashboard` | `{ roles: { admin, usuario, superadmin } }` |

`obtenerDashboard` hace un `LEFT JOIN` de una lista fija de roles contra `usuarios`, así los roles sin usuarios devuelven 0. La usa `BiblioTK-front-superadmin/src/service/UserService.js` → página `UserDashboard.jsx`.

## Problemas conocidos

- **`/Udashboard` no tiene autenticación** — a propósito: `BiblioTK-front-superadmin` lo consume sin sesión, igual convención que las lecturas públicas de `MaterialesBiblioTK`.
- El `README.md` está desactualizado: indica el puerto 3000 y rutas `/api/bibliotk/...` (incluida `/libros`) que no existen.
- `.env` define `JWT_SECRET`, pero este servicio no lo usa.
