# clases para los modelos de la base de datos y su manipulación
from cs50 import SQL
import uuid
import dotenv
import os

dotenv.load_dotenv()

db = SQL(os.getenv('DATA_BASE'))

class Product:
    
    def _init_(self, name, price, stock, description, category, id):
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
                    VALUES(?, ?, ?, ?, ?, ?, ?)''', 
                    self.id, self.name, self.price, self.stock, self.description, self.images, self.category)

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
        pass
    @staticmethod
    def get_product_by_id(id):
        pass
    @staticmethod
    def get_products_by_category(category):
        pass

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

    def save_to_db(self):
        exist_order = db.execute("SELECT * FROM orders WHERE id = ?", self.id)
        if exist_order:
            db.execute("UPDATE orders SET nombre = ?, email = ?, telefono = ?, envio = ?, direccion = ?, country = ?, status = ?, precio_total = ?, timestamp = ? WHERE id = ?", 
                    self.nombre, self.email, self.telefono, self.envio, self.direccion, self.country, self.status, self.precio_total, self.timestamp, self.id)
        else:
            db.execute('''INSERT INTO orders (id, nombre, email, telefono, envio, direccion, country, status, precio_total, timestamp) 
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
                    self.id, self.nombre, self.email, self.telefono, self.envio, self.direccion, self.country, self.status, self.precio_total, self.timestamp)
    
    def update_status(self, new_status):
        self.status = new_status
        self._update_db('status', self.status)

    def delete_from_db(self):
        db.execute("DELETE FROM orders WHERE id = ?", self.id)
    
    def _update_db(self, field, value):
        db.execute("UPDATE orders SET ? = ? WHERE id = ?", field, value, self.id)

    # METODOS ESTATICOS PARA OBTENER ORDENES
    @staticmethod
    def get_orders():
        pass
    @staticmethod
    def get_orders_by_status(status):
        pass
    @staticmethod
    def get_order_by_id(id):
        pass