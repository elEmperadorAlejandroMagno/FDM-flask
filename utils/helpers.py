from functools import wraps
from flask import session, redirect

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/adminBoard/login")
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
