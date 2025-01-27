import { deleteProduct, deleteOrder, completeOrder, drawOrdersTable, drawProductsTable }  from "./utils.js";
import { API_URL } from "./constants.js";

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

export function fetchProducts(url, filter) {
  if (filter != null) {
    fetch(`/adminBoard/products?filter=${filter}`)
      .then(response => response.json())
      .then(data => {
        const products = data.products;
        drawProductsTable(products, url);
      })
      .catch(error => console.error('Error:', error));
    return;
  }
  fetch('/adminBoard/products')
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      drawProductsTable(products, url);
  }).catch(error => console.error('Error:', error));
};

const adminPanel = document.getElementById('adminPanel');

adminPanel.addEventListener('click', (event) => {
  const target = event.target;

  if (target.id === 'del-product') {
    console.log('Delete Product button clicked');
    deleteProduct(target.dataset.id);
    fetchProducts(API_URL);
  }
  else if (target.id === 'del-order') {
    console.log('Delete Order button clicked');
    deleteOrder(target.dataset.id);
    fetchOrders();
  }
  else if (target.id === 'completeOrder') {
    console.log('Complete Order button clicked');
    completeOrder(target.dataset.id);
    fetchOrders();
  }
});

