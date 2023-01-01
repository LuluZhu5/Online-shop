const cartItemUpdateFormElem = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElem = document.getElementById('cart-total-price');
const cartBadgeElem = document.querySelectorAll('.nav-items .badge');

async function updateCartItem(event) {
    event.preventDefault();

    const form = event.target;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(error) {
        alert('Something is wrong');
        return;
    }

    if (!response.ok) {
        alert('Something is wrong');
        return;
    }    

    const responseData = await response.json();

    if (responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove();
    } else {
        const cartItemTotalPriceElem = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElem.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
    }

    cartTotalPriceElem.textContent = +responseData.updatedCartData.newTotalPrice.toFixed(2);

    for (const badge of cartBadgeElem) {
        badge.textContent = responseData.updatedCartData.newTotalQuantity;
    }

}

for (const formElem of cartItemUpdateFormElem) {
    formElem.addEventListener('submit', updateCartItem);
}
