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