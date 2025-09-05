import {
  createEmptyCartRow,
  createCartItemRow,
  createOrderRow,
  createProductRow,
  createAddProductForm,
  createViewProductModal,
  createEditProductForm,
  createAddOrderForm,
  createViewOrderModal,
  createEditOrderForm
} from './ui.js';
import { Carrito } from './cart.js';

//? CLIENT FUNCTIONS */
export function drawCartModal(cart) {
  const cartTable = document.querySelector('.table-body');
  cartTable.innerHTML = ''; // Limpia la tabla

  if (cart.length === 0) {
    cartTable.appendChild(createEmptyCartRow());
  } else {
    cart.forEach(item => {
      const rows = createCartItemRow(item);
      rows.forEach(row => cartTable.appendChild(row));
    });
  }
}

export function formatCurrency(value) {
    try {
      value = parseFloat(value);
      if (isNaN(value)) {
        throw new Error('Invalid number');
      }
      return `$U${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    } catch (error) {
      console.warn('formatCurrency error:', error);
      return `$U0.00`; // Return a default value instead of undefined
    }
}

export function parseCurrency(value) {
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(value.replace(/[^0-9.-]+/g,""));
}

function drawSubtotal(cartCost) {
  const subtotal = cartCost || 0;
  let cartSubtotal = document.getElementById('cart-modal-subtotal');
  if (cartSubtotal) {
    const formattedCurrency = formatCurrency(subtotal);
    cartSubtotal.innerHTML = formattedCurrency;
  } else {
    console.warn('Cart modal subtotal element not found');
  }
}

function drawCartCount(cartCount) {
  const el = document.querySelector('.cart-count');
  if (!el) return;
  const count = Number(cartCount) || 0;
  if (count <= 0) {
    el.textContent = '';
  } else {
    el.textContent = String(count);
  }
}

export function updateCart() {
  const data = JSON.parse(localStorage.getItem('cart')) || { products: [], cost: 0, count: 0 };
  const products = Array.isArray(data.products) ? data.products : [];
  
  // Recalculate cost to ensure it's accurate
  const carrito = Carrito.fromStorage();
  const actualCost = carrito.getCost();
  const actualCount = carrito.getCount();
  
  // Ensure DOM is ready before updating
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performCartUpdate(products, actualCost, actualCount);
    });
  } else {
    performCartUpdate(products, actualCost, actualCount);
  }
}

function performCartUpdate(products, cost, count) {
  drawCartModal(products);
  drawCartCount(count);
  
  // Double-check the cost calculation
  if (products.length > 0) {
    const recalculatedCost = products.reduce((total, item) => {
      return total + (Number(item.price) * Number(item.quantity));
    }, 0);
    drawSubtotal(recalculatedCost);
  } else {
    drawSubtotal(0);
  }
}

//? ADMIN PANEL FUNCTIONS */

export function drawOrdersTable(orders) {
  const ordersContainer = document.querySelector('.main');
  ordersContainer.innerHTML = '';

  const tableContainer = document.createElement('div');
  tableContainer.className = "table-container";
  const col = document.createElement('div');
  col.className = "col";

  // Header
  const header = document.createElement('div');
  header.className = "header";
  const addBtn = document.createElement('button');
  addBtn.type = "button";
  addBtn.className = "btn addBtn";
  addBtn.id = "addNewOrderBtn";
  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Agregar Pedido';
  header.appendChild(addBtn);
  col.appendChild(header);

  if (!orders || orders.length === 0) {
    const h3 = document.createElement('h3');
    h3.style.textAlign = "center";
    h3.textContent = "No hay pedidos";
    col.appendChild(h3);
  } else {
    const table = document.createElement('table');
    table.className = "table";
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Nombre</th>
        <th scope="col">Corréo</th>
        <th scope="col">Productos</th>
        <th scope="col">Total</th>
        <th scope="col">Estado</th>
        <th scope="col">Fecha</th>
        <th scope="col">Acciones</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    orders.forEach(order => {
      tbody.appendChild(createOrderRow(order, formatCurrency));
    });
    table.appendChild(tbody);
    col.appendChild(table);
  }

  tableContainer.appendChild(col);
  ordersContainer.appendChild(tableContainer);
}

export function drawProductsTable(products, url) {
  const productsContainer = document.querySelector('.main');
  productsContainer.innerHTML = '';

  const tableContainer = document.createElement('div');
  tableContainer.className = "table-container";
  const col = document.createElement('div');
  col.className = "col";

  // Header
  const header = document.createElement('div');
  header.className = "header";
  const addBtn = document.createElement('button');
  addBtn.type = "button";
  addBtn.className = "btn addBtn";
  addBtn.id = "addNewProductBtn";
  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Agregar Producto';
  header.appendChild(addBtn);
  col.appendChild(header);

  const table = document.createElement('table');
  table.className = "table";
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr class="align-content-center text-center">
      <th scope="col">ID</th>
      <th scope="col">Imagen</th>
      <th scope="col">Nombre</th>
      <th scope="col">Precio</th>
      <th scope="col">Acciones</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  products.forEach(product => {
    tbody.appendChild(createProductRow(product, url, formatCurrency));
  });
  table.appendChild(tbody);
  col.appendChild(table);

  tableContainer.appendChild(col);
  productsContainer.appendChild(tableContainer);
}

/* PRODUCT MODAL */
export function renderAddProductModal(modal, title, body) {
    title.innerText = 'Add Product';
    body.innerHTML = ''; // Limpia el contenido
    const form = createAddProductForm();
    body.appendChild(form);
    modal.show();
}
export function renderViewProductModal(product, url, modal, title, body) {
  title.innerText = 'Ver Productos';
  body.innerHTML = '';
  const viewModal = createViewProductModal(product, url, formatCurrency);
  body.appendChild(viewModal);
  modal.show();
}
export function renderEditProductModal(product, id, title, body) {
    title.innerText = 'Editar Producto';
    body.innerHTML = ''; // Limpia el contenido
    const form = createEditProductForm(product, id);
    body.appendChild(form);
}

/* ORDER MODAL */
export function renderAddOrderModal(modal, title, body) {
    title.innerText = 'Add Order';
    body.innerHTML = '';
    const form = createAddOrderForm();
    body.appendChild(form);
    modal.show();

    // Delegación de eventos para agregar productos
    body.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'addProductToOrder') {
            const productListContainer = body.querySelector('.productListContainer');
            const span = document.createElement('span');
            const labelId = document.createElement('label');
            labelId.className = "align-self-center";
            labelId.textContent = "id";
            const inputProductId = document.createElement('input');
            inputProductId.type = "text";
            inputProductId.className = "form-control";
            inputProductId.name = "product_id[]";
            inputProductId.placeholder = "Id del producto: 12fa12-asfaf-12";
            inputProductId.required = true;
            const inputProductQty = document.createElement('input');
            inputProductQty.type = "number";
            inputProductQty.className = "form-control";
            inputProductQty.name = "product_quantity[]";
            inputProductQty.min = 1;
            inputProductQty.max = 9;
            inputProductQty.value = 1;
            span.appendChild(labelId);
            span.appendChild(inputProductId);
            span.appendChild(inputProductQty);
            productListContainer.appendChild(span);
        }
    });
}
export function renderViewOrderModal(order, modal, title, body) {
  title.innerText = 'Ver Orden';
  body.innerHTML = '';
  const viewOrderModal = createViewOrderModal(order, formatCurrency);
  body.appendChild(viewOrderModal);
  modal.show();
}
export function renderEditOrderModal(order, id, title, body) {
    title.innerText = 'Editar Orden';
    body.innerHTML = '';
    const editOrderModal = createEditOrderForm(order, id);
    body.appendChild(editOrderModal);

    // Delegación de eventos para agregar productos
    body.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'addProductToOrder') {
            const productListContainer = body.querySelector('.productListContainer');
            const span = document.createElement('span');
            span.className = "d-flex justify-content-between";
            const labelId = document.createElement('label');
            labelId.className = "align-self-center";
            labelId.textContent = "id";
            const inputProductId = document.createElement('input');
            inputProductId.className = "form-control text-center";
            inputProductId.type = "text";
            inputProductId.name = "product_id[]";
            inputProductId.placeholder = "ej 456awd-4654awd-bdawr";
            inputProductId.required = true;
            const inputProductQty = document.createElement('input');
            inputProductQty.className = "form-control";
            inputProductQty.type = "number";
            inputProductQty.name = "product_quantity[]";
            inputProductQty.placeholder = "0";
            inputProductQty.min = 1;
            inputProductQty.max = 9;
            inputProductQty.required = true;
            span.appendChild(labelId);
            span.appendChild(inputProductId);
            span.appendChild(inputProductQty);
            productListContainer.appendChild(span);
        }
    });
}