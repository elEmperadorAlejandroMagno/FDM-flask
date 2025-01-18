document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://season-colorful-help.glitch.me';
    const genericModal = new bootstrap.Modal(document.getElementById('genericModal'));
    const modalTitle = document.getElementById('genericTitle');
    const modalBody = document.getElementById('genericBody');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');

    const showModal = (title, bodyContent, submitCallback) => {
        modalTitle.textContent = title;
        modalBody.innerHTML = bodyContent;
        modalSubmitBtn.onclick = submitCallback;
        genericModal.show();
    };

    // Modal para agregar un producto
    document.getElementById('addProductBtn').addEventListener('click', () => {
        const bodyContent = `
            <form id="addProductForm">
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
            </form>
        `;
        const submitCallback = () => {
            const formData = new FormData(document.getElementById('addProductForm'));
            fetch('/adminBoard/products', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    window.location.reload();
                } else {
                    alert('Error al agregar el producto');
                }
            })
            .catch(error => console.error('Error:', error));
        };
        showModal('Agregar Producto', bodyContent, submitCallback);
    });

    // Modal para ver y editar un producto
    document.querySelectorAll('.viewProductBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.id;
            fetch(`/adminBoard/products/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const product = data.product;
                const bodyContent = `
                    <div id="viewProductContent">
                        <h5 class="modal-title" id="exampleModalLabel">${product.title}</h5>
                        <p>${product.description}</p>
                        <p>${product.price}</p>
                        <div class="productImages">
                          ${product.images.split(',').map(img => `<img src="${API_URL}${img}" alt="${product.title}" style="max-width=120px;max-height: 120px;">`).join('')}
                        </div>
                        <button type="button" class="btn editBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-product-id="${product._id}">Editar</button>
                    </div>
                `;
                const submitCallback = () => {}; // No submit action for view mode
                showModal('Ver Producto', bodyContent, submitCallback);

                document.querySelector('.editBtn').addEventListener('click', () => {
                    const editBodyContent = `
                        <form id="editProductForm">
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
                                <div class="productImages">
                                  ${product.images.split(',').map(img => `<img src="${API_URL}${img}" alt="${product.title}" style="max-width=120px;max-height: 120px;">`).join('')}
                                </div>
                                <label for="productImage" class="form-label">Imagen del Producto</label>
                                <input type="file" class="form-control" id="productImage" name="images">
                            </div>
                        </form>
                    `;
                    const editSubmitCallback = () => {
                        const formData = new FormData(document.getElementById('editProductForm'));
                        fetch(`/adminBoard/products/${productId}`, {
                            method: 'PUT',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                window.location.reload();
                            } else {
                                alert('Error al editar el producto');
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    };
                    showModal('Editar Producto', editBodyContent, editSubmitCallback);
                });
            })
            .catch(error => console.error('Error:', error));
        });
    });

    // Similarmente, puedes agregar eventos para manejar órdenes
});

