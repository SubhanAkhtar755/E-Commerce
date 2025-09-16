import { getAllData } from "../db/index.js";

const getAllProductsService = async () => await getAllData();

export default getAllProductsService;
