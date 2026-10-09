const STATUS_ORDER = [
  'Critically Endangered',
  'Endangered',
  'Vulnerable',
  'Near Threatened',
  'Least Concern',
];

export default class SpeciesList {
  constructor(service, listElement) {
    this.service = service;
    this.listElement = listElement;
    this.all = [];
    this.category = 'all';
    this.query = '';
    this.status = 'all';
    this.sortKey = 'name';
  }

  async init(category = 'all', query = '') {
    this.all = await this.service.getAll();
    this.category = category;
    this.query = query.toLowerCase();
    this.render();
  }

  setQuery(query) {
    this.query = query.trim().toLowerCase();
    this.render();
  }

  setStatus(status) {
    this.status = status;
    this.render();
  }

  setSort(sortKey) {
    this.sortKey = sortKey;
    this.render();
  }

  getVisible() {
    const visible = this.all.filter((animal) => {
      const inCategory =
        this.category === 'all' || animal.categories.includes(this.category);
      const inStatus = this.status === 'all' || animal.status === this.status;
      const text =
        `${animal.name} ${animal.habitat} ${animal.behavior}`.toLowerCase();
      const matches = !this.query || text.includes(this.query);
      return inCategory && inStatus && matches;
    });

    visible.sort((a, b) =>
      this.sortKey === 'status'
        ? STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
          a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
    return visible;
  }

  cardTemplate(animal) {
    return `<li class="product-card species-card">
      <div class="species-card__icon" aria-hidden="true">${animal.icon}</div>
      <h3 class="card__name">${animal.name}</h3>
      <p class="species-badge" data-status="${animal.status}">${animal.status}</p>
      <p class="card__brand"><strong>Habitat:</strong> ${animal.habitat}</p>
      <p class="card__brand">${animal.behavior}</p>
    </li>`;
  }

  render() {
    const visible = this.getVisible();
    this.listElement.innerHTML = visible.length
      ? visible.map((animal) => this.cardTemplate(animal)).join('')
      : '<li class="species-empty">No animals match. Clear the search or filters.</li>';
    document.dispatchEvent(
      new CustomEvent('species-rendered', { detail: visible.length }),
    );
  }
}