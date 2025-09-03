from functools import wraps
from flask import session, redirect
import os
from werkzeug.utils import secure_filename

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function

def uru(value):
    """Format value as URU."""
    try:
        value = float(value)
        return f"$U{value:,.2f}"
    except (ValueError, TypeError):
        return value

def sumItemPrices(items):
    total = 0;
    for item in items:
        price = item['price']
        price = float(price)    
        total += price * item['quantity']
    return total

def get_ID_product_list(products):
    product_ID_list = [product['id'] for product in products]
    product_ID_str = ','.join(map(str, product_ID_list))
    return product_ID_str

def get_quantity_product_list(products):
    product = [product['quantity'] for product in products]
    product_quantity_str = ','.join(map(str, product))
    return product_quantity_str

def save_images(files, upload_folder):
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    image_urls = []
    for file in files:
        if file and allowed_file(file):
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            image_urls.append(f"/static/images/{upload_folder}/{filename}")

    return image_urls


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
