const Case = require("../../models/Case_model");

const getAllCase = async (req, res) => {
  try {
    // ১ & ২. ডাটাবেজ থেকে সব কেস খুঁজে বের করা
    const cases = await Case.find();

    // ৩. ডাটা আছে কিনা পরীক্ষা করা
    if (cases && cases.length > 0) {
      // ৪. ডাটা পাওয়া গেলে ২ু০ স্ট্যাটাস সহ রেসপন্স
      return res.status(200).json({
        success: true,
        message: "All cases retrieved successfully",
        data: cases,
      });
    } else {
      // ডাটা না থাকলে ৪০৪/২৪ স্ট্যাটাস সহ বার্তা
      return res.status(404).json({
        success: false,
        message: "No Data Found",
        data: [],
      });
    }
  } catch (error) {
    // ৫. সার্ভার বা ডাটাবেজ সংক্রান্ত কোনো Error হলে
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getSingleCase = async (req, res) => {
  try {
    // ১. Request Params থেকে ID নেওয়া
    const { id } = req.params;

    const singleCase = await Case.findOne({ _id: id });

    if (singleCase) {
      return res.status(200).json({
        success: true,
        message: "Case retrieved successfully",
        data: singleCase,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }
  } catch (error) {
    // ৫. কোনো সমস্যা হলে Error Response (500) পাঠাও
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getAllCase, getSingleCase };
