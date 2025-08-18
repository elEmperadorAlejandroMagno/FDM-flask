from cs50 import SQL
from flask import Flask, flash, redirect, render_template, make_response, request, jsonify, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from utils.services import  get_products, get_product_by_id, get_products_by_category, delete_product, update_product, create_product
from utils.helpers import uru, login_required, sumItemPrices, get_ID_product_list, get_quantity_product_list, save_images
from utils.constants import LISTA_ENVIOS, TEMPLATES
import requests
import json
import os
from dotenv import load_dotenv

# Cargar cupones desde un JSON como fuente simulada
COUPONS_FILE = os.path.join(os.path.dirname(__file__), 'utils', 'coupons.json')

def load_coupons():
  try:
    with open(COUPONS_FILE, 'r') as f:
      return json.load(f)
  except Exception:
    return []

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
# app.config["UPLOAD_FOLDER"] = os.getenv('UPLOAD_FOLDER') # cargar archivos en el servidor (banner, libro etc)

app.jinja_env.filters["uru"] = uru

Session(app)

URL = os.getenv('FDM_URL')

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
        PRODUCTS = get_products()
        SALSAS = [product for product in PRODUCTS if product['category'] == 'salsa']
        MERCH = [product for product in PRODUCTS if product['category'] == 'merch']
        return render_template(TEMPLATES.INDEX, salsas = SALSAS, merch = MERCH, url = URL)

@app.route('/product-page/<string:id>', methods=['GET'])
def product_page(id):
  PRODUCT = get_product_by_id(id)
  if PRODUCT:
    return render_template(TEMPLATES.PRODUCT_DETAILS, product= PRODUCT, url= URL)
  else: 
    return "Product not found", 404
  
@app.route('/products?category=<string:category>', methods=['GET'])
def products_by_category(category):
  PRODUCTS = get_products_by_category(category)
  return render_template(TEMPLATES.INDEX, products = PRODUCTS, url = URL)

@app.route('/product/<string:id>', methods=['GET'])
def api_get_product_by_id(id):
    product = get_product_by_id(id)
    if product:
      return jsonify({'status': 'success', 'product': product})
    else:
      return jsonify({'status': 'error', 'message': 'Product not found'}), 404

@app.route('/cart-page', methods = ['POST', 'GET'])
def get_cart_info():
  if request.method == 'POST':
    data = request.get_json()
    cart = data.get('cart', [])
    subtotal_raw = sumItemPrices(cart)
    # aplicar cupón si está presente (reemplazo, sin acumular)
    coupon_code = request.cookies.get('coupon')
    coupons = load_coupons()
    discount = 0.0
    free_shipping = False
    if coupon_code:
      coupon = next((c for c in coupons if c.get('code') == coupon_code), None)
      if coupon:
        if coupon['type'] == 'percent':
          discount = subtotal_raw * (float(coupon['value']) / 100.0)
        elif coupon['type'] == 'fixed':
          discount = float(coupon['value'])
        elif coupon['type'] == 'shipping':
          free_shipping = True
    subtotal = max(0.0, subtotal_raw - discount)

    # conservar el valor de envío actual (si existe)
    envio_cookie = request.cookies.get('envio', '0')
    try:
      envio_val = float(envio_cookie)
      envio_text = None
    except Exception:
      envio_val = 0.0
      envio_text = envio_cookie if envio_cookie in ['Free', 'Por definir'] else None

    if free_shipping:
      envio_text = 'Free'
      envio_val = 0.0

    total = subtotal + (0 if envio_text else envio_val)
    response = jsonify({'status': 'success', 'subtotal': subtotal, 'envio': envio_val, 'envioText': envio_text, 'total': total})
    response.set_cookie('cart', json.dumps(cart))
    response.set_cookie('subtotal', str(subtotal))
    # mantener cookie de cupón tal como esté; este flujo no la cambia
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
      envio_raw = data.get('envio')
      cart_cookie = request.cookies.get('cart', '[]')
      subtotal_cookie = request.cookies.get('subtotal', '0')
      subtotal = float(subtotal_cookie)
      CART_ITEMS = json.loads(cart_cookie)

      # Normalizar envío
      envio_val = 0.0
      envio_text = None
      if isinstance(envio_raw, str) and envio_raw.isdigit():
        envio_val = float(envio_raw)
      elif envio_raw in ['Free', 'Por definir']:
        envio_text = envio_raw
      else:
        try:
          envio_val = float(envio_raw)
        except Exception:
          envio_val = 0.0

      total = subtotal + (0 if envio_text else envio_val)
      response = jsonify({'total': total, 'subtotal': subtotal, 'envio': envio_val, 'envioText': envio_text})
      # Persistir cookie de envío como texto si aplica, numérico en caso contrario
      response.set_cookie('envio', envio_text if envio_text else str(envio_val))
      return response
  elif request.method == 'GET':
      cart_cookie = request.cookies.get('cart', '[]')
      subtotal_cookie = request.cookies.get('subtotal', '0')
      subtotal = float(subtotal_cookie)
      CART_ITEMS = json.loads(cart_cookie)
      envio_cookie = request.cookies.get('envio', '0')
      try:
        envio_val = float(envio_cookie)
        total = subtotal + envio_val
        envio_context = envio_val
      except Exception:
        # Texto 'Free' o 'Por definir'
        total = subtotal
        envio_context = envio_cookie
      return render_template(TEMPLATES.CARRITO, cart=CART_ITEMS, envio=envio_context, options_envio=LISTA_ENVIOS, subtotal=subtotal, total=total)
      
   
