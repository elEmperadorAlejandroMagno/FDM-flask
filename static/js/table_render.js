import { drawOrdersTable, drawProductsTable }  from "./draw_component.js";

export function fetchOrders(filter) {
  if (filter != null) {
    fetch(`/adminBoard/orders?filter=${filter}`)
      .then(response => response.json())
      .then(data => {
        const orders = data.orders;
        drawOrdersTable(orders);
      })
      .catch(error => console.error('Error:', error));
    return
  }
  fetch('/adminBoard/orders')
    .then(response => response.json())
    .then(data => {
      const orders = data.orders;
      drawOrdersTable(orders);
    })
    .catch(error => console.error('Error:', error));
};

export function fetchProducts(filter) {
  if (filter != null) {
    fetch(`/adminBoard/products?filter=${filter}`)
      .then(response => response.json())
      .then(data => {
        const products = data.products;
        drawProductsTable(products);
      })
      .catch(error => console.error('Error:', error));
    return;
  }
  fetch('/adminBoard/products')
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      drawProductsTable(products);
  }).catch(error => console.error('Error:', error));
};

function deleteProduct(id) {
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

function deleteOrder(id) {
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

function completeOrder(id) {
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

const adminPanel = document.getElementById('adminPanel');
if (adminPanel != null) {
  adminPanel.addEventListener('click', (event) => {
    const target = event.target;
  
    if (target.id === 'del-product') {

      deleteProduct(target.dataset.id);
      fetchProducts();
    }
    else if (target.id === 'del-order') {

      deleteOrder(target.dataset.id);
      fetchOrders();
    }
    else if (target.id === 'completeOrder') {

      completeOrder(target.dataset.id);
      fetchOrders();
    }
  });
}


