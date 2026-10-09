import SpeciesService from './SpeciesService.mjs';
import SightingChecklist from './SightingChecklist.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const checklist = new SightingChecklist();
const listElement = document.getElementById('life-list-items');
const progressElement = document.getElementById('life-progress');
const filterSelect = document.getElementById('life-filter');

let allSpecies = [];

function itemTemplate(animal) {
  const spotted = checklist.isSpotted(animal.id);
  const date = checklist.spottedDate(animal.id);
  return `<li class="life-item${spotted ? ' life-item--spotted' : ''}">
    <label>
      <input type="checkbox" data-id="${animal.id}" ${spotted ? 'checked' : ''} />
      <span class="life-item__icon" aria-hidden="true">${animal.icon}</span>
      <span class="life-item__name">${animal.name}</span>
    </label>
    <span class="life-item__date">${spotted ? `Spotted ${date}` : ''}</span>
  </li>`;
}

function render() {
  const filter = filterSelect.value;
  const visible = allSpecies.filter((animal) => {
    const spotted = checklist.isSpotted(animal.id);
    if (filter === 'spotted') return spotted;
    if (filter === 'missing') return !spotted;
    return true;
  });

  listElement.innerHTML = visible.length
    ? visible.map(itemTemplate).join('')
    : '<li class="life-empty">Nothing here yet. Tick an animal when you spot it on a game drive.</li>';

  progressElement.textContent = `${checklist.count()} of ${allSpecies.length} animals spotted`;
}

listElement.addEventListener('change', (event) => {
  const box = event.target.closest('input[type="checkbox"]');
  if (!box) return;
  checklist.toggle(box.dataset.id);
  render();
});

filterSelect.addEventListener('change', render);

new SpeciesService()
  .getAll()
  .then((species) => {
    allSpecies = [...species].sort((a, b) => a.name.localeCompare(b.name));
    render();
  })
  .catch((error) => {
    progressElement.textContent =
      'Species could not be loaded. Please try again later.';
    progressElement.title = error.message;
  });