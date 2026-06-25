const Issue = require("../models/Issue");

const getDashboardStats = async (req, res) => {
  try {

    const total = await Issue.countDocuments();

    const reported = await Issue.countDocuments({
      status: "Reported"
    });

    const verified = await Issue.countDocuments({
      status: "Verified"
    });

    const inProgress = await Issue.countDocuments({
      status: "In Progress"
    });

    const resolved = await Issue.countDocuments({
      status: "Resolved"
    });

    return res.status(200).json({
      success: true,
      stats: {
        total,
        reported,
        verified,
        inProgress,
        resolved
      }
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

module.exports = {
  getDashboardStats
};