function openCustomCartDrawer() {
  const drawer = document.querySelector('.custom-cart-drawer');
  if (drawer) drawer.classList.add('cart-drawer--active');
}

function closeCustomCartDrawer() {
  const drawer = document.querySelector('.custom-cart-drawer');
  if (drawer) drawer.classList.remove('cart-drawer--active');
}

async function updateCartDrawerContents() {
  const drawer = document.querySelector('.custom-cart-drawer');
  if (!drawer) return;

  try {
    const response = await fetch('/?sections=custom-cart-drawer');
    const sections = await response.json();

    if (sections['custom-cart-drawer']) {
      drawer.outerHTML = sections['custom-cart-drawer'];
    }

    initCartDrawerEvents();
    initRemoveButtons();
    initQuantityInputs();

  } catch (error) {
    console.error('Cart drawer update failed:', error);
  }
}

function initCartDrawerEvents() {
  document.querySelectorAll('.cart-drawer__close').forEach(btn => {
    btn.removeEventListener('click', closeCustomCartDrawer);
    btn.addEventListener('click', closeCustomCartDrawer);
  });
}

function initRemoveButtons() {
  document.querySelectorAll('.cart-drawer__remove-btn').forEach(btn => {
    btn.removeEventListener('click', removeItemHandler);
    btn.addEventListener('click', removeItemHandler);
  });
}

async function removeItemHandler(e) {
  e.preventDefault();

  const btn = e.currentTarget;
  const key = btn.dataset.lineKey;

  if (!key) {
    console.error('Cart item key not found');
    return;
  }

  btn.textContent = 'Removing...';
  btn.disabled = true;

  try {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: key,
        quantity: 0
      })
    });

    await updateCartDrawerContents();

  } catch (error) {
    console.error('Remove item failed:', error);
  }
}

function initQuantityInputs() {
  document.querySelectorAll('.cart-drawer-form input[type="number"]').forEach(input => {
    input.removeEventListener('change', updateQuantityHandler);
    input.addEventListener('change', updateQuantityHandler);
  });
}

async function updateQuantityHandler(e) {
  const input = e.target;
  const key = input.dataset.lineKey;
  const quantity = parseInt(input.value) || 0;

  if (!key) {
    console.error('Cart item key not found');
    return;
  }

  try {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: key,
        quantity: quantity
      })
    });

    await updateCartDrawerContents();

  } catch (error) {
    console.error('Quantity update failed:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const variantInput = form.querySelector('input[name="id"]');
      if (!variantInput) return;

      const variantId = parseInt(variantInput.value);
      const quantity = parseInt(form.querySelector('input[name="quantity"]')?.value || 1);

      try {

        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [
              {
                id: variantId,
                quantity: quantity
              }
            ]
          })
        });

        await updateCartDrawerContents();
        openCustomCartDrawer();

      } catch (error) {
        console.error('Add to cart failed:', error);
      }

    });

  });

  initCartDrawerEvents();
  initRemoveButtons();
  initQuantityInputs();

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      document.querySelector('.custom-cart-drawer.cart-drawer--active')
    ) {
      closeCustomCartDrawer();
    }
  });

});

document.addEventListener('cart:refresh', updateCartDrawerContents);