import { formatCurrency } from './draw_component.js';

export function createEmptyCartRow() {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 2;

  const div = document.createElement('div');
  div.className = 'empty-cart';

  const h3 = document.createElement('h3');
  h3.textContent = 'Tu carrito esta vacío';

  div.appendChild(h3);
  td.appendChild(div);
  tr.appendChild(td);

  return tr;
}

export function createCartItemRow(item) {
  // Espacio en blanco antes
  const trSpace1 = document.createElement('tr');
  trSpace1.className = 'white-space';

  // Fila principal del producto
  const tr = document.createElement('tr');
  tr.className = 'cart-item table-item';
  tr.id = 'product-item';
  tr.dataset.id = item.id;

  // Imagen
  const tdImg = document.createElement('td');
  const divImg = document.createElement('div');
  divImg.className = 'imgCartModalContainer';
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.title;
  divImg.appendChild(img);
  tdImg.appendChild(divImg);

  // Info
  const tdInfo = document.createElement('td');
  const divInfo = document.createElement('div');
  divInfo.className = 'cart-modal-info';
  const h3 = document.createElement('h3');
  h3.textContent = item.title;
  const p = document.createElement('p');
  p.textContent = formatCurrency(item.price);
  const input = document.createElement('input');
  input.className = 'input-num';
  input.type = 'number';
  input.value = item.quantity;
  input.readOnly;
  divInfo.appendChild(h3);
  divInfo.appendChild(p);
  divInfo.appendChild(input);
  tdInfo.appendChild(divInfo);

  tr.appendChild(tdImg);
  tr.appendChild(tdInfo);

  // Espacio en blanco después
  const trSpace2 = document.createElement('tr');
  trSpace2.className = 'white-space';

  // Divider
  const trDivider = document.createElement('tr');
  trDivider.className = 'table-group-divider';

  // Devuelve un array de filas para insertar en orden
  return [trSpace1, tr, trSpace2, trDivider];
}

export function createOrderRow(order, formatCurrency) {
  const tr = document.createElement('tr');

  // ID
  const thId = document.createElement('th');
  thId.scope = "row";
  thId.className = "table-id";
  thId.textContent = order.order_id;
  tr.appendChild(thId);

  // Nombre
  const tdNombre = document.createElement('td');
  tdNombre.textContent = order.nombre;
  tr.appendChild(tdNombre);

  // Correo
  const tdEmail = document.createElement('td');
  tdEmail.className = "orderEmailTable custom-width";
  tdEmail.textContent = order.email;
  tr.appendChild(tdEmail);

  // Productos
  const tdProductos = document.createElement('td');
  tdProductos.className = "table-product-list";
  order.productos.forEach(producto => {
    const span = document.createElement('span');
    span.className = "orderProductTable";
    const pTitle = document.createElement('p');
    pTitle.textContent = producto.product_title;
    const pCantidad = document.createElement('p');
    pCantidad.textContent = `x${producto.cantidad}`;
    span.appendChild(pTitle);
    span.appendChild(pCantidad);
    tdProductos.appendChild(span);
  });
  tr.appendChild(tdProductos);

  // Total
  const tdTotal = document.createElement('td');
  tdTotal.textContent = formatCurrency(order.precio_total);
  tr.appendChild(tdTotal);

  // Estado
  const tdStatus = document.createElement('td');
  tdStatus.textContent = order.status;
  tr.appendChild(tdStatus);

  // Fecha
  const tdFecha = document.createElement('td');
  tdFecha.textContent = order.fecha;
  tr.appendChild(tdFecha);

  // Acciones
  const tdAcciones = document.createElement('td');
  tdAcciones.className = "actions";
  if (order.status === 'pendiente') {
    const btnCompletar = document.createElement('button');
    btnCompletar.type = "button";
    btnCompletar.className = "finalBtn";
    btnCompletar.id = "completeOrder";
    btnCompletar.dataset.id = order.order_id;
    btnCompletar.textContent = "Completar";
    tdAcciones.appendChild(btnCompletar);
  }
  const btnEliminar = document.createElement('button');
  btnEliminar.type = "button";
  btnEliminar.className = "btn btn-danger";
  btnEliminar.id = "del-order";
  btnEliminar.dataset.id = order.order_id;
  btnEliminar.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  tdAcciones.appendChild(btnEliminar);

  const btnVer = document.createElement('button');
  btnVer.type = "button";
  btnVer.className = "btn btn-dark";
  btnVer.id = "viewOrderBtn";
  btnVer.dataset.id = order.order_id;
  btnVer.textContent = "Abrir";
  tdAcciones.appendChild(btnVer);

  tr.appendChild(tdAcciones);

  return tr;
}

