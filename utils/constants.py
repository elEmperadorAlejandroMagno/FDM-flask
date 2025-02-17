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
  "MY_ORDERS": "myOrders.html",
  "ORDERS": "orders.html",
  "PRODUCTS": "products.html",
  "LOGIN": "login.html",
  "REGISTER": "register.html",
})