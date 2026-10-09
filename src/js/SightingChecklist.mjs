const STORAGE_KEY = 'safari-life-list';

export default class SightingChecklist {
  constructor() {
    this.spotted = this.load();
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && typeof saved === 'object' ? saved : {};
    } catch {
      return {};
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.spotted));
    } catch {
      // Storage can be blocked or full; the checklist still works this session.
    }
  }

  isSpotted(id) {
    return Boolean(this.spotted[id]);
  }

  toggle(id) {
    if (this.spotted[id]) {
      delete this.spotted[id];
    } else {
      this.spotted[id] = new Date().toISOString().slice(0, 10);
    }
    this.save();
    return this.isSpotted(id);
  }

  spottedDate(id) {
    return this.spotted[id] || '';
  }

  count() {
    return Object.keys(this.spotted).length;
  }
}