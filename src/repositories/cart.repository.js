import CartDao from "../dao/cart.dao.js";

class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async create() {
    return this.dao.create();
  }

  async getCartPopulated(cartId) {
    return this.dao.getCartWithProducts(cartId);
  }

  async updateCart(cartId, newProductsList) {
    return this.dao.updateCartProducts(cartId, newProductsList);
  }

  async addProductToCart(cartId, productId, quantity) {
    return this.dao.addProduct(cartId, productId, quantity);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return this.dao.updateQuantity(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return this.dao.removeProduct(cartId, productId);
  }
}

export const cartRepository = new CartRepository(CartDao);
