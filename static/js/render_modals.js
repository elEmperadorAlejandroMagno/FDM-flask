import { formatCurrency } from './utils.js';

export function renderAddProductModal(modal, title, body) {
    const addProductModal = `
    <form id="addProductForm" action="/adminBoard/products" method="POST" enctype="multipart/form-data">
        <div class="mb-3">
            <label for="productName" class="form-label">Nombre del Producto</label>
            <input type="text" class="form-control" id="productName" name="name" required>
        </div>
        <div class="mb-3">
            <label for="productName" class="form-label">Descripción del Producto</label>
            <input type="text" class="form-control" id="productName" name="description" required>
        </div>
        <div class="mb-3">
            <label for="productPrice" class="form-label">Precio del Producto</label>
            <input type="number" class="form-control" id="productPrice" name="price" required>
        </div>
        <div class="mb-3">
            <select class="form-select" name="type" required>
            <option value="0" selected disabled>Elige un tipo</option>
            <option value="sauce">Salsa</option>
            <option value="merch">Merchandising</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="productImage" class="form-label">Imagen del Producto</label>
            <input type="file" class="form-control" id="productImage" name="images" required>
        </div>
        <div class="modal-footer" id="genericFooter">
            <button type="button" class="btn btn-dark">Aceptar</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
        </div>
    </form>
    `;
    title.innerText = 'Add Product';
    body.innerHTML = addProductModal;
    modal.show();
}
export function renderViewProductModal(product, url, modal, title, body){
    const viewProductModal = `
    <div id="productContainer">
        <div class="mb-3">
            <label for="productName" class="form-label">Nombre del Producto</label>
            <h3>${product.title}</h3>
        </div>
        <div class="mb-3">
            <label for="productDescription" class="form-label">Descripción del Producto</label>
            <p>${product.description}</p>
        </div>
        <div class="mb-3">
            <label for="productPrice" class="form-label">Precio del Producto</label>
            <p>${formatCurrency(product.price)}</p>
        </div>
        <div class="mb-3">
            <label for="productType" class="form-label">Tipo de Producto</label>
            <p>${product.type}</p>
        </div>
        <div class="mb-3">
            <div class="productImages" style="display: grid; grid-template-columns: repeat(auto-fit, 200px); gap: 1rem;">
                ${product.images.split(',').map(image => `<img src="${url}${image}" alt="product image" class="productImage" style="max-width: 200px; max-height: 200px;">`).join('')}
            </div>
        </div>
        <div class="mb-3" style="text-align: end;">
            <button type="button" class="btn btn-dark" id="editBtn">Editar</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
        </div>
    </div>
    `;
    title.innerText = 'Ver Productos';
    body.innerHTML = viewProductModal;
    modal.show();
}
export function renderEditProductModal(product, id, title, body) {
    const editProductModal = `
    <form id="editProductForm" action="/adminBoard/product/${id}" method="PUT">
        <div class="mb-3">
            <label for="productName" class="form-label">Nombre del Producto</label>
            <input type="text" class="form-control" id="productName" name="title" value="${product.title}" required>
        </div>
        <div class="mb-3">
            <label for="productDescription" class="form-label">Descripción del Producto</label>
            <input type="text" class="form-control" id="productDescription" name="description" value="${product.description}" required>
        </div>
        <div class="mb-3">
            <label for="productPrice" class="form-label">Precio del Producto</label>
            <input type="number" class="form-control" id="productPrice" name="price" value="${product.price}" required>
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-dark" id="submitModalBtn">Guardar</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
        </div>
    </form>
    `;
    title.innerText = 'Editar Producto';
    body.innerHTML = editProductModal;
}
export function renderAddOrderModal(modal, title, body) {
    const addOrderModal = `
        <form id="addOrderForm" action="/adminBoard/orders" method="POST">
            <div class="mb-3">
                <label for="name" class="form-label">Nombre completo</label>
                <input type="text" class="form-control" id="name" name="name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3 text-center">
                <label for="product" class="form-label">Productos</label>
                <div class="productListContainer">
                    <span>
                        <input type="text" class="form-control" name="product_name[]" required value="Salsa de Arandanos">
                        <input type="number" class="form-control" name="product_quantity[]" min="1" max="9" value="1">
                    </span>
                </div>
                <button type="button" class="finalBtn" id="addProductToOrder">Agregar producto</button>
            </div>
            <div class="mb-3 text-center">
            <select name="envio" id="envioSelect">
                <option value="50">Montevideo</option>
                <option value="50">Ciudad de la costa</option>
                <option value="A definir">Resto del país</option>
                <option value="Free">Retiro del lugar</option>
            </select>
            </div>
            <div class="mb-3">
                <label for="phone">Teléfono</label>
                <input type="tel" class="form-control" id="phone" name="phone" required>
            </div>
            <div class="modal-footer" id="genericFooter">
                <button type="button" class="btn btn-dark">Aceptar</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </form>
    `;
    title.innerText = 'Add Order';
    body.innerHTML = addOrderModal;
    modal.show();

    // Delegación de eventos para agregar productos
    body.addEventListener('click', (event) => {
        console.log('Body button clicked');
        if (event.target && event.target.id === 'addProductToOrder') {
            console.log('Add Product button clicked');
            const productListContainer = document.querySelector('.productListContainer');
            const newProductInput = document.createElement('span');
            newProductInput.innerHTML = `
                <input type="text" class="form-control" name="product_name[]" placeholder="Salsa de viejo sabroso" required>
                <input type="number" class="form-control" name="product_quantity[]" placeholder="1" min="1" max="9" value="1" required>
            `;
            productListContainer.appendChild(newProductInput);
        }
    });
}
export function renderViewOrderModal(order, modal, title, body) {
    const viewOrderModal = `
    <div id="orderContainer">
        div class="mb-3">
            <span>Orden: ${order._id}</span>
            <span>Fecha: ${order.date}</span>
            <span>Estado: ${order.status}</span>
        </div>
        <div class="mb-3">
            <label for="orderName" class="form-label">Nombre del Cliente</label>
            <p>${order.name}</p>
        </div>
        <div class="mb-3">
            <label for="orderEmail" class="form-label">Email del Cliente</label>
            <p>${order.email}</p>
        </div>
        <div class="mb-3">
            <label for="orderPhone" class="form-label">Teléfono del Cliente</label>
            <p>${order.phone}</p>
        </div>
        <div class="mb-3">
            <label for="order" class="form-label">order</label>
            <p>${order.products}</p>
        </div>
        <div class="mb-3">
            <label for="orderEnvio" class="form-label>Envio</label>
            <p>${order.envio}</p>
        </div>
        ${order.direccion ? `
            <div class="mb-3">
                <label for="orderDireccion" class="form-label">Dirección de envío</label>
                <p>${order.direccion}</p>
            </div>
        `: ''}
        <div class="modal-footer" id="genericFooter">
            <button type="button" class="btn btn-dark" class="editOrderBtn">Editar</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
        </div>
        `;
    title.innerText = 'Ver Orden';
    body.innerHTML = viewOrderModal;
    modal.show();
}
export function renderEditOrderModal(order, id, title, body) {
    const editOrderModal = `
    <form id="editOrderForm" action="/adminBoard/order/${id}" method="PUT">
        <div class="mb-3">
            <label for="orderName" class="form-label">Nombre del Cliente</label>
            <input>${order.name}</input>
        </div>
        <div class="mb-3">
            <label for="orderEmail" class="form-label">Email del Cliente</label>
            <input>${order.email}</input>
        </div>
        <div class="mb-3">
            <label for="orderPhone" class="form-label">Teléfono del Cliente</label>
            <input>${order.phone}</input>
        </div>
        <div class="mb-3">
        <div class="mb-3">
            <label for="product" class="form-label">Productos</label>
            <div class="productListContainer">
                <span>
                    <input>${order.products['title']}</input>
                    <input type="number" min="1" max="9">${order.products['cantidad']}</input>
                </span>
            </div>
            <button type="button" class="btn finalBtn" id="addProductToOrder">Agregar producto</button>
        </div>
        <div class="mb-3 text-center">
            <label for="orderEnvio" class="form-label>Envio</label>
            <select name="envio" id="envioSelect">
                <option value=${order.envio} selected disabled>${order.envio}</option>
                <option value="50">Montevideo</option>
                <option value="50">Ciudad de la costa</option>
                <option value="A definir">Resto del país</option>
                <option value="Free">Retiro del lugar</option>
            </select>
        </div>
        ${order.direccion ? `
            <div class="mb-3">
                <label for="orderDireccion" class="form-label">Dirección de envío</label>
                <input>${order.direccion}</input>
            </div>
        `: ''}
        <div class="modal-footer" id="genericFooter">
            <button type="button" class="btn btn-dark" class="submitModalBtn">Guardar</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
        </div>
    </form>
    `;
    title.innerText = 'Editar Orden';
    body.innerHTML = editOrderModal;

    // Delegación de eventos para agregar productos
    body.addEventListener('click', (event) => {
        console.log('Body button clicked');
        if (event.target && event.target.id === 'addProductToOrder') {
            console.log('Add Product button clicked');
            const productListContainer = document.querySelector('.productListContainer');
            const newProductInput = document.createElement('span');
            newProductInput.innerHTML = `
                <input type="text" class="form-control" name="product_name[]" placeholder="Nombre del Producto" required>
                <input type="number" class="form-control" name="product_quantity[]" placeholder="Cantidad" min="1" max="9" required>
            `;
            productListContainer.appendChild(newProductInput);
        }
    });
}