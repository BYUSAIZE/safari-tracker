import SpeciesService from './SpeciesService.mjs';
import SpeciesList from './SpeciesList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const titles = {
  all: 'All Wildlife',
  'big-five': 'The Big Five',
  predators: 'Predators',
  birds: 'Birds',
  'plains-game': 'Plains Game',
};

const requestedCategory = getParam('category');
const category = titles[requestedCategory] ? requestedCategory : 'all';
const searchTerm = getParam('search') || '';

const listElement = document.querySelector('.product-list');
const statusElement = document.querySelector('.product-list-status');
const searchInput = document.getElementById('species-search');
const statusFilter = document.getElementById('status-filter');
const sortSelect = document.getElementById('sortBy');

document.getElementById('list-title').textContent = titles[category];
searchInput.value = searchTerm;

const speciesList = new SpeciesList(new SpeciesService(), listElement);

document.addEventListener('species-rendered', (event) => {
  statusElement.textContent = `${event.detail} animal${event.detail === 1 ? '' : 's'} shown`;
});

speciesList.init(category, searchTerm).catch((error) => {
  statusElement.textContent =
    'Species could not be loaded. Please try again later.';
  statusElement.title = error.message;
});

searchInput.addEventListener('input', (e) => speciesList.setQuery(e.target.value));
statusFilter.addEventListener('change', (e) => speciesList.setStatus(e.target.value));
sortSelect.addEventListener('change', (e) => speciesList.setSort(e.target.value));

document.querySelector('.search-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    window.location.href = `/product_listing/index.html?search=${encodeURIComponent(query)}`;
  }
});