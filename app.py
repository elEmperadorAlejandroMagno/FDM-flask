from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from utils.services import get_products_sauce, get_products_merch, get_product_by_id, get_json_products
from utils.helpers import uru, login_required

app = Flask(__name__)

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
  # SAUCES = get_products_sauce()
  # MERCH = get_products_merch()
  products = get_json_products()
  SAUCES = [product for product in products if product['type'] == 'sauce']
  MERCH = [product for product in products if product['type'] == 'merchandising']

  return render_template("index.html", sauces = SAUCES, merchandising = MERCH)

@app.route('/product-page')
def get_product():
   if request.method == 'GET':
    id = request.args.get('id')
    PRODUCT = get_product_by_id(id)
    return render_template("product.html", details = PRODUCT)
   
