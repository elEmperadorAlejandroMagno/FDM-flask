document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://season-colorful-help.glitch.me';
    const genericModal = new bootstrap.Modal(document.getElementById('genericModal'));
    const addProductBtn = document.getElementById('addProductBtn');
    const viewProductBtn = document.getElementById('viewProductBtn');

    const modalTitle = document.getElementById('genericTitle');
    const modalBody = document.getElementById('genericBody');

    addProductBtn.addEventListener('click', () => {
        modalTitle.innerText = 'Add Product';
        modalBody.innerHTML = `
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
                    <button type="submit" class="btn btn-dark">Aceptar</button>
                    <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </form>
            `;
        genericModal.show();
    });
    viewProductBtn.addEventListener('click', () => {
        const id = viewProductBtn.getAttribute('data-id');
        fetch(`/adminBoard/products/${id}`)
        .then(res =>  res.json())
        .then(product => {
            product = product.product;
            modalTitle.innerText = 'Ver Productos';
            modalBody.innerHTML = `
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
                        <p>${product.price}</p>
                    </div>
                    <div class="mb-3">
                        <label for="productType" class="form-label>">Tipo de Producto</label>
                        <p>${product.type}</p>
                    </div>
                    <div class="mb-3">
                        <div class="productImages" style="display: grid; grid-template-columns: repeat(auto-fit, 200px); gap: 1rem;">
                            ${product.images.split(',').map(image => `<img src="${API_URL}${image}" alt="product image" class="productImage" style="max-width: 200px; max-height: 200px;">`).join('')}
                        </div>
                    </div>
                    <div class="mb-3" style="text-align: end;">
                        <button class="btn btn-dark" id="editBtn">Editar</button>
                        <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            `;
            genericModal.show();
            const editBtn = document.getElementById('editBtn');
            editBtn.addEventListener('click', () => {
                modalTitle.innerText = 'Editar Producto';
                modalBody.innerHTML = `
                    <form id="editProductForm">
                        <div class="mb-3">
                            <label for="productName" class="form-label">Nombre del Producto</label>
                            <input type="text" class="form-control" id="productName" name="name" value="${product.title}" required>
                        </div>
                        <div class="mb-3">
                            <label for="productName" class="form-label">Descripción del Producto</label>
                            <input type="text" class="form-control" id="productName" name="description" value="${product.description}" required>
                        </div>
                        <div class="mb-3">
                            <label for="productPrice" class="form-label">Precio del Producto</label>
                            <input type="number" class="form-control" id="productPrice" name="price" value="${product.price}" required>
                        </div>
                        <div class="mb-3">
                            <button class="btn btn-dark" id="submitModalBtn">Guardar</button>
                            <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </form>
                    `;
                const submitBtn = document.getElementById('submitModalBtn');
                submitBtn.addEventListener('click', () => {
                    const editProductForm = document.getElementById('editProductForm');
                    const formData = new FormData(editProductForm);
                    fetch(`/adminBoard/products/${id}`, {
                        method: 'PUT',
                        body: formData
                    }).then(res => res.json())
                    .then(data => {
                        if(data.success) {
                            genericModal.hide();
                            window.location.reload();
                        }
                    }).catch(err => {
                        console.log('Error:', err);
                    });
                });
            });
        }).catch(err => {
            console.log('Error:', err);
        });
    });
});

