import { formatCurrency }  from "./utils.js";

export function renderOrders(filter) {
  if (filter != null) {
    fetch(`/adminBoard/orders?filter=${filter}`)
      .then(response => response.json())
      .then(data => {
        const orders = data.orders;
        const ordersContainer = document.querySelector('.main');
        ordersContainer.innerHTML = `
            <div class="table-container">
                <div class="col">
                  <div class="header">
                    <button type="button" class="btn addBtn" id="addNewOrderBtn"><i class="fa-solid fa-plus"></i>Agregar Pedido</button>
                  </div>
                  <table class="table">
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
                            <td class="table-product-list">${order.lista_productos}</td>
                            <td>${formatCurrency(order.precio_total)}</td>
                            <td>${order.status}</td>
                            <td>${order.fecha}</td>
                            <td class="actions">
                              <button type="button" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button type="submit" class="btn btn-danger" id="del-order"><i class="fa-regular fa-trash-can"></i></button>
                              <button type="button" class="btn btn-dark" id="viewOrderBtn" data-id=${order.id}>Abrir</button>
                            </td>
                          </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
        `;
      })
      .catch(error => console.error('Error:', error));
    return
  }
    fetch('/adminBoard/orders')
      .then(response => response.json())
      .then(data => {
        const orders = data.orders;
        const ordersContainer = document.querySelector('.main');
        ordersContainer.innerHTML = `
            <div class="table-container">
                <div class="col">
                  <div class="header">
                    <button type="button" class="btn addBtn" id="addNewOrderBtn"><i class="fa-solid fa-plus"></i>Agregar Pedido</button>
                  </div>
                  <table class="table">
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
                            <td class="table-product-list">${order.lista_productos}</td>
                            <td>${formatCurrency(order.precio_total)}</td>
                            <td>${order.status}</td>
                            <td>${order.fecha}</td>
                            <td class="actions">
                              <button type="button" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i></button>
                              <form action="/adminBoard/order/${order.id}" method="DELETE">
                                <button type="submit" class="btn btn-danger" id="del-order"><i class="fa-regular fa-trash-can"></i></button>
                              </form>
                              <button type="button" class="btn btn-dark" id="viewOrderBtn" data-id=${order.id}>Abrir</button>
                            </td>
                          </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
        `;
      })
      .catch(error => console.error('Error:', error));
  };

export function renderProducts(url, filter) {
  const adminPanel = document.getElementById('adminPanel');
  if (filter != null) {
    fetch(`/adminBoard/products?filter=${filter}`)
      .then(response => response.json())
      .then(data => {
        const products = data.products;
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
                        <button type="button" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="submit" class="btn btn-danger" id="del-product"><i class="fa-regular fa-trash-can"></i></button>
                        <button type="button" class="btn btn-dark" id="viewProductBtn" data-id=${product.id}>Abrir</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      })
      .catch(error => console.error('Error:', error));
    return;
  }
  fetch('/adminBoard/products')
    .then(response => response.json())
    .then(data => {
      const products = data.products;
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
                      <button type="button" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button type="submit" class="btn btn-danger" id="del-product"><i class="fa-regular fa-trash-can"></i></button>
                      <button type="button" class="btn btn-dark" id="viewProductBtn" data-id=${product.id}>Abrir</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
  }).catch(error => console.error('Error:', error));
};

const adminPanel = document.getElementById('adminPanel');

adminPanel.addEventListener('click', (event) => {
  const target = event.target;

  if (target.id === 'del-product') {
    console.log('Delete Product button clicked');
  }
  else if (target.id === 'del-order') {
    console.log('Delete Order button clicked');
  }
  else if (target.id === 'viewProductBtn') {
    console.log('view product button clicked');
  }
  else if (target.id === 'viewOrderBtn') {
    console.log('View order button clicked');
  }
});

