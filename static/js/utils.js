export function drawCartModal(cart) {
  const cartTable = document.querySelector('.table-body');
  const CART_ITEM = cart.map(item => `
    <tr class="white-space"></tr>
      <tr class="cart-item">
        <td>
          <div class="imgCartModalContainer">
            <img src="${item.image}" alt="${item.title}">
          </div>
        </td>
        <td>
          <div class="cart-modal-info">
            <h3>${item.title}</h3>
            <p>${formatCurrency(item.price)}</p>
            <input type="number" value="${item.quantity}">
          </div>
        </td>
      </tr>
      <tr class="white-space"></tr>
      <tr class="table-group-divider"></tr>
    `).join('');
  cartTable.innerHTML = CART_ITEM;
}

export function drawCartPage(cart) {
  const cartTable = document.querySelector('.table-body-2');
  const CART_ITEM = cart.map(item => `
    <tr class="white-space"></tr>
      <tr scope="row" class="table-item">
        <td class="img-td">
          <img src="${item.image}" alt="${item.title}">
        </td>
        <td class="align-top info-item">
          <h3>${item.title}</h3>
          <p>${formatCurrency(item.price)}</p>
        </td>
        <td class="align-top num-item"><input type="number" value="${item.quantity}"></td>
        <td class="align-top price-pack">${formatCurrency(item.price * item.quantity)}</td>
        <td class="align-top">
          <button class="btn-danger"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
      <tr class="white-space"></tr>
      <tr class="table-group-divider"></tr>
    `).join('');
    cartTable.innerHTML = CART_ITEM;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU'
  }).format(value);
}

export function parseCurrency(value) {
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(value.replace(/[^0-9.-]+/g,""));
}


export function drawSubtotal () {
  let subtotal = localStorage.getItem('cartSubtotal', 0);
  let cartSubtotal = document.querySelector('.cart-subtotal');
  cartSubtotal.innerHTML = formatCurrency(subtotal);
}