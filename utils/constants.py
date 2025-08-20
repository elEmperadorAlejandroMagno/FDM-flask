LISTA_ENVIOS = [
      {
        "lugar": "Montevideo",
        "costo": 50,
      },
      {
        "lugar": "Ciudad de la costa",
        "costo": 50,
      },
      {
        "lugar": "Resto del país",
        "costo": "Por definir",
      },
      {
        "lugar": "Retiro en local",
        "costo": "Free",
      }
]

FIELDS = ['name', 'price', 'stock', 'description', 'image']

class DotDict(dict):
    """Permite el acceso a las claves del diccionario utilizando la sintaxis de punto."""
    def __getattr__(self, attr):
        return self.get(attr)
    
    def __setattr__(self, attr, value):
        self[attr] = value
    
    def __delattr__(self, attr):
        del self[attr]

TEMPLATES = DotDict({
  "INDEX": "index.html",
  "PRODUCT_DETAILS": "product.html",
  "CARRITO": "cart.html",
  "CHECKOUT": "checkout.html",
  "MY_ORDERS": "user_panel/myOrders.html",
  "ORDERS": "admin_panel/orders.html",
  "PRODUCTS": "admin_panel/products.html",
<<<<<<< HEAD
  "LOGIN": "login.html",
  "REGISTER": "register.html",
=======
  "LOGIN": "auth/login.html",
  "REGISTER": "auth/register.html",
>>>>>>> features
})