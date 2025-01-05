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

def totalPack(price, quantity):
    price = price.strip('$U')
    price = float(price)    
    total = price * quantity
    return total

    
def sumItemPrices(items):
    total = 0;
    for item in items:
        price = item['price'].strip('$U')
        price = float(price)    
        total += price
    return total