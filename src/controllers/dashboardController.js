import pool from '../config/db.js';

function responderError(next, error) {
  next(error);
}

export async function obtenerDashboard(req, res, next) {
  try {
    const [metricas] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM libros) AS totalLibros,
        (SELECT COUNT(*) FROM libros WHERE estado = 'disponible') AS librosDisponibles,
        (SELECT COUNT(*) FROM usuarios WHERE activo = 1) AS usuariosActivos,
        (SELECT COUNT(*) FROM prestamos WHERE estado = 'activo') AS prestamosActivos,
        (SELECT COUNT(*) FROM prestamos WHERE estado = 'activo' AND fechaDevolucion < CURRENT_DATE) AS prestamosAtrasados,
        (SELECT COUNT(*) FROM prestamos WHERE estado = 'devuelto') AS prestamosDevueltos,
        (SELECT COUNT(*) FROM prestamos) AS totalPrestamos`);

    const [librosPopulares] = await pool.query(`
      SELECT l.id, l.titulo, l.autor, COUNT(p.id) AS cantidadPrestamos
      FROM libros l
      LEFT JOIN prestamos p ON p.libroId = l.id
      GROUP BY l.id, l.titulo, l.autor
      ORDER BY cantidadPrestamos DESC, l.titulo ASC
      LIMIT 5`);

    const [prestamosPorVencer] = await pool.query(`
      SELECT p.id, p.fechaPrestamo, p.fechaDevolucion, p.estado,
             l.titulo AS libro, CONCAT(u.nombres, ' ', u.apellidos) AS usuario
      FROM prestamos p
      INNER JOIN libros l ON l.id = p.libroId
      INNER JOIN usuarios u ON u.id = p.usuarioId
      WHERE p.estado = 'activo'
        AND p.fechaDevolucion BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
      ORDER BY p.fechaDevolucion ASC`);

    const [actividadMensual] = await pool.query(`
      SELECT DATE_FORMAT(fechaPrestamo, '%Y-%m') AS mes,
             COUNT(*) AS prestamos,
             SUM(estado = 'devuelto') AS devoluciones
      FROM prestamos
      WHERE fechaPrestamo >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(fechaPrestamo, '%Y-%m')
      ORDER BY mes ASC`);

    const metrica = metricas[0];
    const totalPrestamos = Number(metrica.totalPrestamos) || 0;
    const tasaDevolucion = totalPrestamos
      ? Number(((Number(metrica.prestamosDevueltos) / totalPrestamos) * 100).toFixed(1))
      : 0;

    return res.json({
      metricas: {
        totalLibros: Number(metrica.totalLibros),
        librosDisponibles: Number(metrica.librosDisponibles),
        usuariosActivos: Number(metrica.usuariosActivos),
        prestamosActivos: Number(metrica.prestamosActivos),
        prestamosAtrasados: Number(metrica.prestamosAtrasados),
        tasaDevolucion
      },
      librosPopulares,
      prestamosPorVencer,
      actividadMensual
    });
  } catch (error) {
    return responderError(next, error);
  }
}

export async function listarLibros(req, res, next) {
  try {
    const { busqueda = '', categoria, estado, pagina = 1, limite = 20 } = req.query;
    const cantidad = Math.min(100, Math.max(1, Number(limite) || 20));
    const paginaSegura = Math.max(1, Number(pagina) || 1);
    const desplazamiento = (paginaSegura - 1) * cantidad;
    const condiciones = [];
    const valores = [];

    if (busqueda) {
      condiciones.push('(titulo LIKE ? OR autor LIKE ? OR isbn LIKE ?)');
      valores.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
    }
    if (categoria) {
      condiciones.push('categoria = ?');
      valores.push(categoria);
    }
    if (estado) {
      condiciones.push('estado = ?');
      valores.push(estado);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const [libros] = await pool.query(
      `SELECT * FROM libros ${where} ORDER BY titulo ASC LIMIT ? OFFSET ?`,
      [...valores, cantidad, desplazamiento]
    );
    const [total] = await pool.query(`SELECT COUNT(*) AS total FROM libros ${where}`, valores);

    return res.json({ data: libros, paginacion: { pagina: paginaSegura, limite: cantidad, total: Number(total[0].total) } });
  } catch (error) {
    return responderError(next, error);
  }
}