export function createProductRow(product, url, formatCurrency) {
  const tr = document.createElement('tr');
  tr.className = "product-row text-center";

  // ID
  const thId = document.createElement('th');
  thId.scope = "row";
  thId.className = "table-id align-content-center";
  thId.textContent = product.id;
  tr.appendChild(thId);

  // Imagen
  const tdImg = document.createElement('td');
  tdImg.className = "align-content-center";
  const divImg = document.createElement('div');
  divImg.className = "table-img";
  const img = document.createElement('img');
  img.src = url + (Array.isArray(product.images) ? product.images[0] : product.images.split(',')[0]);
  img.alt = product.title;
  divImg.appendChild(img);
  tdImg.appendChild(divImg);
  tr.appendChild(tdImg);

  // Nombre
  const tdNombre = document.createElement('td');
  tdNombre.className = "align-content-center";
  tdNombre.textContent = product.title;
  tr.appendChild(tdNombre);

  // Precio
  const tdPrecio = document.createElement('td');
  tdPrecio.className = "align-content-center";
  tdPrecio.textContent = formatCurrency(product.price);
  tr.appendChild(tdPrecio);

  // Acciones
  const tdAcciones = document.createElement('td');
  tdAcciones.className = "align-content-center";
  const btnEliminar = document.createElement('button');
  btnEliminar.type = "submit";
  btnEliminar.className = "btn btn-danger";
  btnEliminar.id = "del-product";
  btnEliminar.dataset.id = product.id;
  btnEliminar.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  tdAcciones.appendChild(btnEliminar);

  const btnVer = document.createElement('button');
  btnVer.type = "button";
  btnVer.className = "btn btn-dark";
  btnVer.id = "viewProductBtn";
  btnVer.dataset.id = product.id;
  btnVer.textContent = "Abrir";
  tdAcciones.appendChild(btnVer);

  tr.appendChild(tdAcciones);

  return tr;
}

// ADMIN MODALS

