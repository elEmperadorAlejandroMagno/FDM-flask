import requests
from cs50 import SQL
import os
import dotenv
from utils.models import Product
from utils.constants import FIELDS 

dotenv.load_dotenv()

db = SQL(os.getenv('DATABASE_URL'))

def get_products():
    """Obtiene todos los productos de la base de datos junto con sus imágenes."""
    query = """
        SELECT p.id, p.name, p.price, p.stock, p.description, p.category, pi.image FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
    """
    products = {}
    rows = db.execute(query)
    for row in rows:
        if row['id'] not in products:
            products[row['id']] = {
                'id': row['id'],
                'name': row['name'],
                'price': row['price'],
                'stock': row['stock'],
                'description': row['description'],
                'category': row['category'],
                'images': []
            }
        if row['image']:
            products[row['id']]['images'].append(row['image'])
    return list(products.values())

def get_products_by_category(category):
    """Obtiene todos los productos de la base de datos junto con sus imágenes."""
    query = """
        SELECT p.id, p.name, p.price, p.stock, p.description, p.category, pi.image FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.category = ?
    """
    products = {}
    rows = db.execute(query, category)
    for row in rows:
        if row['id'] not in products:
            products[row['id']] = {
                'id': row['id'],
                'name': row['name'],
                'price': row['price'],
                'stock': row['stock'],
                'description': row['description'],
                'category': row['category'],
                'images': []
            }
        if row['image']:
            products[row['id']]['images'].append(row['image'])
    return list(products.values())

def get_product_by_id(id):
    """Obtiene todos los productos de la base de datos junto con sus imágenes."""
    query = """
        SELECT p.id, p.name, p.price, p.stock, p.description, p.category, pi.image FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
    """
    rows = db.execute(query, id)

    if not rows:
        return None
    
    product = {
                'id': rows['id'],
                'name': rows['name'],
                'price': rows['price'],
                'stock': rows['stock'],
                'description': rows['description'],
                'category': rows['category'],
                'images': [row['image'] for row in rows if row['image']]
            }
    return product

def create_product(data, images):
    product = Product(**data)
    product.save_to_db()

    for image in images:
        product.add_image(image)
    return True

def update_single_field(id, field, value):
    #! Actualiza un solo campo del producto
    if field not in FIELDS:
        return False
    PRODUCT_DATA = get_product_by_id(id)
    product = Product(**PRODUCT_DATA)
    if field == 'name':
        product.update_name(value)
    if field == 'stock':
        product.update_stock(value)
    elif field == 'price':
        product.update_price(value)
    elif field == 'description':
        product.update_description(value)
    elif field == 'image':
        product.update_image(value)
    else:
        return False
    return True

def update_product(id, data):
    #!actualiza el producto completo (no recomendado)
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
