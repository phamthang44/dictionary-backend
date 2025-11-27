import Word from "../models/word.model.js";
import Category from "../models/category.model.js";
import { categoryService } from "./category.service.js";

class StatisticsService {
  async getStats() {
    try {
      // ✅ FIX 1: Fetch all data in parallel instead of sequential
      const [words, categories] = await Promise.all([
        Word.find().lean(), // ✅ Use .lean() for faster queries (read-only)
        Category.find().lean(),
      ]);

      const totalWords = words.length;

      if (totalWords === 0) {
        return this.getEmptyStats();
      }

      // ✅ FIX 2: Create category map from memory (no API calls!)
      const categoryMap = {};
      const categoryNameMap = {};

      // Build maps for O(1) lookups
      categories.forEach((cat) => {
        categoryNameMap[cat._id.toString()] = cat.name;
        categoryMap[cat.name] = 0;
      });

      //newCategoriesThisMonth
      const response = await categoryService.getCategoryStats();
      const newCategoriesThisMonth = response.data.newCategoriesThisMonth;
      const totalCategories = response.data.totalCategories;

      // Count words by category
      words.forEach((w) => {
        const categoryName = categoryNameMap[w.category.toString()];
        if (categoryName) {
          categoryMap[categoryName]++;
        }
      });

      // ✅ FIX 3: Get stats in parallel
      const [
        wordsAddedThisMonth,
        topCategories,
        weeklyActivity,
        chartData,
        streak,
        avgWordsPerDay,
      ] = await Promise.all([
        this.getWordsAddedThisMonth(words),
        this.getTopCategories(categoryMap),
        this.getWeeklyActivity(words),
        this.getChartData(words),
        this.getStreak(words),
        this.getAvgWordsPerDay(words),
      ]);

      return {
        totalWords,
        wordsAddedThisMonth,
        topCategories,
        weeklyActivity,
        chartData,
        streak,
        avgWordsPerDay,
        categoryStats: {
          data: categoryMap,
          newCategoriesThisMonth,
          totalCategories: totalCategories,
        },
      };
    } catch (error) {
      console.error("❌ Error in getStats:", error);
      throw error;
    }
  }

  // ✅ FIX 4: Break into smaller, optimized functions
  async getWordsAddedThisMonth(words) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return words.filter((w) => {
      const d = new Date(w.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
  }

  async getTopCategories(categoryMap) {
    return Object.entries(categoryMap)
      .map(([name, wordCount]) => ({ name, wordCount })) // ✅ Use wordCount instead of count
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, 5);
  }

  async getWeeklyActivity(words) {
    // ✅ Pre-define days once
    const weeklyActivity = [
      { name: "Mon", words: 0 },
      { name: "Tue", words: 0 },
      { name: "Wed", words: 0 },
      { name: "Thu", words: 0 },
      { name: "Fri", words: 0 },
      { name: "Sat", words: 0 },
      { name: "Sun", words: 0 },
    ];

    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const last7 = new Date(today);
    last7.setDate(today.getDate() - 7);
    last7.setHours(0, 0, 0, 0); // Start of 7 days ago

    // ✅ Single pass through words
    words.forEach((w) => {
      const date = new Date(w.createdAt);

      if (date >= last7 && date <= today) {
        const dayIndex = date.getDay();
        const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        weeklyActivity[mappedIndex].words++;
      }
    });

    return weeklyActivity;
  }

  async getChartData(words) {
    const chart = Array(12).fill(0);

    // ✅ Single pass, no redundant date conversions
    words.forEach((w) => {
      const month = new Date(w.createdAt).getMonth();
      chart[month]++;
    });

    // Find max for percentage calculation
    const maxWords = Math.max(...chart, 1); // Prevent division by zero

    const monthNames = [
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
    ];

    return chart.map((count, i) => ({
      month: monthNames[i],
      words: count,
      percentage: count === 0 ? 0 : Math.round((count / maxWords) * 100),
    }));
  }

  async getStreak(words) {
    if (words.length === 0) return 0;

    // ✅ FIX 5: Optimize date string creation
    const uniqueDays = new Set();
    const dateMap = {};

    words.forEach((w) => {
      const dateStr = new Date(w.createdAt).toDateString();
      uniqueDays.add(dateStr);
      dateMap[dateStr] = new Date(dateStr);
    });

    // Convert to sorted array
    const sortedDates = Array.from(uniqueDays)
      .map((d) => dateMap[d])
      .sort((a, b) => a - b);

    if (sortedDates.length === 0) return 1;

    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = sortedDates[i - 1];
      const curr = sortedDates[i];

      // ✅ More efficient date difference calculation
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (Math.abs(diff - 1) < 0.1) {
        // Account for timezone differences
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }

    return maxStreak;
  }

  async getAvgWordsPerDay(words) {
    if (words.length === 0) return 0;

    // ✅ Count unique days more efficiently
    const uniqueDays = new Set(
      words.map((w) => new Date(w.createdAt).toDateString())
    );

    const totalDaysActive = uniqueDays.size;
    return parseFloat((words.length / totalDaysActive).toFixed(2));
  }

  // ✅ Return empty stats when no words
  getEmptyStats() {
    return {
      totalWords: 0,
      wordsAddedThisMonth: 0,
      topCategories: [],
      weeklyActivity: [
        { name: "Mon", words: 0 },
        { name: "Tue", words: 0 },
        { name: "Wed", words: 0 },
        { name: "Thu", words: 0 },
        { name: "Fri", words: 0 },
        { name: "Sat", words: 0 },
        { name: "Sun", words: 0 },
      ],
      chartData: [
        { month: "Jan", words: 0, percentage: 0 },
        { month: "Feb", words: 0, percentage: 0 },
        { month: "Mar", words: 0, percentage: 0 },
        { month: "Apr", words: 0, percentage: 0 },
        { month: "May", words: 0, percentage: 0 },
        { month: "Jun", words: 0, percentage: 0 },
        { month: "Jul", words: 0, percentage: 0 },
        { month: "Aug", words: 0, percentage: 0 },
        { month: "Sep", words: 0, percentage: 0 },
        { month: "Oct", words: 0, percentage: 0 },
        { month: "Nov", words: 0, percentage: 0 },
        { month: "Dec", words: 0, percentage: 0 },
      ],
      streak: 0,
      avgWordsPerDay: 0,
      categoryStats: {
        data: {},
        newCategoriesThisMonth: 0,
        totalCategories: 0,
      },
    };
  }
}

export default new StatisticsService();
