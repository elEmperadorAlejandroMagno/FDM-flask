import sqlite3

conn = sqlite3.connect('test_database.db')
c = conn.cursor()

def main():
  # Tabla de productos
  c.execute('''
  CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      description TEXT,
      category TEXT
  )
  ''')

  # Tabla de imágenes de productos
  c.execute('''
  CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id)
  )
  ''')

  # Tabla de órdenes
  c.execute('''
  CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT,
      envio TEXT,
      direccion TEXT,
      country TEXT DEFAULT 'Uruguay',
      status TEXT DEFAULT 'Pendiente',
      precio_total REAL,
      timestamp TEXT
  )
  ''')

  # Tabla de productos en órdenes
  c.execute('''
  CREATE TABLE IF NOT EXISTS order_products (
      order_id TEXT,
      product_id TEXT,
      cantidad INTEGER,
      PRIMARY KEY(order_id, product_id),
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
  )
  ''')

  conn.commit()
  conn.close()

if __name__ == '__main__':
  main()
  print("Base de datos y tablas creadas correctamente.")