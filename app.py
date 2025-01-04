from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from utils.services import get_products_sauce, get_products_merch, get_product_by_id
from utils.helpers import uru, login_required
from utils.url import URL

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

@app.route('/home')
def home():
  if request.method == 'GET':
    SAUCES = get_products_sauce()
    MERCH = get_products_merch()
    CART_ITEMS = [
      {
        "title": "Habanero chocolate",
      "price": 400, "quantity": 2, 
      "total": 800, 
      "image": f"{URL["API_URL"]}/images/products/fondo transparente/habanero-choco-transp.png"
      },
      {
        "title": "Carolina Reaper y ajo",
        "price": 400,
        "quantity": 1,
        "total": 400,
        "image": f"{URL["API_URL"]}/images/products/fondo transparente/Reaper-frente-transp.png"
      },
      {
        "title": "Salsa de Arándanos con ghost pepper",
        "price": 400,
        "quantity": 1,
        "total": 400,
        "image": f"{URL["API_URL"]}/images/products/fondo transparente/Arándanos-fondo-transp_edited_edited.png"
      },
            {
        "title": "Habanero chocolate",
      "price": 400, "quantity": 2, 
      "total": 800, 
      "image": f"{URL["API_URL"]}/images/products/fondo transparente/habanero-choco-transp.png"
      },
      {
        "title": "Carolina Reaper y ajo",
        "price": 400,
        "quantity": 1,
        "total": 400,
        "image": f"{URL["API_URL"]}/images/products/fondo transparente/Reaper-frente-transp.png"
      }
    ]

    return render_template("index.html", sauces = SAUCES, merchandising = MERCH, url = URL, cart = CART_ITEMS)

@app.route('/product-page')
def get_product():
   if request.method == 'GET':
    id = request.args.get('id')
    PRODUCT = get_product_by_id(id)
    return render_template("product.html", details = PRODUCT, url = URL["API_URL"])
   
@app.route('/cart-page')
def get_cart_info():
   if request.method == 'GET':
    # cart = request.cookies.get('cart')
    cart = [
      {
       "title": "Habanero chocolate",
       "price": 400, 
       "quantity": 2, 
       "total": 800, 
       "image": f"{URL["API_URL"]}/images/products/fondo transparente/habanero-choco-transp.png"
       },
      {
        "title": "Carolina Reaper y ajo",
        "price": 400,
        "quantity": 1,
        "total": 400,
        "image": f"{URL["API_URL"]}/images/products/fondo transparente/Reaper-frente-transp.png"
      },
      {
        "title": "Salsa de Arándanos con ghost pepper",
        "price": 400,
        "quantity": 1,
        "total": 400,
        "image": f"{URL["API_URL"]}/images/products/fondo transparente/Arándanos-fondo-transp_edited_edited.png"
      }
      ]
    return render_template("cart.html", cart = cart)
   