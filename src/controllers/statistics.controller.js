import StatisticsService from "../services/statistics.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

class StatisticsController {
  getStats = asyncHandler(async (req, res) => {
    try {
      const stats = await StatisticsService.getStats();
      res.json({
        success: true,
        code: 200,
        message: "Statistics fetched successfully",
        data: stats,
      });
    } catch (err) {
      console.error("❌ Statistics error:", err);
      res.status(500).json({
        success: false,
        code: 500,
        message: "Statistics generation failed",
      });
    }
  });
}

export default new StatisticsController();
