// src/services/statistics.service.js
import Word from "../models/word.model.js";
import { categoryService } from "./category.service.js";
import { getRandomColor } from "../utils/generateRandomColor.js";
class StatisticsService {
  async getStats() {
    const words = await Word.find();

    const totalWords = words.length;
    const categories = new Set(words.map((w) => w.category)).size;

    // --- Words added this month ---
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const wordsAddedThisMonth = words.filter((w) => {
      const d = new Date(w.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // --- Top categories ---
    const categoryMap = {};

    for (const w of words) {
      try {
        const response = await categoryService.getCategoryById(w.category);
        const category = response.data;

        if (category) {
          categoryMap[category.name] = (categoryMap[category.name] || 0) + 1;
        }
      } catch (err) {
        console.error(`Error fetching category for word ${w._id}:`, err);
      }
    }

    const topCategories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count, color: getRandomColor() }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    
    // Create fixed Mon-Sun array
    const weeklyActivity = [
      { name: "Mon", words: 0 },
      { name: "Tue", words: 0 },
      { name: "Wed", words: 0 },
      { name: "Thu", words: 0 },
      { name: "Fri", words: 0 },
      { name: "Sat", words: 0 },
      { name: "Sun", words: 0 },
    ];

    // Calculate last 7 days
    const today = new Date();
    const last7 = new Date(today);
    last7.setDate(today.getDate() - 7);

    // Count words added in last 7 days
    words.forEach((w) => {
      const date = new Date(w.createdAt);

      if (date >= last7 && date <= today) {
        const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

        // Convert JS format to Mon-Sun array
        const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;

        weeklyActivity[mappedIndex].words++;
      }
    });

    // --- Monthly chart (Jan-Dec) ---
    const chart = Array(12).fill(0);
    words.forEach((w) => {
      const month = new Date(w.createdAt).getMonth();
      chart[month]++;
    });

    // Convert sang format UI của bạn
    const chartData = chart.map((count, i) => ({
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
      words: count,
      percentage:
        count === 0 ? 0 : Math.round((count / Math.max(...chart)) * 100),
    }));

    // --- Streak ---
    const uniqueDays = [
      ...new Set(words.map((w) => new Date(w.createdAt).toDateString())),
    ].sort((a, b) => new Date(a) - new Date(b));

    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streak++;
      } else {
        streak = 1;
      }
      maxStreak = Math.max(maxStreak, streak);
    }

    // --- Avg words per day ---
    const totalDaysActive = uniqueDays.length;
    const avgWordsPerDay = totalDaysActive
      ? parseFloat((totalWords / totalDaysActive).toFixed(2))
      : 0;

    return {
      totalWords,
      wordsAddedThisMonth,
      categories,
      topCategories,
      weeklyActivity,
      chartData,
      streak: maxStreak,
      avgWordsPerDay,
    };
  }
}

export default new StatisticsService();
