import Model from "../models/index.js";

const getAllUsersService = async () => {
  return await Model.find(); // saaray users return karega
};

export default getAllUsersService;
