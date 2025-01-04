from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
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
  cart = []
  if request.method == 'POST':
    cart = request.json.get('cart', [])
    return jsonify(cart)
  if request.method == 'GET':
    SAUCES = get_products_sauce()
    MERCH = get_products_merch()
    CART_ITEMS = cart
    print(f"cart: {CART_ITEMS}")
    print(f"cart: {cart}")

    return render_template("index.html", sauces = SAUCES, merchandising = MERCH, cart = CART_ITEMS, url = URL)

@app.route('/product-page')
def get_product():
   if request.method == 'GET':
    id = request.args.get('id')
    PRODUCT = get_product_by_id(id)
    return render_template("product.html", details = PRODUCT, url = URL["API_URL"])
   
@app.route('/cart-page', methods=['GET', 'POST'])
def get_cart_info():
  #  if request.method == 'POST':
  #    cart = request.json.get('cart', [])
  #    return jsonify(cart)
   if request.method == 'GET':
    # cart = request.cookies.get('cart')
    # print(f"cart: {cart}")  
    # CART_ITEMS = json.loads(cart)
    return render_template("cart.html")
   
