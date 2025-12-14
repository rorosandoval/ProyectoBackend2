import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { cartService } from "../services/cart.service.js";

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartRepository.create();
    res.status(201).send({
      status: "success",
      data: newCart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartById = async (req, res, next) => {
  const { cid } = req.params;

  try {
    const cart = await cartRepository.getCartPopulated(cid);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Carrito no encontrado.",
      });
    }

    res.send({
      status: "success",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  try {
    const product = await productRepository.getProductById(pid);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado.",
      });
    }

    const updatedCart = await cartRepository.addProductToCart(
      cid,
      pid,
      quantity
    );

    res.send({
      status: "success",
      message: "Producto agregado al carrito.",
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).send({
      status: "error",
      message: "La cantidad debe ser mayor a 0.",
    });
  }

  try {
    const updatedCart = await cartRepository.updateProductQuantity(
      cid,
      pid,
      quantity
    );

    res.send({
      status: "success",
      message: "Cantidad actualizada.",
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  if (!pid) {
    return res.status(400).send({
      status: "error",
      message: "ID de producto no proporcionado.",
    });
  }

  try {
    const updatedCart = await cartRepository.removeProductFromCart(cid, pid);

    res.send({
      status: "success",
      message: "Producto eliminado del carrito.",
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  const { cid } = req.params;
  if (!cid) {
    return res.status(400).send({
      status: "error",
      message: "ID de carrito no proporcionado.",
    });
  }

  try {
    await cartRepository.updateCart(cid, []);

    res.send({
      status: "success",
      message: "Carrito vaciado exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseCart = async (req, res, next) => {
  const { cid } = req.params;
  const purchaserEmail = req.user.email;

  try {
    const { ticket, rejectedProducts } = await cartService.processPurchase(
      cid,
      purchaserEmail
    );

    if (ticket === null && rejectedProducts.length > 0) {
      return res.status(400).send({
        status: "error",
        message:
          "No se pudo procesar ningún producto. Stock insuficiente o productos no válidos.",
        rejectedProducts: rejectedProducts.map((item) => ({
          id: item.product._id,
          name: item.product.title,
          quantity: item.quantity,
        })),
      });
    }

    res.send({
      status: "success",
      message: "Proceso de compra finalizado.",
      ticket: ticket,
      rejectedProducts: rejectedProducts.map((item) => ({
        id: item.product._id,
        name: item.product.title,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    next(error);
  }
};
