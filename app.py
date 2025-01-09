from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from utils.services import get_products_sauce, get_products_merch, get_product_by_id
from utils.helpers import uru, login_required, sumItemPrices
from utils.url import URL
from utils.envios import LISTA_ENVIOS
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

@app.route('/home', methods=['GET'])
def home():
  if request.method == 'GET':
        SAUCES = get_products_sauce()
        MERCH = get_products_merch()
        return render_template("index.html", sauces=SAUCES, merchandising=MERCH, url=URL)

@app.route('/product-page')
def get_product():
   if request.method == 'GET':
    id = request.args.get('id')
    PRODUCT = get_product_by_id(id)
    return render_template("product.html", details = PRODUCT, url = URL["API_URL"])

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    if request.method == 'POST':
        product = request.get_json()
        cart_cookie = request.cookies.get('cart', '[]')
        CART_ITEMS = json.loads(cart_cookie)
        for item in CART_ITEMS:
            if item['id'] == product['id']:
                product['quantity'] += item['quantity']
        CART_ITEMS.append(product)
        response = jsonify({'status': 'success'})
        response.set_cookie('cart', json.dumps(CART_ITEMS))
        return response
    
@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    if request.method == 'POST':
        id = request.form.get('id')
        cart_cookie = request.cookies.get('cart', '[]')
        CART_ITEMS = json.loads(cart_cookie)
        for item in CART_ITEMS:
            if item['id'] == id:
                CART_ITEMS.remove(item)
                break
        response = redirect('/cart-page')
        response.set_cookie('cart', json.dumps(CART_ITEMS))
        return response

@app.route('/cart-page')
def get_cart_info():
   if request.method == 'GET':
    cart_cookie = request.cookies.get('cart', '[]')
    CART_ITEMS = json.loads(cart_cookie)
    subtotal = sumItemPrices(CART_ITEMS)
    total = subtotal
    return render_template("cart.html", cart = CART_ITEMS, envio = 0, options_envio = LISTA_ENVIOS , subtotal = subtotal, total = total)

@app.route('/envio', methods=['POST'])
def get_envio():
   if request.method == 'POST':
      data = request.get_json()
      envio = data.get('envio')
      cart_cookie = request.cookies.get('cart', '[]')
      CART_ITEMS = json.loads(cart_cookie)
      subtotal = sumItemPrices(CART_ITEMS)
      total = subtotal
      if envio and envio.isdigit():
        envio = int(envio)
      elif envio in ['Free', 'Por definir']:
        envio = 0
      else:
        envio = 0
      total += envio
      return jsonify({'total': total, 'subtotal': subtotal, 'envio': envio})

@app.route('/adminBoard')
def panel_admin():
  return render_template("panel.html")