export function createAddProductForm() {
    const form = document.createElement('form');
    form.id = "addProductForm";
    form.action = "/adminBoard/products";
    form.method = "POST";
    form.enctype = "multipart/form-data";

    // Nombre
    const divName = document.createElement('div');
    divName.className = "mb-3 d-flex justify-content-between";
    const labelName = document.createElement('label');
    labelName.htmlFor = "productName";
    labelName.className = "form-label";
    labelName.textContent = "Nombre del Producto";
    const inputName = document.createElement('input');
    inputName.type = "text";
    inputName.className = "form-control textInput";
    inputName.id = "productName";
    inputName.name = "name";
    inputName.required = true;
    divName.appendChild(labelName);
    divName.appendChild(inputName);

    // Descripción
    const divDesc = document.createElement('div');
    divDesc.className = "mb-3";
    const labelDesc = document.createElement('label');
    labelDesc.htmlFor = "productDescription";
    labelDesc.className = "form-label";
    labelDesc.textContent = "Descripción del Producto";
    const inputDesc = document.createElement('input');
    inputDesc.type = "text";
    inputDesc.className = "form-control";
    inputDesc.id = "productDescription";
    inputDesc.name = "description";
    inputDesc.required = true;
    divDesc.appendChild(labelDesc);
    divDesc.appendChild(inputDesc);

    // Precio
    const divPrice = document.createElement('div');
    divPrice.className = "mb-3 d-flex justify-content-between";
    const labelPrice = document.createElement('label');
    labelPrice.htmlFor = "productPrice";
    labelPrice.className = "form-label";
    labelPrice.textContent = "Precio del Producto";
    const inputPrice = document.createElement('input');
    inputPrice.type = "number";
    inputPrice.className = "form-control priceInput";
    inputPrice.id = "productPrice";
    inputPrice.name = "price";
    inputPrice.required = true;
    divPrice.appendChild(labelPrice);
    divPrice.appendChild(inputPrice);

    // Tipo
    const divType = document.createElement('div');
    divType.className = "mb-3 d-flex justify-content-between";
    const labelType = document.createElement('label');
    labelType.htmlFor = "productType";
    labelType.className = "form-label";
    labelType.textContent = "Tipo de Producto";
    const selectType = document.createElement('select');
    selectType.className = "form-select custom-width";
    selectType.name = "type";
    selectType.required = true;
    const optionDefault = document.createElement('option');
    optionDefault.value = "0";
    optionDefault.selected = true;
    optionDefault.disabled = true;
    optionDefault.textContent = "Elige un tipo";
    const optionSalsa = document.createElement('option');
    optionSalsa.value = "sauce";
    optionSalsa.textContent = "Salsa";
    const optionMerch = document.createElement('option');
    optionMerch.value = "merch";
    optionMerch.textContent = "Merchandising";
    selectType.appendChild(optionDefault);
    selectType.appendChild(optionSalsa);
    selectType.appendChild(optionMerch);
    divType.appendChild(labelType);
    divType.appendChild(selectType);

    // Imagen
    const divImg = document.createElement('div');
    divImg.className = "mb-3";
    const labelImg = document.createElement('label');
    labelImg.htmlFor = "productImage";
    labelImg.className = "form-label";
    labelImg.textContent = "Imagen del Producto";
    const inputImg = document.createElement('input');
    inputImg.type = "file";
    inputImg.className = "form-control";
    inputImg.id = "productImage";
    inputImg.name = "images";
    inputImg.required = true;
    divImg.appendChild(labelImg);
    divImg.appendChild(inputImg);

    // Footer
    const footer = document.createElement('div');
    footer.className = "modal-footer";
    footer.id = "genericFooter";
    const btnAceptar = document.createElement('button');
    btnAceptar.type = "button";
    btnAceptar.className = "btn btn-dark";
    btnAceptar.textContent = "Aceptar";
    const btnCancelar = document.createElement('button');
    btnCancelar.type = "button";
    btnCancelar.className = "btn btn-danger";
    btnCancelar.setAttribute('data-bs-dismiss', 'modal');
    btnCancelar.textContent = "Cancelar";
    footer.appendChild(btnAceptar);
    footer.appendChild(btnCancelar);

    // Agregar todo al form
    form.appendChild(divName);
    form.appendChild(divDesc);
    form.appendChild(divPrice);
    form.appendChild(divType);
    form.appendChild(divImg);
    form.appendChild(footer);

    return form;
}

// PRODUCTOS
export function createViewProductModal(product, url, formatCurrency) {
    const container = document.createElement('div');
    container.id = "productContainer";

    // Nombre
    const divName = document.createElement('div');
    divName.className = "mb-3";
    const labelName = document.createElement('label');
    labelName.className = "form-label";
    labelName.textContent = "Nombre del Producto";
    const h3 = document.createElement('h3');
    h3.textContent = product.title;
    divName.appendChild(labelName);
    divName.appendChild(h3);

    // Descripción
    const divDesc = document.createElement('div');
    divDesc.className = "mb-3";
    const labelDesc = document.createElement('label');
    labelDesc.className = "form-label";
    labelDesc.textContent = "Descripción del Producto";
    const pDesc = document.createElement('p');
    pDesc.textContent = product.description;
    divDesc.appendChild(labelDesc);
    divDesc.appendChild(pDesc);

    // Precio
    const divPrice = document.createElement('div');
    divPrice.className = "mb-3";
    const labelPrice = document.createElement('label');
    labelPrice.className = "form-label";
    labelPrice.textContent = "Precio del Producto";
    const pPrice = document.createElement('p');
    pPrice.textContent = formatCurrency(product.price);
    divPrice.appendChild(labelPrice);
    divPrice.appendChild(pPrice);

    // Tipo
    const divType = document.createElement('div');
    divType.className = "mb-3";
    const labelType = document.createElement('label');
    labelType.className = "form-label";
    labelType.textContent = "Tipo de Producto";
    const pType = document.createElement('p');
    pType.textContent = product.type;
    divType.appendChild(labelType);
    divType.appendChild(pType);

    // Imágenes
    const divImgs = document.createElement('div');
    divImgs.className = "mb-3";
    const imgsContainer = document.createElement('div');
    imgsContainer.className = "productImages";
    imgsContainer.style.display = "grid";
    imgsContainer.style.gridTemplateColumns = "repeat(auto-fit, 200px)";
    imgsContainer.style.gap = "1rem";
    (Array.isArray(product.images) ? product.images : product.images.split(',')).forEach(image => {
        const img = document.createElement('img');
        img.src = url + image;
        img.alt = "product image";
        img.className = "productImage";
        img.style.maxWidth = "200px";
        img.style.maxHeight = "200px";
        imgsContainer.appendChild(img);
    });
    divImgs.appendChild(imgsContainer);

    // Footer
    const divFooter = document.createElement('div');
    divFooter.className = "mb-3";
    divFooter.style.textAlign = "end";
    const btnEdit = document.createElement('button');
    btnEdit.type = "button";
    btnEdit.className = "btn btn-dark";
    btnEdit.id = "editBtn";
    btnEdit.textContent = "Editar";
    const btnCancel = document.createElement('button');
    btnCancel.type = "button";
    btnCancel.className = "btn btn-danger";
    btnCancel.setAttribute('data-bs-dismiss', 'modal');
    btnCancel.textContent = "Cancelar";
    divFooter.appendChild(btnEdit);
    divFooter.appendChild(btnCancel);

    // Ensamblar
    container.appendChild(divName);
    container.appendChild(divDesc);
    container.appendChild(divPrice);
    container.appendChild(divType);
    container.appendChild(divImgs);
    container.appendChild(divFooter);

    return container;
}

