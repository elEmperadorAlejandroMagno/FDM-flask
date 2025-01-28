import { fetchOrders } from "./table_render.js";

//? CLIENT FUNCTIONS */
export function drawCartModal(cart) {
  const cartTable = document.querySelector('.table-body');
  if (cart.length === 0) {
    // const cartBody = document.querySelector('.article-container');
    cartTable.innerHTML = `
    <tr>
      <td colspan="2">
        <div class="empty-cart">
          <h3>Tu carrito esta vacío</h3>
        </div>
      </td>
    </tr>`;
  } else {
    const CART_ITEM = cart.map(item => `
      <tr class="white-space"></tr>
        <tr class="cart-item table-item" id="product-item" data-id="${item.id}">
          <td>
            <div class="imgCartModalContainer">
              <img src="${item.image}" alt="${item.title}">
            </div>
          </td>
          <td>
            <div class="cart-modal-info">
              <h3>${item.title}</h3>
              <p>${formatCurrency(item.price)}</p>
              <input class="input-num" type="number" min="1" max="9" value="${item.quantity}">
            </div>
          </td>
        </tr>
        <tr class="white-space"></tr>
        <tr class="table-group-divider"></tr>
      `).join('');
    cartTable.innerHTML = CART_ITEM;
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
      return value;
    }
}

export function parseCurrency(value) {
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(value.replace(/[^0-9.-]+/g,""));
}

export function getCount(cart) {
  if (cart.length === 0) {
    return 0;
  }
  return cart.reduce((acc, item) => {
    const quantity = Number(item.quantity);
    return acc + (isNaN(quantity) ? 0 : quantity);
  }, 0);
}

export function drawSubtotal(cart) {
  let cartSubtotal = document.querySelector('#subtotal');
  let subtotal = cart.reduce((acc, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    return acc + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
  }, 0);
  if (subtotal === null) {
    subtotal = 0;
  }
  cartSubtotal.innerHTML = formatCurrency(subtotal);
  return subtotal;
}

export function updateCart(cart) {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  drawCartModal(cart);
  drawSubtotal(cart);
  const count = getCount(cart);
  document.querySelector('.cart-count').textContent = count;
  addInputEventListeners(cart);
}

function addInputEventListeners(cart) {
  const inputNumElements = document.querySelectorAll('.input-num');
  inputNumElements.forEach(inputNum => {
    inputNum.addEventListener('change', () => {
      const id = inputNum.closest('.table-item').dataset.id;
      const product = cart.find(item => item.id === id);
      if (product) {
        product.quantity = parseInt(inputNum.value);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart(cart);

        // Actualizar la cookie en el servidor
        const body = { id: id, quantity: product.quantity };
        fetch('/update_cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
          document.querySelector('#subtotal').textContent = formatCurrency(data.subtotal);
          document.querySelector('#total').textContent = formatCurrency(data.total);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    });
  });
}

//? ADMIN PANEL FUNCTIONS */

export function drawOrdersTable(orders) {
  const ordersContainer = document.querySelector('.main');
  orders ? orders : orders = [];
  ordersContainer.innerHTML = `
      <div class="table-container">
          <div class="col">
            <div class="header">
              <button type="button" class="btn addBtn" id="addNewOrderBtn"><i class="fa-solid fa-plus"></i>Agregar Pedido</button>
            </div>
            ${orders.length === 0 
              ? 
              '<h3 style="text-align: center;">No hay pedidos</h3>' 
              :
              `<table class="table">
              <thead>
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
              </thead>
              <tbody>
                <!-- Aquí van los pedidos -->
                ${orders.map(order => `
                    <tr>
                      <th scope="row" class="table-id">${order.id}</th>
                      <td>${order.nombre}</td>
                      <td>${order.email}</td>
                      <td class="table-product-list">${order.product_title} x${order.product_quantity}</td>
                      <td>${formatCurrency(order.precio_total)}</td>
                      <td>${order.status}</td>
                      <td>${order.fecha}</td>
                      <td class="actions">
                        ${order.status === 'pendiente' ? `<button type="button" class="finalBtn" id="completeOrder" data-id=${order.id}>Completar</button>` : ''}
                        <button type="button" class="btn btn-danger" id="del-order" data-id=${order.id}><i class="fa-regular fa-trash-can"></i></button>
                        <button type="button" class="btn btn-dark" id="viewOrderBtn" data-id=${order.id}>Abrir</button>
                      </td>
                    </tr>
                `).join('')}
              </tbody>
            </table>` 
            }
          </div>
        </div>
    `;
}

export function drawProductsTable(products, url) {
  const productsContainer = document.querySelector('.main');
  productsContainer.innerHTML = `
    <div class="table-container">
      <div class="col">
        <div class="header">
          <button type="button" class="btn addBtn" id="addNewProductBtn"><i class="fa-solid fa-plus"></i>Agregar Producto</button>
        </div>
        <table class="table">
          <thead>
            <tr class="align-content-center text-center">
              <th scope="col">ID</th>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Aquí van los productos -->
            ${products.map(product => `
              <tr class="product-row text-center">
                <th scope="row" class="table-id align-content-center">${product.id}</th>
                <td class="align-content-center">
                  <div class="table-img"> 
                    <img src="${url}${product.images.split(',')[0]}" alt="${product.title}">
                  </div>
                </td>
                <td class="align-content-center">${product.title}</td>
                <td class="align-content-center">${formatCurrency(product.price)}</td>
                <td class="align-content-center">
                  <button type="submit" class="btn btn-danger" id="del-product" data-id=${product.id}><i class="fa-regular fa-trash-can"></i></button>
                  <button type="button" class="btn btn-dark" id="viewProductBtn" data-id=${product.id}>Abrir</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function deleteProduct(id) {
  fetch(`/adminBoard/product/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'success') {
      console.log('Product deleted');
    } else console.log('Product not deleted');
  })
  .catch(error => console.error('Error:', error));
}

export function deleteOrder(id) {
  fetch(`/adminBoard/order/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if(!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      console.log('Order deleted');
    } else console.log('Order not deleted');
  })
  .catch(error => console.error('Error:', error));
}

export function completeOrder(id) {
  fetch(`/adminBoard/complete_order/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "enviado" }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'success') {
      console.log('Order completed');
      fetchOrders();
    } else console.log('Order not completed');
  })
}