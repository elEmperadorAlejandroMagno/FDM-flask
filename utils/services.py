import requests
from cs50 import SQL
import os
import dotenv
from utils.models import Product

dotenv.load_dotenv()

db = SQL(os.getenv('DATABASE_URL'))

def get_products():
    products = db.execute("SELECT * FROM products")
    for product in products:
        image_ids = product['images']
        images = db.execute("SELECT * FROM product_images WHERE id IN (?)", image_ids)
        product['images'] = [image['image'] for image in images]
    return products

def get_products_by_category(category):
    products = db.execute("SELECT * FROM products WHERE category = ?", category)
    for product in products:
        image_ids = product['images']
        images = db.execute("SELECT * FROM product_images WHERE id IN (?)", image_ids)
        product['images'] = [image['image'] for image in images]
    return products 

def get_product_by_id(id):
    product = db.execute("SELECT * FROM products WHERE id = ?", id)
    if product:
        product = product[0]
        image_ids = product['images']
        images = db.execute("SELECT * FROM product_images WHERE id IN (?)", image_ids)
        product['images'] = [image['image'] for image in images]
    return product

def update_product(id, data):
    PRODUCT_DATA = get_product_by_id(id)

    if not PRODUCT_DATA:
      return False
    
    product = Product(**PRODUCT_DATA)

    if 'name' in data:
       product.name = data['name']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if 'description' in data:
        product.description = data['description']
    if 'category' in data:
        product.category = data['category']
    if 'images' in data:
        for image_id in product.images:
            product.delete_image(image_id)
        for image in data['images']:
            product.add_image(image)

    product.save_to_db()
    return True

def delete_product(id):
    PRODUCT_DATA = get_product_by_id(id)

    if not PRODUCT_DATA:
      return False
    
    product = Product(**PRODUCT_DATA)
    product.delete_from_db()
    return True
    