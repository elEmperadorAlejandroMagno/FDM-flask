# clases para los modelos de la base de datos y su manipulación
from cs50 import SQL
import uuid
import dotenv
import os

dotenv.load_dotenv()

db = SQL(os.getenv('DATA_BASE'))

class Product:
    
    def __init__(self, id, name, price, stock, description, category):
        self.id = id or str(uuid.uuid4())
        self.name = name
        self.price = price
        self.stock = stock or 0
        self.description = description
        self.category = category
        self.images = self.get_images()

    def get_images(self):
        images = db.execute("SELECT * FROM product_images WHERE product_id = ?", self.id)
        return [image['image'] for image in images]
        
    @staticmethod
    def get_images_static(product_id):
        images = db.execute("SELECT * FROM product_images WHERE product_id = ?", product_id)
        return [image['image'] for image in images]

    def add_image(self, image):
        image_id = str(uuid.uuid4())
        db.execute('''INSERT INTO product_images (id, product_id, image) 
                    VALUES (?, ?, ?)''', image_id, self.id, image)

    def save_to_db(self):
        exist_product = db.execute("SELECT * FROM products WHERE id = ?", self.id)
        if exist_product:
            db.execute("UPDATE PRODUCTS SET name = ?, price = ?, stock = ?, description = ?, category = ? WHERE id = ?", 
                    self.name, self.price, self.stock, self.description, self.category, self.id)
        else:
            db.execute('''INSERT INTO products (id, name, price, stock, description, category) 
                    VALUES(?, ?, ?, ?, ?, ?)''', 
                    self.id, self.name, self.price, self.stock, self.description, self.category)

    def update_name(self, new_name):
        self.name = new_name
        self._update_db('name', self.name)

    def update_stock(self, amount):
        self.stock += amount
        self._update_db('stock', self.stock)
    
    def is_in_stock(self):
        return self.stock > 0
    
    def apply_discount(self, porcentage):
        if 0 < porcentage < 100:
            self.price -= self.price * (porcentage / 100)
            self._update_db('price', self.price)

    def update_price(self, new_price):
        if new_price > 0:
          self.price = new_price
          self._update_db('price', self.price)
    
    def update_description(self, new_description):
        self.description = new_description
        self._update_db('description', self.description)

    def update_image(self, new_image, image_id):
        db.execute("UPDATE product_images SET image = ? WHERE image_id = ?", new_image, image_id)

    def delete_image(self, image_id):
        db.execute("DELETE FROM product_images WHERE image_id = ?", image_id)

    def _update_db(self, field, value):
        db.execute("UPDATE products SET ? = ? WHERE id = ?", field, value, self.id)

    def delete_from_db(self):
        db.execute("DELETE FROM products WHERE id = ?", self.id)
        db.execute("DELETE FROM product_images WHERE product_id = ?", self.id)

    # METODOS ESTATICOS PARA OBTENER PRODUCTOS
    @staticmethod
    def get_products():
        """Obtiene todos los productos de la base de datos junto con sus imágenes."""
        query = """
            SELECT p.id, p.name, p.price, p.stock, p.description, p.category FROM products p
        """
        products = {}
        rows = db.execute(query)
        for row in rows:
            if row['id'] not in products:
                products[row['id']] = {
                    'id': row['id'],
                    'name': row['name'],
                    'title': row['name'],  # Mapeo para compatibilidad con template
                    'price': row['price'],
                    'stock': row['stock'],
                    'description': row['description'],
                    'category': row['category'],
                    'images': Product.get_images_static(row['id'])
                }
        return list(products.values())
    @staticmethod
    def get_products_by_category(category):
        """Obtiene todos los productos de la base de datos junto con sus imágenes."""
        query = """
            SELECT p.id, p.name, p.price, p.stock, p.description, p.category FROM products p
            WHERE p.category = ?
        """
        products = {}
        rows = db.execute(query, category)
        for row in rows:
            if row['id'] not in products:
                products[row['id']] = {
                    'id': row['id'],
                    'name': row['name'],
                    'title': row['name'],  # Mapeo para compatibilidad con template
                    'price': row['price'],
                    'stock': row['stock'],
                    'description': row['description'],
                    'category': row['category'],
                    'images': Product.get_images_static(row['id'])
                }
        return list(products.values())
    @staticmethod
    def get_product_by_id(id):
        """Obtiene todos los productos de la base de datos junto con sus imágenes."""
        query = """
            SELECT p.id, p.name, p.price, p.stock, p.description, p.category FROM products p
            WHERE p.id = ?
        """
        row = db.execute(query, id)

        if not row:
            return None
        
        product = {
                    'id': row[0]['id'],
                    'name': row[0]['name'],
                    'title': row[0]['name'],  # Mapeo para compatibilidad con template
                    'price': row[0]['price'],
                    'stock': row[0]['stock'],
                    'description': row[0]['description'],
                    'category': row[0]['category'],
                    'images': Product.get_images_static(row[0]['id'])
                }
        return product
    