@app.route('/coupon', methods=['POST'])
def apply_coupon():
  data = request.get_json()
  code = (data or {}).get('code', '').strip().upper()
  cart_cookie = request.cookies.get('cart', '[]')
  envio_cookie = request.cookies.get('envio', '0')
  try:
    cart_items = json.loads(cart_cookie)
  except Exception:
    cart_items = []
  # Subtotal base SIEMPRE desde los items del carrito para reemplazar cupón anterior
  subtotal = sumItemPrices(cart_items)

  # resolver envío actual
  try:
    envio_val = float(envio_cookie)
    envio_text = None
  except Exception:
    envio_val = 0.0
    envio_text = envio_cookie if envio_cookie in ['Free', 'Por definir'] else None

  coupons = load_coupons()
  coupon = next((c for c in coupons if c.get('code') == code), None)
  if not coupon:
    return jsonify({ 'status': 'error', 'message': 'Cupón inválido' }), 400

  discount = 0.0
  free_shipping = False
  if coupon['type'] == 'percent':
    discount = subtotal * (float(coupon['value']) / 100.0)
  elif coupon['type'] == 'fixed':
    discount = float(coupon['value'])
  elif coupon['type'] == 'shipping':
    free_shipping = True
  else:
    return jsonify({ 'status': 'error', 'message': 'Tipo de cupón no soportado' }), 400

  new_subtotal = max(0.0, subtotal - discount)
  new_envio_text = 'Free' if free_shipping else envio_text
  new_envio_val = 0.0 if free_shipping else (envio_val if not new_envio_text else 0.0)
  total = new_subtotal + (0 if new_envio_text else new_envio_val)

  response = jsonify({
    'status': 'success',
    'subtotal': new_subtotal,
    'envio': new_envio_val,
    'envioText': new_envio_text,
    'total': total
  })
  # Persistir cookies subtotal/envio y cupón aplicado (reemplaza si ya había otro)
  response.set_cookie('subtotal', str(new_subtotal))
  response.set_cookie('envio', new_envio_text if new_envio_text else str(new_envio_val))
  response.set_cookie('coupon', code)
  return response

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
    try:
      user = db.execute("SELECT id, role, password FROM users WHERE username = ?", (username,))
      if len(user) != 1 or not check_password_hash(user[0]['password'], password):
        return render_template(TEMPLATES.LOGIN, message = "Invalid credentials")
      else:
        session['user_id'] = user[0]['id']
        session['user_role'] = user[0]['is_admin']
        if session.get('user_role') != 1:
          return redirect('/myOrders')
        else:
          return redirect('/adminBoard')
    except Exception as e:
      return render_template(TEMPLATES.LOGIN, message = str(e))

@app.route('/logout', methods=['POST'])
def logout():
  if request.method == 'POST':
    session.clear()
    return redirect('/adminBoard/login')

###! ADMIN PANEL

@app.route('/adminBoard')
@login_required
def panel_admin():
  if session.get('user_role') != 1:
    return redirect('/myOrders')
  if request.method == 'GET':
      return render_template('panel.html', URL= URL)
  return render_template('panel.html', URL= URL)

