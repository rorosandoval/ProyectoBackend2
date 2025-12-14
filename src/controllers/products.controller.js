import { productRepository } from "../repositories/product.repository.js";

export const getProducts = async (req, res, next) => {
  try {
    const { page, limit, sort, category, status } = req.query;
    const result = await productRepository.getProducts(
      page,
      limit,
      sort,
      category,
      status
    );

    res.send({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  const { pid } = req.params;

  try {
    const product = await productRepository.getProductById(pid);

    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado.",
      });
    }

    res.send({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const productData = req.body;

  if (
    !productData.title ||
    !productData.description ||
    !productData.price ||
    !productData.code
  ) {
    return res.status(400).send({
      status: "error",
      message: "Faltan campos obligatorios.",
    });
  }

  try {
    const newProduct = await productRepository.createProduct(productData);

    res.status(201).send({ status: "success", data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const { pid } = req.params;
  const productData = req.body;

  try {
    const updatedProduct = await productRepository.updateProduct(
      pid,
      productData
    );

    if (!updatedProduct) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado para actualizar.",
      });
    }

    res.send({ status: "success", data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { pid } = req.params;

  try {
    const deletedProduct = await productRepository.deleteProduct(pid);

    if (!deletedProduct) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado para eliminar.",
      });
    }

    res.send({ status: "success", message: "Producto eliminado con éxito." });
  } catch (error) {
    next(error);
  }
};
