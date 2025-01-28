import { API_URL } from './constants.js';
import { fetchProducts, fetchOrders } from './table_render.js';
import { renderAddProductModal, renderViewProductModal, renderEditProductModal, renderAddOrderModal, renderViewOrderModal, renderEditOrderModal } from './render_modals.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin modals script loaded');
    const genericModal = new bootstrap.Modal(document.getElementById('genericModal'));
    const modalTitle = document.getElementById('genericTitle');
    const modalBody = document.getElementById('genericBody');

    // Contenedor común
    const adminPanel = document.getElementById('adminPanel');

    adminPanel.addEventListener('click', (event) => {
        const target = event.target;
        console.log('Clicked element:', target);

        if (target.id === 'addNewProductBtn') {
            console.log('Add New Product button clicked');
            renderAddProductModal(genericModal, modalTitle, modalBody);

            const submitBtn = document.getElementById('genericFooter').firstElementChild;
            submitBtn.addEventListener('click', () => {
                const form = document.getElementById('addProductForm');
                const data = new FormData(form);

                fetch('/adminBoard/products', {
                    method: 'POST',
                    body: data
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        genericModal.hide();
                        fetchProducts(API_URL);
                    } else {
                        console.log('Error:', data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        }
        else if (target.id === 'viewProductBtn') {
            console.log('View Product button clicked');
            const id = target.getAttribute('data-id');
            fetch(`/adminBoard/product/${id}`)
            .then(res => res.json())
            .then(data => {
                const product = data.product;
                renderViewProductModal(product, API_URL, genericModal, modalTitle, modalBody);

                const editBtn = document.getElementById('editBtn');
                editBtn.addEventListener('click', () => {
                    console.log('Edit button clicked');
                    renderEditProductModal(product, id, modalTitle, modalBody);

                    const submitBtn = document.getElementById('submitModalBtn');
                    submitBtn.addEventListener('click', () => {
                        console.log('Submit button clicked');
                        const editProductForm = document.getElementById('editProductForm');
                        const formData = new FormData(editProductForm);

                        const price = formData.get('price');
                        formData.set('price', parseInt(price));

                        fetch(`/adminBoard/product/${id}`, {
                            method: 'PUT',
                            body: formData
                        }).then(res => res.json())
                        .then(data => {
                            if (data.status === 'success') {
                                genericModal.hide();
                                fetchProducts(API_URL);
                            } else {
                                console.log('Error:', data.message);
                            }
                        }).catch(err => {
                            console.log('Error:', err);
                        });
                    });
                });
            }).catch(err => {
                console.log('Error:', err);
            });
        }
        else if (target.id === 'addNewOrderBtn') {
            console.log('Add Order button clicked');
            renderAddOrderModal(genericModal, modalTitle, modalBody);

            const submitBtn = document.getElementById('genericFooter').firstElementChild;
            submitBtn.addEventListener('click', () => {
                const form = document.getElementById('addOrderForm');
                const data = new FormData(form);

                fetch('/adminBoard/orders', {
                    method: 'POST',
                    body: data
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        genericModal.hide();
                        fetchOrders();
                    } else {
                        console.log('Error:', data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        }
        else if (target.id === 'viewOrderBtn') {
            console.log('View Order button clicked');
            const id = target.getAttribute('data-id');
            fetch(`/adminBoard/order/${id}`)
            .then(res => res.json())
            .then(order => {
                renderViewOrderModal(order, genericModal, modalTitle, modalBody);

                const editOrderBtn = document.getElementById('editOrderBtn');
                editOrderBtn.addEventListener('click', () => {
                    console.log('Edit Order button clicked');
                    renderEditOrderModal(order, id, modalTitle, modalBody);

                    const submitBtn = document.getElementById('submitModalBtn');
                    submitBtn.addEventListener('click', () => {
                        console.log('Submit button clicked');
                        const editOrderForm = document.getElementById('editOrderForm');
                        const formData = new FormData(editOrderForm);

                        fetch(`/adminBoard/order/${id}`, {
                            method: 'PUT',
                            body: formData
                        }).then(res => res.json())
                        .then(data => {
                            if (data.status === 'success') {
                                genericModal.hide();
                                fetchOrders();
                            } else {
                                console.log('Error:', data.message);
                            }
                        }).catch(err => {
                            console.log('Error:', err);
                        });
                    });
                });
            }).catch(err => {
                console.log('Error:', err);
            });
        }
    });
});