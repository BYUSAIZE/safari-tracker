import ExternalServices from './Externalservices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const validCategories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
const requestedCategory = getParam('category');
const searchTerm = getParam('search');

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const statusElement = document.querySelector('.product-list-status');

let productList;

if (searchTerm) {
  productList = new ProductList(searchTerm, dataSource, listElement, true);
} else {
  const category = validCategories.includes(requestedCategory)
    ? requestedCategory
    : 'tents';
  productList = new ProductList(category, dataSource, listElement, false);
}

async function initProductList() {
  try {
    await productList.init();
    if (statusElement) {
      statusElement.textContent = '';
    }
  } catch (error) {
    if (statusElement) {
      statusElement.textContent =
        'Products could not be loaded. Please try again later.';
      statusElement.title = error.message;
    }
  }
}

initProductList();

document.getElementById('sortBy')?.addEventListener('change', (e) => {
  productList.sortList(e.target.value);
});

document.querySelector('.search-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    window.location.href = `/product_listing/index.html?search=${encodeURIComponent(query)}`;
  }
});