class Salsa(Product):
    def __init__(self, id, name, price, stock, description, category="Salsa", spicy_level=None):
        super().__init__(id, name, price, stock, description, category)
        self.spicy_level = spicy_level

    def update_spicy_level(self, new_level):
        self.spicy_level = new_level

class Merch(Product):
    def __init__(self, id, name, price, stock, description, category="Merch", talla=None, color=None):
        super().__init__(id, name, price, stock, description, category)
        self.talla = talla
        self.color = color

    def update_talla(self, nueva_talla):
        self.talla = nueva_talla

    def update_color(self, nuevo_color):
        self.color = nuevo_color

class Orders:
    def __init__(self, id, nombre, email, telefono, envio, direccion, precio_total, timestamp = None, country = 'Uruguay', status = 'Pendiente'):
        self.id = id or str(uuid.uuid4())
        self.nombre = nombre
        self.email = email
        self.telefono = telefono
        self.envio = envio
        self.direccion = direccion
        self.country = country
        self.status = status
        self.precio_total = precio_total
        self.timestamp = timestamp
        self.products = self.get_products()

    def save_to_db(self):
        exist_order = db.execute("SELECT * FROM orders WHERE id = ?", self.id)
        if exist_order:
            db.execute("UPDATE orders SET nombre = ?, email = ?, telefono = ?, envio = ?, direccion = ?, country = ?, status = ?, precio_total = ?, timestamp = ? WHERE id = ?", 
                    self.nombre, self.email, self.telefono, self.envio, self.direccion, self.country, self.status, self.precio_total, self.timestamp, self.id)
        else:
            db.execute('''INSERT INTO orders (id, nombre, email, telefono, envio, direccion, country, status, precio_total, timestamp) 
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
                    self.id, self.nombre, self.email, self.telefono, self.envio, self.direccion, self.country, self.status, self.precio_total, self.timestamp)
    
    def get_products(self):
        rows = db.execute('''
                SELECT op.product_id, op.cantidad, p.name, p.price FROM order_products op
                        JOIN products p ON op.product_id = p.id
                        WHERE op.order_id = ?
                ''', self.id)
        return [{'product_id': row['product_id'], 'cantidad': row['cantidad'], 'name': row['name'], 'price': row['price']} for row in rows]

    def add_product(self, product_id, cantidad):
        db.execute(''' INSERT INTO order_products(order_id, product_id, cantidad)
                    VALUES(?, ?, ?)''', self.id, product_id, cantidad)

    def update_status(self, new_status):
        self.status = new_status
        self._update_db('status', self.status)

    def delete_product(self, product_id):
        db.execute("DELETE FROM order_products WHERE order_id = ? AND product_id = ?", self.id, product_id)

    def delete_from_db(self):
        db.execute("DELETE FROM orders WHERE id = ?", self.id)
        db.execute("DELETE FROM order_products WHERE order_id = ?", self.id)
    
    def _update_db(self, field, value):
        db.execute("UPDATE orders SET ? = ? WHERE id = ?", field, value, self.id)

    # METODOS ESTATICOS PARA OBTENER ORDENES
    @staticmethod
    def get_orders():
        rows = db.execute('''SELECT * FROM orders''')
        orders = []
        for row in rows:
            order = Orders(row['id'], row['nombre'], row['email'], row['telefono'], row['envio'], row['direccion'], row['precio_total'], row['timestamp'], row['country'], row['status'])
            orders.append(order)
        return orders
    @staticmethod
    def get_orders_by_status(status):
        rows = db.execute('''SELECT * FROM orders WHERE status = ?''', status)
        orders = []
        for row in rows:
            order = Orders(row['id'], row['nombre'], row['email'], row['telefono'], row['envio'], row['direccion'], row['precio_total'], row['timestamp'], row['country'], row['status'])
            orders.append(order)
        return orders
    @staticmethod
    def get_order_by_id(id):
        row = db.execute('''SELECT * FROM orders WHERE id = ?''', id)
        if not row:
            return None
        order = Orders(row['id'], row['nombre'], row['email'], row['telefono'], row['envio'], row['direccion'], row['precio_total'], row['timestamp'], row['country'], row['status'])
        return order
    

class User:
    def __init__(self, id, username, password, email, is_admin = 0):
        self.id = id or str(uuid.uuid4())
        self.username = username
        self.password = password
        self.email = email
        self.is_admin = is_admin

    def save_to_db(self):
        exist_user = db.execute("SELECT * FROM users WHERE id = ?", self.id)
        if exist_user:
            db.execute("UPDATE users SET username = ?, password = ?, email = ?, is_admin = ? WHERE id = ?", 
                    self.username, self.password, self.email, self.is_admin, self.id)
        else:
            db.execute('''INSERT INTO users (id, username, password, email, is_admin) 
                    VALUES(?, ?, ?, ?, ?)''', 
                    self.id, self.username, self.password, self.email, self.is_admin)
