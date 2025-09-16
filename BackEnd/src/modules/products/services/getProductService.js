import { getData } from "../db/index.js";

const getProductService = async (id) => await getData(id);

export default getProductService;
