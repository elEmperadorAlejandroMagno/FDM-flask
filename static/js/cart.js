// importar las funciones de renderizado del carrito

export class Producto{
  constructor(id, title, price, quantity, image = null) {
    this.id = id;
    this.title = title; // usar 'title' para alinear con templates
    this.price = price;
    this.quantity = quantity;
    this.image = image;
  }
  showProducto(){
    return `${this.title}, ${this.price}, ${this.quantity}`
  }
}

export class Salsa extends Producto{
  constructor(id, title, price, quantity, spiciness, image = null) {
    super(id, title, price, quantity, image);
    this.spiciness = spiciness;
  }
}

export class Merch extends Producto{
  constructor(id, title, price, quantity, size, image = null) {
    super(id, title, price, quantity, image);
    this.size = size;
  }
}

export class Carrito {
  constructor(plist= [], cost= 0, count= 0) {
    this.products = Array.isArray(plist) ? plist : [];
    this.cost = Number(cost) || 0;
    this.count = Number(count) || 0;
  }

  getCost() {
    this.cost = this.products.reduce((total, producto) => total + Number(producto.price) * Number(producto.quantity), 0);
    return this.cost;
  }

  getCount() {
    this.count = this.products.reduce((total, producto) => total + Number(producto.quantity), 0);
    return this.count;
  }

  addItem(item) {
    const idx = this.products.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      this.products[idx].quantity += Number(item.quantity) || 1;
    } else {
      this.products.push(item);
    }
    this.getCost();
    this.getCount();
    this.saveToStorage();
  }

  updateQuantity(id, quantity) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const qty = Math.max(0, Number(quantity) || 0);
      if (qty === 0) {
        this.products.splice(idx, 1);
      } else {
        this.products[idx].quantity = qty;
      }
      this.getCost();
      this.getCount();
      this.saveToStorage();
    }
  }

  removeItem(id) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.products.splice(idx, 1);
      this.getCost();
      this.getCount();
      this.saveToStorage();
    }
  }

  saveToStorage() {
    const DATA = {
      products: this.products,
      cost: this.cost,
      count: this.count
    };
    localStorage.setItem('cart', JSON.stringify(DATA));
    
    // Dispatch custom event for cart updates
    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: {
        products: this.products,
        cost: this.cost,
        count: this.count
      }
    });
    window.dispatchEvent(cartUpdateEvent);
  }

  static fromStorage() {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) return new Carrito();
      const DATA = JSON.parse(raw);
      return new Carrito(DATA.products || [], DATA.cost || 0, DATA.count || 0);
    } catch (e) {
      return new Carrito();
    }
  }
  // metodo para renderizar el carrito en la web
}