@app.route('/adminBoard/orders', methods=['GET', 'POST'])
@login_required
def panel_orders():
    if session.get('user_role') != 1:
        return redirect('/myOrders')
    
    if request.method == 'GET':
        filter = request.args.get('filter')
        orders = []
        try:
            if filter:
                orders = db.execute('''SELECT o.id AS order_id, o.nombre, o.email, o.telefono, o.envio, o.direccion, o.precio_total, o.status, o.timestamp,
                                              op.product_id, op.cantidad
                                       FROM orders o
                                       INNER JOIN order_productos op ON o.id = op.order_id
                                       WHERE o.status = ?
                                       ORDER BY o.timestamp DESC''', filter)
            else:
                orders = db.execute('''SELECT o.id AS order_id, o.nombre, o.email, o.telefono, o.envio, o.direccion, o.precio_total, o.status, o.timestamp,
                                              op.product_id, op.cantidad
                                       FROM orders o
                                       INNER JOIN order_productos op ON o.id = op.order_id
                                       ORDER BY o.timestamp DESC''')

            if not orders:
                return jsonify({'status': 'success', 'orders': [], 'message': 'No orders found'})

            order_dict = {}
            for order in orders:
                  order_id = order['order_id']
                  if order_id not in order_dict:
                    order_dict[order_id] = {
                          'order_id': order['order_id'],
                          'nombre': order['nombre'],
                          'email': order['email'],
                          'telefono': order['telefono'],
                          'envio': order['envio'],
                          'direccion': order['direccion'],
                          'precio_total': order['precio_total'],
                          'status': order['status'],
                          'fecha': order['timestamp'],
                          'productos': []
                      }
                  product_details = get_product_by_id(order['product_id'])
                  if product_details:
                    order_dict[order_id]['productos'].append({
                        'product_id': order['product_id'],
                        'product_title': product_details['title'],
                        'product_price': product_details['price'],
                        'cantidad': order['cantidad']
                    })
                  else:
                    order_dict[order_id]['products'].append({
                        'product_id': order['product_id'],
                        'product_title': 'Producto no disponible',
                        'product_price': 'N/A',
                        'cantidad': order['cantidad']
                    })

            order_list = list(order_dict.values())        
            db.close()
            return jsonify({'status': 'success', 'orders': order_list})
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
  
    if request.method == 'POST':
      data = request.form.to_dict(flat=False)

      if data:
        try:
          lista_productos = data.get('product_id[]', [])
          cantidad_productos = data.get('product_quantity[]', [])

          if not lista_productos or not cantidad_productos:
            return jsonify({'status': 'error', 'message': 'Los campos de producto y cantidad no pueden estar vacías'})

          if len(lista_productos) != len(cantidad_productos):
            return jsonify({'status': 'error', 'message': 'Los datos no coninciden'})
          
          db.execute("INSERT INTO orders (nombre, email, telefono, envio, direccion, precio_total) VALUES (?, ?, ?, ?, ?, ?)", 
                     (data['nombre'][0], data['email'][0], data['telefono'][0], data['envio'][0], data['direccion'][0], data['total'][0]))
          
          order_id = db.execute("SELECT id FROM orders ORDER BY id DESC LIMIT 1")['id']

          for i in range(len(lista_productos)):
            db.execute("INSERT INTO order_productos (order_id, product_id, cantidad) VALUES (?, ?, ?)", 
                       (order_id, lista_productos[i], cantidad_productos[i]))
      
          return jsonify({'status': 'success'})
        except Exception as e:
          return jsonify({'status': 'error', 'message': str(e)})
      else:
        return jsonify({'status': 'error', 'message': 'No data provided'})
      
    else:
        return jsonify({'status': 'error', 'message': 'Método no permitido'}), 405
    
