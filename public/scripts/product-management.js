const deleteButtonElem = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
    const buttonElem = event.target;
    const productId = buttonElem.dataset.productid;
    const csrfToken = buttonElem.dataset.csrf;

    const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong');
        return;
    }

    buttonElem.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteButton of deleteButtonElem) {
    deleteButton.addEventListener('click', deleteProduct);
}
