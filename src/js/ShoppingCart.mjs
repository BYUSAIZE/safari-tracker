import {
  getLocalStorage,
  renderListWithTemplate,
  setLocalStorage,
} from './utils.mjs';

function cartItemTemplate(item, index) {
  return `<li class="cart-card divider">
    <button type="button" class="cart-card__remove" data-id="${item.Id}" data-index="${index}" aria-label="Remove item ${index + 1} from cart">&times;</button>
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentElement) {
    this.key = key;
    this.parentElement = parentElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];
    this.renderCartContents(cartItems);
  }

  renderCartContents(cartItems) {
    // Show/hide footer and calculate total
    const footerElement = document.querySelector('.cart-footer');
    if (footerElement) {
      if (cartItems.length > 0) {
        footerElement.classList.remove('hide');
        const total = cartItems.reduce(
          (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
          0,
        );
        const totalElement = document.querySelector('.cart-total');
        if (totalElement) {
          totalElement.innerText = `Total: $${total.toFixed(2)}`;
        }
      } else {
        footerElement.classList.add('hide');
      }
    }

    renderListWithTemplate(
      cartItemTemplate,
      this.parentElement,
      cartItems,
      'afterbegin',
      true,
    );

    this.parentElement
      .querySelectorAll('.cart-card__remove')
      .forEach((button) => {
        button.addEventListener('click', (event) => this.removeItem(event));
      });
  }

  removeItem(event) {
    const button = event.currentTarget;
    const index = Number(button.dataset.index);
    const cartItems = getLocalStorage(this.key) || [];

    if (cartItems[index]?.Id !== button.dataset.id) {
      this.renderCartContents(cartItems);
      return;
    }

    cartItems.splice(index, 1);
    setLocalStorage(this.key, cartItems);
    this.renderCartContents(cartItems);

    const remainingButtons =
      this.parentElement.querySelectorAll('.cart-card__remove');
    const nextButton =
      remainingButtons[Math.min(index, remainingButtons.length - 1)];

    if (nextButton) nextButton.focus();
    else document.querySelector('.logo a')?.focus();
  }
}