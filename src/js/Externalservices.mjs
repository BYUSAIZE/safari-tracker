const baseURL = (import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com").replace(/\/+$/, "") + "/";

const validCategories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(searchTerm) {
    const allResults = await Promise.all(
      validCategories.map((category) => this.getData(category))
    );

    const combined = allResults.flat();
    const term = searchTerm.toLowerCase();

    return combined.filter((product) =>
      product.Name.toLowerCase().includes(term) ||
      product.Brand.Name.toLowerCase().includes(term)
    );
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}