@app.route('/adminBoard/order/<string:id>', methods=['GET', 'DELETE', 'PUT'])
@login_required
def panel_order_by_ID(id):
  if session.get('user_role') != 1:
    return redirect('/myOrders')
  if request.method == 'GET':
    try:
      order = db.execute("SELECT * FROM orders as o INNER JOIN order_productos as op ON o.id = op.order_id WHERE id = ?", (id,))
      order_dict = {}
      if order:
        for item in order:
          order_id = item['order_id']
          if not order_id in order_dict:
            order_dict[order_id] = {
              'order_id': item['order_id'],
              'nombre': item['nombre'],
              'email': item['email'],
              'telefono': item['telefono'],
              'envio': item['envio'],
              'direccion': item['direccion'],
              'precio_total': item['precio_total'],
              'status': item['status'],
              'fecha': item['timestamp'],
              'productos': []
            }
          product_details = get_product_by_id(item['product_id'])
          if product_details:
            order_dict[order_id]['productos'].append({
              'product_id': item['product_id'],
              'product_title': product_details['title'],
              'product_price': product_details['price'],
              'cantidad': item['cantidad']
            })
          else:
            order_dict[order_id]['productos'].append({
              'product_id': item['product_id'],
              'product_title': 'Producto no disponible',
              'product_price': 'N/A',
              'cantidad': item['cantidad']
            })

        order_details = list(order_dict.values())
        db.close()
        return jsonify({'status': 'success', 'order': order_details})
    except Exception as e:
      return jsonify({'status': 'error', 'message': str(e)})
  elif request.method == 'DELETE':
    try:
      db.execute("DELETE FROM orders WHERE id = ?", (id,))
      db.execute("DELETE FROM order_productos WHERE order_id = ?", (id,))
      return jsonify({'status': 'success'})
    except Exception as e:
      return jsonify({'status': 'error', 'message': str(e)})
  elif request.method == 'PUT':
    data = request.form.to_dict()
    print(data)
    if data:
      try:
        lista_productos = data.get('product_id[]', [])
        cantidad_productos = data.get('product_quantity[]', [])

        db.execute("UPDATE orders SET nombre = ?, email = ?, telefono = ?, envio = ?, precio_total = ?, direccion = ? WHERE id = ?", 
                   (data['name'], data['email'], data['phone'], data['envio'], data['total'], data['address'], id))

        db.execute("DELETE FROM order_productos WHERE order_id = ?", (id,))

        for i in range(len(lista_productos)):
          db.execute("INSERT INTO order_productos (order_id, product_id, cantidad) VALUES (?,?,?)", 
                     (id, lista_productos[i], cantidad_productos[i]))

        return jsonify({'status': 'success'})
      except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    else:
      return jsonify({'status': 'error', 'message': 'No data provided'})
        

@app.route('/adminBoard/complete_order/<string:id>', methods=['PUT'])
def complete_order(id):
  if request.method == 'PUT':
    data = request.get_json()
    if data:
      try:
        db.execute("UPDATE orders SET status = ? WHERE id = ?", 
                   (data['status'], id))

        return jsonify({'status': 'success'})
      except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    else:
      return jsonify({'status': 'error', 'message': 'No data provided'})

@app.route('/adminBoard/products', methods = ['GET', 'POST'])
@login_required  
def panel_products():
  if session.get('user_role') != 1:
    return redirect('/myOrders')
  
  if request.method == 'GET':
    PRODUCTS = get_products()
    return jsonify({'status': 'success', 'products': PRODUCTS})
  
  if request.method == 'POST':
    data = request.form.to_dict()
    # add images and upload to server
    if not request.files.get('images'):
      images_urls = ['/static/images/default.png']
    else:
      files = request.files.getlist('images')
      try: 
        images_urls = save_images(files, upload_folder = 'products')
      except Exception:
        return jsonify({'status': 'error', 'message': 'Error uploading images'})

    is_created = create_product(data, images_urls)

    if not is_created:
      return jsonify({'status': 'error', 'message': 'Error creating product'})
    else:
      return jsonify({'status': 'success', 'message': 'Product created'})

@app.route('/adminBoard/product/<string:id>', methods = ['GET', 'DELETE', 'PUT'])
@login_required  
def panel_product_by_ID(id):
  if session.get('user_role') != 1:
    return redirect('/myOrders')

  if request.method == 'GET':
    PRODUCT = get_product_by_id(id)
    if PRODUCT:
      return jsonify({ 'status': 'success', 'product': PRODUCT })
    else:
      return jsonify({'status': 'error', 'message': 'Product not found'})
    
  if request.method == 'DELETE':
    is_deleted = delete_product(id)
    if not is_deleted:
      return jsonify({'status': 'error', 'message': 'Product not found'})
    return jsonify({'status': 'success', 'message': 'Product deleted'})
  
  if request.method == 'PUT':
    data = request.form.to_dict()
    is_updated = update_product(id, data)
    if not is_updated:
      return jsonify({'status': 'error', 'message': 'Product not found'})
    return jsonify({'status': 'success', 'message': 'Product updated successfully'})
  
@app.route('/adminBoard/product/<string:id>', methods = ['PUT'])
@login_required
def update_single_field(id):
  if session.get('user_role') == 1:
    data = request.get_json()
    if data:
      is_updated = update_single_field(id, field = data['field'], value = data['value'])
      if not is_updated:
        return jsonify({'status': 'error', 'message': 'Error trying to update '})
      return jsonify({'status': 'success', 'message': 'Product updated successfully'})


