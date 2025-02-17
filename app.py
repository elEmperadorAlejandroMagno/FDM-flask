from cs50 import SQL
from flask import Flask, redirect, render_template, make_response, request, jsonify, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from utils.services import  get_products, get_product_by_id, get_products_sauce, get_products_merch, post_product, delete_product, update_product
from utils.helpers import uru, login_required, sumItemPrices, get_ID_product_list, get_quantity_product_list
from utils.constants import LISTA_ENVIOS, TEMPLATES
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

if __name__ == '__main__': 
  app.run()

app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = 'Lax'
app.config["UPLOAD_FOLDER"] = os.getenv('UPLOAD_FOLDER') # cargar archivos en el servidor (banner, libro etc)

app.jinja_env.filters["uru"] = uru

Session(app)

API_URL = os.getenv('API_URL')
FDM_URL = os.getenv('FDM_URL')

db = SQL(os.getenv('DATA_BASE'))

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
        return render_template(TEMPLATES.INDEX, sauces=SAUCES, merchandising=MERCH, API_URL= API_URL, FDM_URL= FDM_URL)

@app.route('/product-page/<string:id>', methods=['GET'])
def product_page(id):
  PRODUCT = get_product_by_id(id)
  if PRODUCT:
    return render_template(TEMPLATES.PRODUCT_DETAILS, product= PRODUCT, url= API_URL)
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
    return render_template(TEMPLATES.CARRITO, cart = CART_ITEMS, envio = envio, options_envio = LISTA_ENVIOS , subtotal = subtotal, total = total)

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
      return render_template(TEMPLATES.CARRITO, cart=CART_ITEMS, envio=envio, options_envio=LISTA_ENVIOS, subtotal=subtotal, total=total)
      
   
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

    response = make_response(render_template(TEMPLATES.CHECKOUT, purchase = purchase))
    response.set_cookie('purchase', json.dumps(purchase))
    return response
  
  if request.method == 'POST':
      purchase_data = request.cookies.get('purchase')
      if purchase_data:
        purchase_data = json.loads(purchase_data)
        product_list = purchase_data['cart']
        product_ID_list = get_ID_product_list(product_list)
        product_quantity_list = get_quantity_product_list(product_list)
        total_price = purchase_data['subtotal'] + purchase_data['envio']
        user_data = request.get_json()
        if user_data:
          try:
            db.execute("INSERT INTO orders (nombre, email, telefono, direccion, lista_productos, cantidad_productos, precio_total) VALUES (?, ?, ?, ?, ?, ?, ?)", user_data['name'], user_data['email'], user_data['phone'], user_data['address'], product_ID_list, product_quantity_list, total_price)

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
      
@app.route('/myOrders', methods=['GET'])
@login_required
def get_orders():
  if session['user_id']:
    if request.method == 'GET':
      result = db.execute("SELECT email FROM users WHERE id = ?", session['user_id'])
      if result:
        email = result[0]['email']
        try:
          orders = db.execute("SELECT * FROM orders WHERE email= ?", (email))
          return render_template(TEMPLATES.MY_ORDERS, orders = orders)
        except Exception as e:
          return jsonify({'status': 'error', 'message': str(e)})
      else:
        return render_template(TEMPLATES.MY_ORDERS, orders = [])
      
### TODO LOGIN 

@app.route('/register', methods=['GET', 'POST'])
def register():
  if request.method == 'GET':
    return render_template(TEMPLATES.REGISTER)
  if request.method == 'POST':
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    if not username or not password or not email:
      return render_template(TEMPLATES.REGISTER, message = "The from cannot be empty")
    hash = generate_password_hash(password)
    try:
      db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", username, email, hash)
      return redirect('/login')
    except Exception as e:
      return render_template(TEMPLATES.REGISTER, message = str(e))

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'GET':
    return render_template(TEMPLATES.LOGIN)
  if request.method == 'POST':
    username = request.form.get('username')
    password = request.form.get('password')
    if not username or not password:
      return render_template(TEMPLATES.LOGIN, message = "The from cannot be empty")
    user = db.execute("SELECT * FROM users WHERE username = ?", username)
    if len(user) != 1 or not check_password_hash(user[0]['password'], password):
      return render_template(TEMPLATES.LOGIN, message = "Invalid credentials")
    else:
      session['user_id'] = user[0]['id']
      session['user_role'] = user[0]['role']
      if session['user_role'] == 'admin':
        return redirect('/adminBoard')
      else:
        return redirect('/myOrders')

