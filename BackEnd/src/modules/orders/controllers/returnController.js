// 📂 orders/controllers/returnController.js
import {
  requestReturnService,
  updateReturnStatusService,
} from "../services/returnService.js";

// 🟢 User: Request Return
export const requestReturnController = async (req, res) => {
  try {
    const { reason, issue, images } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Reason is required" });
    }

    const order = await requestReturnService(
      req.params.id,
      reason,
      issue,
      images || []
    );

    res.status(200).json({
      success: true,
      message: "Return request submitted successfully",
      order,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 🟢 Admin: Update Return Status
export const updateReturnStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await updateReturnStatusService(req.params.id, status);

    res.status(200).json({
      success: true,
      message: `Return status updated to ${status}`,
      order,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
