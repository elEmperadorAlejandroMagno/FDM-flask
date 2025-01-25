import { formatCurrency }  from "./utils.js";

export function renderOrders() {
    fetch('/adminBoard/orders')
      .then(response => response.json())
      .then(data => {
        const orders = data.orders;
        console.log(orders);
        const ordersContainer = document.querySelector('.main');
        ordersContainer.innerHTML = `
            <div class="table-container">
                <div class="col">
                  <div class="header">
                    <button type="button" class="btn addBtn" id="addOrderBtn"><i class="fa-solid fa-plus"></i>Agregar Pedido</button>
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
                              <button type="submit" class="btn btn-danger del-orders"><i class="fa-regular fa-trash-can"></i></button>
                              <button type="button" class="btn btn-dark">Abrir</button>
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

export function renderProducts(url) {
  fetch('/adminBoard/products')
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      const productsContainer = document.querySelector('.main');
      productsContainer.innerHTML = `
        <div class="table-container">
          <div class="col">
            <div class="header">
              <button type="button" class="btn addBtn" id="addProductBtn"><i class="fa-solid fa-plus"></i>Agregar Producto</button>
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
                      <button type="submit" class="btn btn-danger del-products"><i class="fa-regular fa-trash-can"></i></button>
                      <button type="button" class="btn btn-dark">Abrir</button>
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