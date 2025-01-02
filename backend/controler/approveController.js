import approvalModel from "../models/Approval.js";

const viewApprovals = async (req, res) => {
  try {
    const approvals = await approvalModel
      .find()
      .populate(
        "WorkshopID",
        "workshopName workshopOwnerName number address.text"
      );
    res.status(200).json({
      approvals,
      message: "Approvals fetched successfully",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch approvals", status: false });
  }
};

export default { viewApprovals };
