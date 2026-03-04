document.addEventListener('DOMContentLoaded', () => {
  // AJAX Add to Cart
  document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const response = await fetch('/cart/add.js', {   // важливо: /cart/add.js
          method: 'POST',
          body: new FormData(form),
        });

        if (!response.ok) {
          console.error('Add to cart error', response.status);
          return;
        }

        // Відкрити cart drawer
        const drawer = document.querySelector('.cart-drawer');
        if (drawer) {
          drawer.classList.add('cart-drawer--active');
        }
      } catch (error) {
        console.error('Add to cart failed:', error);
      }
    });
  });

  // Close cart drawer
  document.querySelectorAll('.cart-drawer__close').forEach((el) => {
    el.addEventListener('click', () => {
      const drawer = document.querySelector('.cart-drawer');
      if (drawer) {
        drawer.classList.remove('cart-drawer--active');
      }
    });
  });
});