export function createEditProductForm(product, id) {
    const form = document.createElement('form');
    form.id = "editProductForm";
    form.action = `/adminBoard/product/${id}`;
    form.method = "PUT";

    // Nombre
    const divName = document.createElement('div');
    divName.className = "mb-3";
    const labelName = document.createElement('label');
    labelName.className = "form-label";
    labelName.textContent = "Nombre del Producto";
    const inputName = document.createElement('input');
    inputName.type = "text";
    inputName.className = "form-control";
    inputName.id = "productName";
    inputName.name = "title";
    inputName.value = product.title;
    inputName.required = true;
    divName.appendChild(labelName);
    divName.appendChild(inputName);

    // Descripción
    const divDesc = document.createElement('div');
    divDesc.className = "mb-3";
    const labelDesc = document.createElement('label');
    labelDesc.className = "form-label";
    labelDesc.textContent = "Descripción del Producto";
    const inputDesc = document.createElement('input');
    inputDesc.type = "text";
    inputDesc.className = "form-control";
    inputDesc.id = "productDescription";
    inputDesc.name = "description";
    inputDesc.value = product.description;
    inputDesc.required = true;
    divDesc.appendChild(labelDesc);
    divDesc.appendChild(inputDesc);

    // Precio
    const divPrice = document.createElement('div');
    divPrice.className = "mb-3";
    const labelPrice = document.createElement('label');
    labelPrice.className = "form-label";
    labelPrice.textContent = "Precio del Producto";
    const inputPrice = document.createElement('input');
    inputPrice.type = "number";
    inputPrice.className = "form-control";
    inputPrice.id = "productPrice";
    inputPrice.name = "price";
    inputPrice.value = product.price;
    inputPrice.required = true;
    divPrice.appendChild(labelPrice);
    divPrice.appendChild(inputPrice);

    // Footer
    const divFooter = document.createElement('div');
    divFooter.className = "mb-3";
    const btnGuardar = document.createElement('button');
    btnGuardar.type = "button";
    btnGuardar.className = "btn btn-dark";
    btnGuardar.id = "submitModalBtn";
    btnGuardar.textContent = "Guardar";
    const btnCancelar = document.createElement('button');
    btnCancelar.type = "button";
    btnCancelar.className = "btn btn-danger";
    btnCancelar.setAttribute('data-bs-dismiss', 'modal');
    btnCancelar.textContent = "Cancelar";
    divFooter.appendChild(btnGuardar);
    divFooter.appendChild(btnCancelar);

    form.appendChild(divName);
    form.appendChild(divDesc);
    form.appendChild(divPrice);
    form.appendChild(divFooter);

    return form;
}

