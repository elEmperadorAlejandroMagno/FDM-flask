function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Producto{
  constructor(name, price, quantity) {
    this.id = generateId(); //provisional, posible id repetido
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
  showProducto(){
    return `${this.name}, ${this.price}, ${this.quantity}`
  }
}

class Salsa extends Producto{
  constructor(name, price, quantity, spiciness) {
    super(name, price, quantity);
    this.spiciness = spiciness;
  }
}
class Merch extends Producto{
  constructor(name, price, quantity, size) {
    super(name, price, quantity);
    this.size = size;
  }
}

class Carrito {
  constructor(plist= [], cost= 0, count= 0) {
    this.products = plist;
    this.cost = cost;
    this.count = count;
  }

  getCost() {
    this.cost = products.reduce((total, producto) => total + producto.price * producto.quantity, 0)
  }

  getCount() {
    this.count = this.products.reduce((total, producto) => total + producto.quantity, 0);
  }

  addItem(item) {
    this.products.push(item);
    this.getCost(); //update cost
    this.getCount; //update count of items
    this.saveToCookie();//update navigator cookie
  }

  subtractItem(name) {
    let itemIndex = this.products.findIndex(i => i.name == name)
    if (itemIndex >= 0 && itemIndex < this.products.length) {
      this.products[itemIndex].quantity -= 1;
      this.cost -= this.products[itemIndex].price; // Updating cost
      this.count -= 1;
      if (this.products[itemIndex].quantity <= 0){
        this.products.splice(itemIndex, 1); // Removes item from array
      }
    }
    this.saveToCookie();
  }
  //! provisional
  showCarrito() {
    let productList = this.products.map(product => `${product.name}: $${product.price}, ${product.quantity}`).join("\n");
    return `${productList}\nTotal Cost: $${this.cost}\n----------------`;
  }

  saveToCookie() {
    const DATA = {
      products: this.products,
      cost: this.cost,
      count: this.count
    }
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(DATA))};path=/;max=604800`
  }

  static fromCookie() {
    const match = document.cookie.match(/cart=([^;]+)/)
    if (match) {
      try {
        const DATA = JSON.parse(decodeURIComponent(match[1]));
        return new Carrito(DATA.products, DATA.cost, DATA.count)
      } catch (e) {
        return new Carrito();
      }
    }
    return new Carrito();
  }
  // metodo para renderizar el carrito en la web
}

