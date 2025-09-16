import { getData } from "../db/index.js";

const GetUserProfileService = async (id) => {
  const user = await getData(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default GetUserProfileService;
