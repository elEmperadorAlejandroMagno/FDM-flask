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


        if (target.id === 'addNewProductBtn') {

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

            const id = target.getAttribute('data-id');
            fetch(`/adminBoard/product/${id}`)
            .then(res => res.json())
            .then(data => {
                const product = data.product;
                renderViewProductModal(product, API_URL, genericModal, modalTitle, modalBody);

                const editBtn = document.getElementById('editBtn');
                editBtn.addEventListener('click', () => {

                    renderEditProductModal(product, id, modalTitle, modalBody);

                    const submitBtn = document.getElementById('submitModalBtn');
                    submitBtn.addEventListener('click', () => {

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

            const id = target.getAttribute('data-id');
            fetch(`/adminBoard/order/${id}`)
            .then(res => res.json())
            .then(data => {

                const order = data.order[0];
                renderViewOrderModal(order, genericModal, modalTitle, modalBody);

                const editOrderBtn = document.getElementById('genericFooter').firstElementChild;
                editOrderBtn.addEventListener('click', () => {

                    renderEditOrderModal(order, id, modalTitle, modalBody);

                    const saveChangesBtn = document.getElementById('genericFooter').firstElementChild;
                    saveChangesBtn.addEventListener('click', () => {
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