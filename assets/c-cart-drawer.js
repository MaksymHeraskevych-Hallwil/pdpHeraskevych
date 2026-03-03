document.querySelectorAll('form[action="/cart/add"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        await fetch('cart/add', {
            method: 'post',
            body: new FormData(form),
        });

        // Open Cart Drawer
        document.querySelector('.cart-drawer').classList.add('cart-drawer--active');

    })
})

//Close cart Drawer
document.querySelectorAll('.cart-drawer__close').forEach((el) => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.cart-drawer').classList.remove('cart-drawer--active');
    })
})
