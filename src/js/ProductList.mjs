import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/?product=${encodeURIComponent(product.Id)}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement, isSearch = false) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.isSearch = isSearch;
    this.list = [];
  }

  async init() {
    const list = this.isSearch
      ? await this.dataSource.searchProducts(this.category)
      : await this.dataSource.getData(this.category);
    this.list = list;
    this.renderList(this.list);

    const title = document.querySelector('.title');
    if (title) {
      title.textContent = this.isSearch
        ? `Search Results: "${this.category}"`
        : `Top Products: ${formatCategory(this.category)}`;
    }
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true,
    );
  }

  sortList(sortBy) {
    if (sortBy === 'name') {
      this.list.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortBy === 'price') {
      this.list.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    this.renderList(this.list);
  }
}

function formatCategory(category) {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}