export function createAddOrderForm() {
    const form = document.createElement('form');
    form.id = "addOrderForm";
    form.action = "/adminBoard/orders";
    form.method = "POST";

    // Nombre
    const divName = document.createElement('div');
    divName.className = "mb-3 d-flex justify-content-between";
    const labelName = document.createElement('label');
    labelName.htmlFor = "name";
    labelName.className = "form-label";
    labelName.textContent = "Nombre completo";
    const inputName = document.createElement('input');
    inputName.type = "text";
    inputName.className = "form-control textInput";
    inputName.id = "name";
    inputName.name = "nombre";
    inputName.required = true;
    divName.appendChild(labelName);
    divName.appendChild(inputName);

    // Email
    const divEmail = document.createElement('div');
    divEmail.className = "mb-3 d-flex justify-content-between";
    const labelEmail = document.createElement('label');
    labelEmail.htmlFor = "email";
    labelEmail.className = "form-label";
    labelEmail.textContent = "Email";
    const inputEmail = document.createElement('input');
    inputEmail.type = "email";
    inputEmail.className = "form-control textInput";
    inputEmail.id = "email";
    inputEmail.name = "email";
    inputEmail.required = true;
    divEmail.appendChild(labelEmail);
    divEmail.appendChild(inputEmail);

    // Teléfono
    const divPhone = document.createElement('div');
    divPhone.className = "mb-3 d-flex justify-content-between";
    const labelPhone = document.createElement('label');
    labelPhone.htmlFor = "phone";
    labelPhone.className = "form-label";
    labelPhone.textContent = "Teléfono";
    const inputPhone = document.createElement('input');
    inputPhone.type = "number";
    inputPhone.className = "form-control numInput";
    inputPhone.id = "phone";
    inputPhone.name = "telefono";
    inputPhone.required = true;
    divPhone.appendChild(labelPhone);
    divPhone.appendChild(inputPhone);

    // Productos
    const divProducts = document.createElement('div');
    divProducts.className = "mb-3 text-center";
    const labelProducts = document.createElement('label');
    labelProducts.className = "form-label";
    labelProducts.textContent = "Productos";
    const productListContainer = document.createElement('div');
    productListContainer.className = "productListContainer";
    const span = document.createElement('span');
    const labelId = document.createElement('label');
    labelId.className = "align-self-center";
    labelId.textContent = "id";
    const inputProductId = document.createElement('input');
    inputProductId.type = "text";
    inputProductId.className = "form-control";
    inputProductId.name = "product_id[]";
    inputProductId.placeholder = "Id del producto: 12fa12-asfaf-12";
    inputProductId.required = true;
    const inputProductQty = document.createElement('input');
    inputProductQty.type = "number";
    inputProductQty.className = "form-control";
    inputProductQty.name = "product_quantity[]";
    inputProductQty.min = 1;
    inputProductQty.max = 9;
    inputProductQty.value = 1;
    span.appendChild(labelId);
    span.appendChild(inputProductId);
    span.appendChild(inputProductQty);
    productListContainer.appendChild(span);
    const btnAddProduct = document.createElement('button');
    btnAddProduct.type = "button";
    btnAddProduct.className = "finalBtn";
    btnAddProduct.id = "addProductToOrder";
    btnAddProduct.textContent = "Agregar producto";
    divProducts.appendChild(labelProducts);
    divProducts.appendChild(productListContainer);
    divProducts.appendChild(btnAddProduct);

    // Envío
    const divEnvio = document.createElement('div');
    divEnvio.className = "mb-3 d-flex justify-content-between custom-padding";
    const labelEnvio = document.createElement('label');
    labelEnvio.htmlFor = "envio";
    labelEnvio.className = "form-label align-self-center";
    labelEnvio.textContent = "Envio";
    const selectEnvio = document.createElement('select');
    selectEnvio.name = "envio";
    selectEnvio.id = "envioSelect";
    //! Provisional ENVIO
    ["Montevideo", "Ciudad de la costa", "Resto del país", "Retiro del lugar"].forEach((city, i) => {
        const option = document.createElement('option');
        option.value = i < 2 ? "50" : (i === 2 ? "A definir" : "Free");
        option.textContent = city;
        selectEnvio.appendChild(option);
    });
    divEnvio.appendChild(labelEnvio);
    divEnvio.appendChild(selectEnvio);

    // Total
    const divTotal = document.createElement('div');
    divTotal.className = "d-flex justify-content-between custom-padding";
    const labelTotal = document.createElement('label');
    labelTotal.htmlFor = "total";
    labelTotal.className = "form-label align-self-center";
    labelTotal.textContent = "Total";
    const inputTotal = document.createElement('input');
    inputTotal.type = "number";
    inputTotal.className = "form-control totalInput";
    inputTotal.id = "total";
    inputTotal.name = "total";
    inputTotal.required = true;
    divTotal.appendChild(labelTotal);
    divTotal.appendChild(inputTotal);

    // Dirección
    const divDireccion = document.createElement('div');
    divDireccion.className = "mb-3";
    const labelDireccion = document.createElement('label');
    labelDireccion.htmlFor = "direccion";
    labelDireccion.textContent = "Dirección de envío";
    const inputDireccion = document.createElement('input');
    inputDireccion.type = "text";
    inputDireccion.className = "form-control";
    inputDireccion.id = "direccion";
    inputDireccion.name = "direccion";
    inputDireccion.value = "No se ha proveido de una dirección";
    divDireccion.appendChild(labelDireccion);
    divDireccion.appendChild(inputDireccion);

    // Footer
    const footer = document.createElement('div');
    footer.className = "modal-footer";
    footer.id = "genericFooter";
    const btnAceptar = document.createElement('button');
    btnAceptar.type = "button";
    btnAceptar.className = "btn btn-dark";
    btnAceptar.textContent = "Aceptar";
    const btnCancelar = document.createElement('button');
    btnCancelar.type = "button";
    btnCancelar.className = "btn btn-danger";
    btnCancelar.setAttribute('data-bs-dismiss', 'modal');
    btnCancelar.textContent = "Cancelar";
    footer.appendChild(btnAceptar);
    footer.appendChild(btnCancelar);

    // Ensamblar el formulario
    form.appendChild(divName);
    form.appendChild(divEmail);
    form.appendChild(divPhone);
    form.appendChild(divProducts);
    form.appendChild(divEnvio);
    form.appendChild(divTotal);
    form.appendChild(divDireccion);
    form.appendChild(footer);

    return form;
}

