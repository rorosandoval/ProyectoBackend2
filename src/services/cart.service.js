import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { ticketRepository } from "../repositories/ticket.repository.js";
import mailerService from "./mailer.service.js";

const generateUniqueCode = () => {
  return `TICKET-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)
    .toUpperCase()}`;
};

class CartService {
  async processPurchase(cartId, purchaserEmail) {
    const cart = await cartRepository.getCartPopulated(cartId);

    if (!cart || cart.products.length === 0) {
      throw new Error("El carrito está vacío o no existe.");
    }

    let purchasedProducts = [];
    let rejectedProducts = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const productDB = item.product;
      const requestedQuantity = item.quantity;

      if (!productDB || requestedQuantity > productDB.stock) {
        rejectedProducts.push(item);
      } else {
        const newStock = productDB.stock - requestedQuantity;
        await productRepository.updateProductStock(productDB._id, newStock);

        const price = productDB.price;
        totalAmount += price * requestedQuantity;

        purchasedProducts.push({
          product: productDB._id,
          quantity: requestedQuantity,
          price: price,
        });
      }
    }

    let ticket = null;

    if (purchasedProducts.length > 0) {
      const ticketData = {
        code: generateUniqueCode(),
        amount: totalAmount,
        purchaser: purchaserEmail,
        products: purchasedProducts,
      };

      ticket = await ticketRepository.createNewTicket(ticketData);

      const newCartProducts = rejectedProducts.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      await cartRepository.updateCart(cartId, newCartProducts);

      try {
        await mailerService.sendPurchaseConfirmation(
          purchaserEmail,
          ticket,
          purchasedProducts
        );
      } catch (mailError) {
        console.error(
          "Error al enviar correo (la compra sí se procesó):",
          mailError.message
        );
      }
    } else if (rejectedProducts.length > 0) {
      throw new Error(
        "No se pudo procesar ningún producto. Stock insuficiente o productos no válidos."
      );
    } else {
      throw new Error("El carrito está vacío.");
    }

    return { ticket, rejectedProducts };
  }
}

export const cartService = new CartService();
