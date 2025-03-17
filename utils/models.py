# clases para los modelos de la base de datos y su manipulación
from cs50 import SQL
import uuid
import dotenv
import os

dotenv.load_dotenv()

db = SQL(os.getenv('DATA_BASE'))

class Product:
    
    def _init_(self, name, price, stock, description, image, category, id):
        self.id = id or str(uuid.uuid4())
        self.name = name
        self.price = price
        self.stock = stock or 0
        self.description = description
        self.images = []
        self.category = category

    def add_image(self, image):
        image_id = str(uuid.uuid4())
        db.execute('''INSERT INTO product_images (id, product_id, image) 
                    VALUES (?, ?, ?)''', image_id, self.id, image)
        self.images.append(image_id)

    def save_to_db(self):
        db.execute('''INSERT INTO products (id, name, price, stock, description, image, category) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)''', self.id, self.name, self.price, self.stock, self.description, self.images, self.category)
        
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
        