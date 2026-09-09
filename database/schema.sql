CREATE DATABASE IF NOT EXISTS bibliotk;
USE bibliotk;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(150) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  isbn VARCHAR(30) NOT NULL UNIQUE,
  estado ENUM('disponible', 'prestado', 'reservado') NOT NULL DEFAULT 'disponible',
  anioPublicacion SMALLINT,
  creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prestamos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  libroId INT NOT NULL,
  usuarioId INT NOT NULL,
  fechaPrestamo DATE NOT NULL DEFAULT (CURRENT_DATE),
  fechaDevolucion DATE NOT NULL,
  fechaDevolucionReal DATE,
  estado ENUM('activo', 'devuelto', 'vencido') NOT NULL DEFAULT 'activo',
  creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prestamo_libro FOREIGN KEY (libroId) REFERENCES libros(id),
  CONSTRAINT fk_prestamo_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);

CREATE INDEX idx_prestamos_estado ON prestamos (estado);
CREATE INDEX idx_prestamos_fecha_devolucion ON prestamos (fechaDevolucion);