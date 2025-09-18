
import { getAllData } from "../db/index.js";

const getAllProductsService = async () => {
  const products = await getAllData();
  return Array.isArray(products) ? products : []; // ✅ always return an array
};

export default getAllProductsService;
