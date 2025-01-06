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
        <tr class="cart-item" id="product-item" data-id="${item.id}">
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

export function drawCartPage(cart) {
  const cartTable = document.querySelector('.table-body-2');
  if (cart.length === 0) {
    // const cartBody = document.querySelector('.cart-body');
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
        <tr scope="row" class="table-item" id="product-item" data-id="${item.id}">
          <td class="img-td">
            <img src="${item.image}" alt="${item.title}">
          </td>
          <td class="align-top info-item">
            <h3>${item.title}</h3>
            <p>${formatCurrency(item.price)}</p>
          </td>
          <td class="align-top num-item"><input class="input-num" type="number" min="1" max="9" value="${item.quantity}"></td>
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
    return acc + item.quantity;
  }, 0);
}

export function drawSubtotal (cart) {
  let cartSubtotal = document.querySelector('#subtotal');

  let subtotal = cart.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
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
  document.querySelector('.cart-count').innerHTML = count;
  addInputEventListeners(cart);
}

function addInputEventListeners(cart) {
  const inputNum = document.querySelector('.input-num');
  inputNum.addEventListener('change', () => {
      const id = inputNum.closest('#product-item').dataset.id;
      const product = cart.find(item => item.id === id);
      product.quantity = parseInt(inputNum.value);
      localStorage.setItem('cart', JSON.stringify(cart));
      if(window.location.href.includes('cart-page')) {
        updateCartPage(cart);
      } else updateCart(cart);
  });
}

export function updateCartPage (cart) {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  drawCartPage(cart);
  drawSubtotal(cart);
  addInputEventListeners(cart);
  get_total(cart);
}

function get_total(cart) {
  let total = cart.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  if (total === null) {
    total = 0;
  }

  const INPUT_ENVIO = document.querySelector('#InputEnvio');
  let envio = 0;
  if (INPUT_ENVIO) {
    envio = parseCurrency(INPUT_ENVIO.value);
  }
  total += envio;
  console.log(total);
  document.querySelector('#total').innerHTML = formatCurrency(total);
  return total;
}