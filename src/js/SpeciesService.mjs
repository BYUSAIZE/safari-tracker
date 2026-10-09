export default class SpeciesService {
  async getAll() {
    const response = await fetch('/json/species.json');
    if (!response.ok) {
      throw new Error(`Could not load species (${response.status})`);
    }
    return response.json();
  }
}