export function createViewOrderModal(order, formatCurrency) {
    const container = document.createElement('div');
    container.id = "orderContainer";

    // Info principal
    const divInfo = document.createElement('div');
    divInfo.className = "mb-3";
    const pId = document.createElement('p');
    pId.textContent = `Orden ID: ${order.order_id}`;
    const spanInfo = document.createElement('span');
    spanInfo.className = "d-flex justify-content-between";
    const pFecha = document.createElement('p');
    pFecha.textContent = `Fecha: ${order.fecha}`;
    const pEstado = document.createElement('p');
    pEstado.textContent = `Estado: ${order.status}`;
    spanInfo.appendChild(pFecha);
    spanInfo.appendChild(pEstado);
    divInfo.appendChild(pId);
    divInfo.appendChild(spanInfo);

    // Cliente
    const divCliente = document.createElement('div');
    divCliente.className = "d-flex justify-content-between";
    const labelNombre = document.createElement('label');
    labelNombre.className = "form-label";
    labelNombre.textContent = "Nombre del Cliente";
    const pNombre = document.createElement('p');
    pNombre.textContent = order.nombre;
    divCliente.appendChild(labelNombre);
    divCliente.appendChild(pNombre);

    const divEmail = document.createElement('div');
    divEmail.className = "d-flex justify-content-between";
    const labelEmail = document.createElement('label');
    labelEmail.className = "form-label";
    labelEmail.textContent = "Email del Cliente";
    const pEmail = document.createElement('p');
    pEmail.textContent = order.email;
    divEmail.appendChild(labelEmail);
    divEmail.appendChild(pEmail);

    const divPhone = document.createElement('div');
    divPhone.className = "mb-3 d-flex justify-content-between";
    const labelPhone = document.createElement('label');
    labelPhone.className = "form-label";
    labelPhone.textContent = "Teléfono del Cliente";
    const pPhone = document.createElement('p');
    pPhone.textContent = order.telefono;
    divPhone.appendChild(labelPhone);
    divPhone.appendChild(pPhone);

    // Productos
    const divProductos = document.createElement('div');
    divProductos.className = "mb-3";
    const labelProductos = document.createElement('label');
    labelProductos.className = "form-label";
    labelProductos.textContent = "Productos";
    const productListContainer = document.createElement('div');
    productListContainer.className = "productListContainer";
    order.productos.forEach(product => {
        const span = document.createElement('span');
        span.className = "d-flex justify-content-between";
        const pTitle = document.createElement('p');
        pTitle.textContent = product.product_title;
        const pCantidad = document.createElement('p');
        pCantidad.textContent = `x${product.cantidad}`;
        span.appendChild(pTitle);
        span.appendChild(pCantidad);
        productListContainer.appendChild(span);

        const hr = document.createElement('hr');
        hr.style.margin = "0";
        productListContainer.appendChild(hr);
    });
    divProductos.appendChild(labelProductos);
    divProductos.appendChild(productListContainer);

    // Envío y total
    const divEnvio = document.createElement('div');
    divEnvio.className = "d-flex justify-content-between custom-padding";
    const labelEnvio = document.createElement('label');
    labelEnvio.className = "form-label";
    labelEnvio.textContent = "Envio";
    const pEnvio = document.createElement('p');
    pEnvio.textContent = order.envio;
    divEnvio.appendChild(labelEnvio);
    divEnvio.appendChild(pEnvio);

    const divTotal = document.createElement('div');
    divTotal.className = "d-flex justify-content-between custom-padding";
    const labelTotal = document.createElement('label');
    labelTotal.className = "form-label";
    labelTotal.textContent = "Total";
    const pTotal = document.createElement('p');
    pTotal.textContent = formatCurrency(order.precio_total);
    divTotal.appendChild(labelTotal);
    divTotal.appendChild(pTotal);

    // Dirección (opcional)
    let divDireccion = null;
    if (order.direccion) {
        divDireccion = document.createElement('div');
        divDireccion.className = "mb-3";
        const labelDireccion = document.createElement('label');
        labelDireccion.className = "form-label";
        labelDireccion.textContent = "Dirección de envío";
        const pDireccion = document.createElement('p');
        pDireccion.textContent = order.direccion;
        divDireccion.appendChild(labelDireccion);
        divDireccion.appendChild(pDireccion);
    }

    // Footer
    const footer = document.createElement('div');
    footer.className = "modal-footer";
    footer.id = "genericFooter";
    const btnEditar = document.createElement('button');
    btnEditar.type = "button";
    btnEditar.className = "btn btn-dark";
    btnEditar.id = "editOrderBtn";
    btnEditar.textContent = "Editar";
    const btnCancelar = document.createElement('button');
    btnCancelar.type = "button";
    btnCancelar.className = "btn btn-danger";
    btnCancelar.setAttribute('data-bs-dismiss', 'modal');
    btnCancelar.textContent = "Cancelar";
    footer.appendChild(btnEditar);
    footer.appendChild(btnCancelar);

    // Ensamblar
    container.appendChild(divInfo);
    container.appendChild(divCliente);
    container.appendChild(divEmail);
    container.appendChild(divPhone);
    container.appendChild(divProductos);
    container.appendChild(divEnvio);
    container.appendChild(divTotal);
    if (divDireccion) container.appendChild(divDireccion);
    container.appendChild(footer);

    return container;
}

