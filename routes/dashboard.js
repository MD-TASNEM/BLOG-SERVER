const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getDB } = require("../config/db");

// Get user dashboard statistics
router.get("/user-stats", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const lessonsCollection = db.collection("lessons");
    const favoritesCollection = db.collection("favorites");

    // Get user info
    const user = await usersCollection.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's lessons
    const userLessons = await lessonsCollection
      .find({ creatorId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get user's favorites
    const userFavorites = await favoritesCollection
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const favoriteLessonIds = userFavorites.map(f => f.lessonId);
    const favoriteLessons = await lessonsCollection
      .find({ _id: { $in: favoriteLessonIds } })
      .toArray();

    // Get weekly activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyLessons = await lessonsCollection
      .find({
        creatorId: req.userId,
        createdAt: { $gte: sevenDaysAgo }
      })
      .toArray();

    const weeklyActivity = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const lessonsOnDay = weeklyLessons.filter(lesson => 
        lesson.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      
      weeklyActivity.push({
        date: dateStr,
        lessons: lessonsOnDay
      });
    }

    res.json({
      totalLessonsCreated: user.totalLessonsCreated || 0,
      totalFavorites: user.totalFavorites || 0,
      isPremium: user.isPremium || false,
      recentLessons: userLessons,
      recentFavorites: favoriteLessons,
      weeklyActivity
    });
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get admin dashboard statistics
router.get("/admin-stats", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const lessonsCollection = db.collection("lessons");
    const reportsCollection = db.collection("reports");

    // Verify admin
    const admin = await usersCollection.findOne({ _id: req.userId });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Total counts
    const totalUsers = await usersCollection.countDocuments();
    const totalLessons = await lessonsCollection.countDocuments();
    const publicLessons = await lessonsCollection.countDocuments({ visibility: "public" });
    const privateLessons = await lessonsCollection.countDocuments({ visibility: "private" });
    const premiumUsers = await usersCollection.countDocuments({ isPremium: true });
    const totalReports = await reportsCollection.countDocuments({ status: "pending" });

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayUsers = await usersCollection.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    const todayLessons = await lessonsCollection.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Most active contributors (top 5)
    const topContributors = await usersCollection
      .find({})
      .sort({ totalLessonsCreated: -1 })
      .limit(5)
      .toArray();

    // Most saved lessons (top 5)
    const mostSavedLessons = await lessonsCollection
      .find({ visibility: "public" })
      .sort({ favoritesCount: -1 })
      .limit(5)
      .toArray();

    // Growth data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = [];
    const lessonGrowth = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const usersOnDay = await usersCollection.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      const lessonsOnDay = await lessonsCollection.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      userGrowth.push({
        date: date.toISOString().split('T')[0],
        count: usersOnDay
      });

      lessonGrowth.push({
        date: date.toISOString().split('T')[0],
        count: lessonsOnDay
      });
    }

    res.json({
      totalUsers,
      totalLessons,
      publicLessons,
      privateLessons,
      premiumUsers,
      totalReports,
      todayUsers,
      todayLessons,
      topContributors,
      mostSavedLessons,
      userGrowth,
      lessonGrowth
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get top contributors for home page
router.get("/top-contributors", async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const topContributors = await usersCollection
      .find({})
      .sort({ totalLessonsCreated: -1 })
      .limit(6)
      .project({
        _id: 1,
        name: 1,
        photoURL: 1,
        totalLessonsCreated: 1
      })
      .toArray();

    res.json(topContributors);
  } catch (error) {
    console.error("Error fetching top contributors:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get most saved lessons for home page
router.get("/most-saved-lessons", async (req, res) => {
  try {
    const db = getDB();
    const lessonsCollection = db.collection("lessons");

    const mostSavedLessons = await lessonsCollection
      .find({ visibility: "public" })
      .sort({ favoritesCount: -1 })
      .limit(6)
      .toArray();

    res.json(mostSavedLessons);
  } catch (error) {
    console.error("Error fetching most saved lessons:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
