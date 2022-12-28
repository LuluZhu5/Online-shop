const mobileMenuBtnElem = document.getElementById('mobile-menu-btn');
const mobileMenuElem = document.getElementById('mobile-menu');

function showMobileMenu() {
    mobileMenuElem.classList.toggle('open');
}

mobileMenuBtnElem.addEventListener('click', showMobileMenu);
