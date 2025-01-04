from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from utils.services import get_products_sauce, get_products_merch, get_product_by_id
from utils.helpers import uru, login_required
from utils.url import URL
import json

app = Flask(__name__)

if __name__ == '__main__': 
  app.run()

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

app.jinja_env.filters["uru"] = uru

Session(app)

db = SQL("sqlite:///fdm.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/')
def hello():
  return "Hello, world!"

@app.route('/home', methods=['GET', 'POST'])
def home():
  if request.method == 'POST':
        cart = request.json.get('cart', [])
        response = jsonify(cart)
        response.set_cookie('cart', json.dumps(cart), max_age=60*60*24*30)  # Guardar el carrito en cookies por 30 días
        return response
  if request.method == 'GET':
        SAUCES = get_products_sauce()
        MERCH = get_products_merch()
        cart_cookie = request.cookies.get('cart', '[]')
        try:
            CART_ITEMS = json.loads(cart_cookie)
        except json.JSONDecodeError:
            CART_ITEMS = []
        return render_template("index.html", sauces=SAUCES, merchandising=MERCH, url=URL, cart=CART_ITEMS)

@app.route('/product-page')
def get_product():
   if request.method == 'GET':
    id = request.args.get('id')
    PRODUCT = get_product_by_id(id)
    cart_cookie = request.cookies.get('cart', '[]')
    try:
        CART_ITEMS = json.loads(cart_cookie)
    except json.JSONDecodeError:
        CART_ITEMS = []
    return render_template("product.html", details = PRODUCT, url = URL["API_URL"], cart = CART_ITEMS)
   
@app.route('/cart-page')
def get_cart_info():
   if request.method == 'GET':
    cart_cookie = request.cookies.get('cart', '[]')
    CART_ITEMS = json.loads(cart_cookie)
    return render_template("cart.html", cart = CART_ITEMS)
   
