from cs50 import SQL
from flask import Flask, redirect, render_template, make_response, request, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from utils.services import get_products_sauce, get_products_merch, get_product_by_id
from utils.helpers import uru, login_required, sumItemPrices, get_ID_product_list
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

@app.route('/product-page/<int:id>', methods=['GET'])
def product_page(id):
  print(id)
  PRODUCT = get_product_by_id(id)
  if PRODUCT:
    return render_template("product.html", product= PRODUCT, url= URL['API_URL'])
  else: 
    return "Product not found", 404

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    if request.method == 'POST':
        product = request.get_json()
        cart_cookie = request.cookies.get('cart', '[]')
        CART_ITEMS = json.loads(cart_cookie)
        for item in CART_ITEMS:
            if item['id'] == product['id']:
                product['quantity'] += item['quantity']
                break
        subtotal = sumItemPrices(CART_ITEMS)
        response = jsonify({'status': 'success', 'subtotal': subtotal})
        response.set_cookie('subtotal', json.dumps(subtotal))
        response.set_cookie('cart', json.dumps(CART_ITEMS))
        return response

@app.route('/update_cart', methods=['POST', 'GET'])
def update_cart():
  if request.method == 'POST':
      data = request.get_json()
      print(f"Data: {data}")
      cart_cookie = request.cookies.get('cart', '[]')
      CART_ITEMS = json.loads(cart_cookie)
      for item in CART_ITEMS:
        if item['id'] == data['id']:
          item['quantity'] = data['quantity']
          break
      response = jsonify({ 'subtotal': sumItemPrices(CART_ITEMS), 'total': sumItemPrices(CART_ITEMS) })
      response.set_cookie('cart', json.dumps(CART_ITEMS))
      return response
  if request.method == 'GET':
    cart_cookie = request.cookies.get('cart', '[]')
    CART_ITEMS = json.loads(cart_cookie)
    subtotal = sumItemPrices(CART_ITEMS)
    response = jsonify({ 'subtotal': subtotal})
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

@app.route('/cart-page', methods = ['POST', 'GET'])
def get_cart_info():
   if request.method == 'POST':
    data = request.get_json()
    cart = data.get('cart')
    subtotal = sumItemPrices(cart)
    response = jsonify({'status': 'success'})
    response.set_cookie('cart', json.dumps(cart))
    response.set_cookie('subtotal', str(subtotal))
    return response
   elif request.method == 'GET':
    cart_cookie = request.cookies.get('cart', '[]')
    subtotal_cookie = request.cookies.get('subtotal', '0')
    subtotal = float(subtotal_cookie)
    CART_ITEMS = json.loads(cart_cookie)
    total = subtotal
    envio = request.cookies.get('envio', '0')
    return render_template("cart.html", cart = CART_ITEMS, envio = envio, options_envio = LISTA_ENVIOS , subtotal = subtotal, total = total)

@app.route('/envio', methods=['POST', 'GET'])
def get_envio():
  if request.method == 'POST':
      data = request.get_json()
      envio = data.get('envio')
      cart_cookie = request.cookies.get('cart', '[]')
      subtotal_cookie = request.cookies.get('subtotal', '0')
      subtotal = float(subtotal_cookie)
      CART_ITEMS = json.loads(cart_cookie)
      total = subtotal
      if envio and envio.isdigit():
        envio = float(envio)
      elif envio in ['Free', 'Por definir']:
        envio = 0
      else:
        envio = 0
      total += envio
      response = jsonify({'total': total, 'subtotal': subtotal, 'envio': envio})
      response.set_cookie('envio', str(envio))
      return response
  elif request.method == 'GET':
      cart_cookie = request.cookies.get('cart', '[]')
      subtotal_cookie = request.cookies.get('subtotal', '0')
      subtotal = float(subtotal_cookie)
      CART_ITEMS = json.loads(cart_cookie)
      total = subtotal
      envio = request.cookies.get('envio', '0')
      return render_template("cart.html", cart=CART_ITEMS, envio=envio, options_envio=LISTA_ENVIOS, subtotal=subtotal, total=total)
      
   
@app.route('/checkout', methods=['POST', 'GET'])
def checkout():
  if request.method == 'GET':
    cart_cookie = request.cookies.get('cart', '[]')
    subtotal_cookie = request.cookies.get('subtotal', '0')
    envio_cookie = request.cookies.get('envio', '0')

    purchase = {
      'cart': json.loads(cart_cookie),
      'subtotal': float(subtotal_cookie),
      'envio': float(envio_cookie)
    }

    response = make_response(render_template("checkout.html", purchase = purchase))
    response.set_cookie('purchase', json.dumps(purchase))
    return response
  
  if request.method == 'POST':
      purchase_data = request.cookies.get('purchase')
      if purchase_data:
        purchase_data = json.loads(purchase_data)
        product_list = purchase_data['cart']
        product_ID_list = get_ID_product_list(product_list)
        total_price = purchase_data['subtotal'] + purchase_data['envio']
        user_data = request.get_json()
        if user_data:
          try:
            db.execute("INSERT INTO orders (user_name, user_email, user_phone, user_address, product_list, total_price) VALUES (?, ?, ?, ?, ?, ?)", user_data['name'], user_data['email'], user_data['phone'], user_data['address'], product_ID_list, total_price)

            response = jsonify({'status': 'success'})
            response.set_cookie('cart', '', expires=0)
            response.set_cookie('subtotal', '', expires=0)
            response.set_cookie('envio', '', expires=0)
            response.set_cookie('purchase', '', expires=0)
            return response
          except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)})
        else:
          return jsonify({'status': 'error', 'message': 'No user data provided'})
      else:
         return jsonify({'status': 'error', 'message': 'No purchase data found'})



@app.route('/adminBoard')
def panel_admin():
  return redirect('/adminBoard/orders')

@app.route('/adminBoard/orders')
def get_orders():
  if request.method == 'GET':
    filter = request.args.get('filter')
    if filter:
      orders = db.execute(f"SELECT * FROM orders WHERE status = '{filter}'")
      return render_template("orders.html", orders = orders)
    else:
      orders = db.execute("SELECT * FROM orders")
      return render_template("orders.html", orders = orders)

@app.route('/adminBoard/orders/<int:id>')
def get_order_by_ID(id):
  order = db.execute("SELECT * FROM orders WHERE id = ?", id)
  return render_template("orders.html", orders = order)
    
@app.route('/adminBoard/products')
def get_products():
  if request.method == 'GET':
    filter = request.args.get('filter')
    if filter:
      products = db.execute(f"SELECT * FROM products WHERE type = '{filter}'")
      return render_template("products.html", products = products)
  else:
    products = db.execute("SELECT * FROM products")
    return render_template("products.html", products = products)
  
@app.route('/adminBoard/products/<int:id>')
def get_product_by_ID(id):
  product = db.execute("SELECT * FROM products WHERE id = ?", id)
  return render_template("products.html", products = product)