@app.route('/logout', methods=['POST'])
def logout():
  if request.method == 'POST':
    session.clear()
    return redirect('/adminBoard/login')

###! ADMIN PANEL

@app.route('/adminBoard')
@login_required
def panel_admin():
  if session['user_role'] != 'admin':
    return redirect('/myOrders')
  if request.method == 'GET':
    return redirect('/adminBoard/orders')

@app.route('/adminBoard/orders', methods=['GET', 'POST'])
@login_required
def panel_orders():
  if session.get['user_role'] != 'admin':
    return redirect('/myOrders')
  if request.method == 'GET':
    filter = request.args.get('filter')
    if filter:
      orders = db.execute("SELECT *, strftime('%Y-%m-%d', timestamp) AS fecha FROM orders WHERE status = ?", filter)
    else:
      orders = db.execute("SELECT *, strftime('%Y-%m-%d', timestamp) AS fecha FROM orders")
    return render_template(TEMPLATES.ORDERS, orders = orders)

@app.route('/adminBoard/orders/<string:id>', methods=['GET', 'DELETE', 'PUT'])
@login_required
def panel_order_by_ID(id):
  if session.get['user_role'] != 'admin':
    return redirect('/myOrders')
  if request.method == 'GET':
    order = db.execute("SELECT * FROM orders WHERE id = ?", id)
    return render_template(TEMPLATES.ORDERS, orders = order)
  elif request.method == 'DELETE':
    db.execute("DELETE FROM orders WHERE id = ?", id)
    return jsonify({'status': 'success'})

@app.route('/adminBoard/products', methods = ['GET', 'POST'])
@login_required  
def panel_products():
  if session.get['user_role'] != 'admin':
    return redirect('/myOrders')
  if request.method == 'GET':
    filter = request.args.get('filter') 
    PRODUCTS = get_products(filter)
    return render_template(TEMPLATES.PRODUCTS, products=PRODUCTS, url=API_URL)
  if request.method == 'POST':
    product_name = request.form.get('name')
    product_price = float(request.form.get('price'))
    product_img = request.files.get('images')
    product_description = request.form.get('description', 'Por el momento mo hay una descripción disponible')

    if not product_name or not product_price or not product_img:
      return jsonify({'status': 'error', 'message': 'Todos los campos son obligatorios'})
    
    files = {'images': (secure_filename(product_img.filename), product_img.stream, product_img.mimetype)}
    response = requests.post(f"{API_URL}/uploads", files=files)

    if response.status_code != 200:
      return jsonify({'status': 'error', 'message': 'Error cargando la imagen'})
    
    response = response.json()
    
    img_urls = response['files']
    img_url = img_urls[0] if img_urls else ['/images/default.jpg']

    data = {
      'title': product_name,
      'price': product_price,
      'available': True,
      'images': [img_url],
      'type': 'sauce',
      'description': product_description
    }

    newProduct = post_product(data)

    if newProduct:
      return redirect('/adminBoard/products')
    else:
      return jsonify({'status': 'error', 'message': 'Error creating product'})

@app.route('/adminBoard/products/<string:id>', methods = ['GET', 'DELETE', 'PUT'])
@login_required  
def panel_product_by_ID(id):
  if session.get['user_role'] != 'admin':
    return redirect('/myOrders')
  if request.method == 'GET':
    PRODUCT = get_product_by_id(id)
    if PRODUCT:
      return render_template(TEMPLATES.PRODUCTS, product = PRODUCT, url= API_URL)
    else:
      return jsonify({'status': 'error', 'message': 'Product not found'})
  if request.method == 'DELETE':
    deletedProduct = delete_product(id)
    if deletedProduct:
      return jsonify({'status': 'success', 'message': 'Product deleted'})
    else:
      return jsonify({'status': 'error', 'message': 'Error deleting product'})
  if request.method == 'PUT':
    data = request.get_json()
    updatedProduct = update_product(id, data)
    if updatedProduct:
      return jsonify({'status': 'success', 'product': updatedProduct})
    else:
      return jsonify({'status': 'error', 'message': 'Error updating product'})