export function createEditOrderForm(order, id) {
    const form = document.createElement('form');
    form.id = "editOrderForm";
    form.action = `/adminBoard/order/${id}`;
    form.method = "POST";

    const inputMethod = document.createElement('input');
    inputMethod.type = "hidden";
    inputMethod.name = "_method";
    inputMethod.value = "PUT";
    form.appendChild(inputMethod);

    // Nombre
    const divName = document.createElement('div');
    divName.className = "mb-3 d-flex justify-content-between";
    const labelName = document.createElement('label');
    labelName.className = "form-label";
    labelName.textContent = "Nombre del Cliente";
    const inputName = document.createElement('input');
    inputName.className = "form-control textInput";
    inputName.name = "name";
    inputName.value = order.nombre;
    divName.appendChild(labelName);
    divName.appendChild(inputName);

    // Email
    const divEmail = document.createElement('div');
    divEmail.className = "mb-3 d-flex justify-content-between";
    const labelEmail = document.createElement('label');
    labelEmail.className = "form-label";
    labelEmail.textContent = "Email del Cliente";
    const inputEmail = document.createElement('input');
    inputEmail.className = "form-control textInput";
    inputEmail.name = "email";
    inputEmail.value = order.email;
    divEmail.appendChild(labelEmail);
    divEmail.appendChild(inputEmail);

    // Teléfono
    const divPhone = document.createElement('div');
    divPhone.className = "mb-3 d-flex justify-content-between";
    const labelPhone = document.createElement('label');
    labelPhone.className = "form-label";
    labelPhone.textContent = "Teléfono del Cliente";
    const inputPhone = document.createElement('input');
    inputPhone.className = "form-control textInput";
    inputPhone.name = "phone";
    inputPhone.value = order.telefono;
    divPhone.appendChild(labelPhone);
    divPhone.appendChild(inputPhone);

    // Productos
    const divProductos = document.createElement('div');
    divProductos.className = "mb-3 text-center";
    const labelProductos = document.createElement('label');
    labelProductos.className = "form-label";
    labelProductos.textContent = "Productos";
    const productListContainer = document.createElement('div');
    productListContainer.className = "productListContainer";
    order.productos.forEach(product => {
        const span = document.createElement('span');
        span.className = "d-flex justify-content-between";
        const labelId = document.createElement('label');
        labelId.className = "align-self-center";
        labelId.textContent = "id";
        const inputProductId = document.createElement('input');
        inputProductId.className = "form-control text-center";
        inputProductId.type = "text";
        inputProductId.name = "product_id[]";
        inputProductId.value = product.product_id;
        const inputProductQty = document.createElement('input');
        inputProductQty.className = "form-control";
        inputProductQty.type = "number";
        inputProductQty.name = "product_quantity[]";
        inputProductQty.min = 1;
        inputProductQty.max = 9;
        inputProductQty.value = product.cantidad;
        span.appendChild(labelId);
        span.appendChild(inputProductId);
        span.appendChild(inputProductQty);
        productListContainer.appendChild(span);
    });
    const btnAddProduct = document.createElement('button');
    btnAddProduct.type = "button";
    btnAddProduct.className = "finalBtn";
    btnAddProduct.id = "addProductToOrder";
    btnAddProduct.textContent = "Agregar producto";
    divProductos.appendChild(labelProductos);
    divProductos.appendChild(productListContainer);
    divProductos.appendChild(btnAddProduct);

    // Envío
    const divEnvio = document.createElement('div');
    divEnvio.className = "d-flex justify-content-between custom-padding";
    const labelEnvio = document.createElement('label');
    labelEnvio.className = "form-label align-self-center";
    labelEnvio.textContent = "Envio";
    const selectEnvio = document.createElement('select');
    selectEnvio.name = "envio";
    selectEnvio.id = "envioSelect";
    //! DIRECION ENVIO PROVISIONAL
    ["Montevideo", "Ciudad de la costa", "Resto del país", "Retiro del lugar"].forEach((city, i) => {
        const option = document.createElement('option');
        option.value = i < 2 ? "50" : (i === 2 ? "A definir" : "Free");
        option.textContent = city;
        if (order.envio === option.value || order.envio === city) option.selected = true;
        selectEnvio.appendChild(option);
    });
    divEnvio.appendChild(labelEnvio);
    divEnvio.appendChild(selectEnvio);

    // Total
    const divTotal = document.createElement('div');
    divTotal.className = "d-flex justify-content-between custom-padding";
    const labelTotal = document.createElement('label');
    labelTotal.className = "form-label align-self-center";
    labelTotal.textContent = "Total";
    const inputTotal = document.createElement('input');
    inputTotal.className = "form-control totalInput";
    inputTotal.name = "total";
    inputTotal.value = order.precio_total;
    inputTotal.required = true;
    divTotal.appendChild(labelTotal);
    divTotal.appendChild(inputTotal);

    // Dirección (opcional)
    let divDireccion = null;
    if (order.direccion) {
        divDireccion = document.createElement('div');
        divDireccion.className = "mb-3";
        const labelDireccion = document.createElement('label');
        labelDireccion.className = "form-label";
        labelDireccion.textContent = "Dirección de envío";
        const inputDireccion = document.createElement('input');
        inputDireccion.className = "form-control";
        inputDireccion.name = "address";
        inputDireccion.value = order.direccion;
        divDireccion.appendChild(labelDireccion);
        divDireccion.appendChild(inputDireccion);
    }

    // Footer
    const footer = document.createElement('div');
    footer.className = "modal-footer";
    footer.id = "genericFooter";
    const btnGuardar = document.createElement('button');
    btnGuardar.type = "button";
    btnGuardar.className = "btn btn-dark";
    btnGuardar.textContent = "Guardar";
    const btnCancelar = document.createElement('button');
    btnCancelar.type = "button";
    btnCancelar.className = "btn btn-danger";
    btnCancelar.setAttribute('data-bs-dismiss', 'modal');
    btnCancelar.textContent = "Cancelar";
    footer.appendChild(btnGuardar);
    footer.appendChild(btnCancelar);

    // Ensamblar
    form.appendChild(divName);
    form.appendChild(divEmail);
    form.appendChild(divPhone);
    form.appendChild(divProductos);
    form.appendChild(divEnvio);
    form.appendChild(divTotal);
    if (divDireccion) form.appendChild(divDireccion);
    form.appendChild(footer);

    return form;
}
