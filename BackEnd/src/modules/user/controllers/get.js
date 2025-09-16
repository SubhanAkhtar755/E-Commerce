import GetUserProfileService from "../services/get.js";

const GetUserProfileController = async (req, res) => {
  try {
    const user = await GetUserProfileService(req.user.id); // req.user.id from authMiddleware

    res.status(200).json({
      status: 200,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export default GetUserProfileController;
