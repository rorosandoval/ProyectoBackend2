import CartModel from "./models/cart.model.js";

class CartDao {
  async create() {
    const newCart = new CartModel({ products: [] });
    return await newCart.save();
  }

  async getCartWithProducts(cartId) {
    return CartModel.findById(cartId).populate("products.product").lean();
  }

  async updateCartProducts(cartId, newProductsList) {
    return CartModel.findByIdAndUpdate(
      cartId,
      { $set: { products: newProductsList } },
      { new: true }
    )
      .populate("products.product")
      .lean();
  }

  async addProduct(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart.populate("products.product");
  }

  async updateQuantity(cartId, productId, quantity) {
    return CartModel.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    )
      .populate("products.product")
      .lean();
  }

  async removeProduct(cartId, productId) {
    return CartModel.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    )
      .populate("products.product")
      .lean();
  }
}

export default new CartDao();
