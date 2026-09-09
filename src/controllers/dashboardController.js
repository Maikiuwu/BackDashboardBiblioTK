import pool from '../config/db.js';

function responderError(next, error) {
  next(error);
}

export async function obtenerDashboard(req, res, next) {
  try {
    const [roles] = await pool.query(`
      SELECT roles.nombre AS rol, COUNT(usuarios.id) AS cantidad
      FROM (
        SELECT 'admin' AS nombre
        UNION ALL SELECT 'usuario'
        UNION ALL SELECT 'superadmin'
      ) AS roles
      LEFT JOIN usuarios ON usuarios.rol = roles.nombre
      GROUP BY roles.nombre
      ORDER BY FIELD(roles.nombre, 'admin', 'usuario', 'superadmin')`);

    const conteoRoles = Object.fromEntries(
      roles.map(({ rol, cantidad }) => [rol, Number(cantidad)])
    );

    return res.json({ roles: conteoRoles });
  } catch (error) {
    return responderError(next, error);
  }
}