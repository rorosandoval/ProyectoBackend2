import ProductDao from "../dao/product.dao.js";

class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async create(productData) {
    return this.dao.create(productData);
  }

  async getProductById(id) {
    return this.dao.findById(id);
  }

  async updateProductStock(id, newStock) {
    return this.dao.updateStock(id, newStock);
  }

  async getProductsForCheckout(ids) {
    return this.dao.getProductsByIds(ids);
  }

  async getAll(filters = {}) {
    return this.dao.findAll(filters);
  }

  async update(id, productData) {
    return this.dao.update(id, productData);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

export const productRepository = new ProductRepository(ProductDao);
