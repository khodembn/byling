import * as productService from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts();

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};