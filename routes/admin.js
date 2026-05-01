const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getDB } = require("../config/db");

// Get admin dashboard analytics
router.get("/dashboard", verifyToken, async (req, res) => {
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

    // Get basic stats
    const totalUsers = await usersCollection.countDocuments();
    const totalLessons = await lessonsCollection.countDocuments();
    const publicLessons = await lessonsCollection.countDocuments({ visibility: "public" });
    const privateLessons = await lessonsCollection.countDocuments({ visibility: "private" });
    const premiumLessons = await lessonsCollection.countDocuments({ accessLevel: "premium" });
    const reportedLessons = await reportsCollection.countDocuments();
    const premiumUsers = await usersCollection.countDocuments({ isPremium: true });

    // Get today's stats
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

    // Get weekly stats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyUsers = await usersCollection.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    const weeklyLessons = await lessonsCollection.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get top contributors
    const topContributors = await usersCollection
      .find({ totalLessonsCreated: { $gt: 0 } })
      .sort({ totalLessonsCreated: -1 })
      .limit(10)
      .project({
        name: 1,
        email: 1,
        photoURL: 1,
        totalLessonsCreated: 1,
        isPremium: 1,
        createdAt: 1
      })
      .toArray();

    // Get most saved lessons
    const mostSavedLessons = await lessonsCollection
      .find({ visibility: "public" })
      .sort({ favoritesCount: -1 })
      .limit(10)
      .project({
        title: 1,
        creatorName: 1,
        favoritesCount: 1,
        likesCount: 1,
        views: 1,
        category: 1,
        createdAt: 1
      })
      .toArray();

    // Get recent reported lessons
    const recentReports = await reportsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get lesson growth data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lessonGrowth = await lessonsCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]).toArray();

    // Get user growth data (last 30 days)
    const userGrowth = await usersCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]).toArray();

    // Get category distribution
    const categoryDistribution = await lessonsCollection.aggregate([
      {
        $match: { visibility: "public" }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();

    // Get emotional tone distribution
    const emotionalToneDistribution = await lessonsCollection.aggregate([
      {
        $match: { visibility: "public" }
      },
      {
        $group: {
          _id: "$emotionalTone",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();

    res.json({
      overview: {
        totalUsers,
        totalLessons,
        publicLessons,
        privateLessons,
        premiumLessons,
        reportedLessons,
        premiumUsers,
        todayUsers,
        todayLessons,
        weeklyUsers,
        weeklyLessons
      },
      topContributors,
      mostSavedLessons,
      recentReports,
      growth: {
        lessons: lessonGrowth,
        users: userGrowth
      },
      distribution: {
        categories: categoryDistribution,
        emotionalTones: emotionalToneDistribution
      }
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Manage users - get all users with pagination
router.get("/manage-users", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search } = req.query;
    const usersCollection = db.collection("users");

    // Verify admin
    const admin = await usersCollection.findOne({ _id: req.userId });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await usersCollection
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .project({
        name: 1,
        email: 1,
        photoURL: 1,
        role: 1,
        isPremium: 1,
        totalLessonsCreated: 1,
        totalFavorites: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .toArray();

    const total = await usersCollection.countDocuments(filter);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Manage lessons - get all lessons with pagination and filters
router.get("/manage-lessons", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search, category, visibility, accessLevel, featured } = req.query;
    const lessonsCollection = db.collection("lessons");
    const usersCollection = db.collection("users");

    // Verify admin
    const admin = await usersCollection.findOne({ _id: req.userId });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { creatorName: { $regex: search, $options: "i" } }
      ];
    }
    if (category) filter.category = category;
    if (visibility) filter.visibility = visibility;
    if (accessLevel) filter.accessLevel = accessLevel;
    if (featured !== undefined) filter.featured = featured === "true";

    const skip = (page - 1) * limit;

    const lessons = await lessonsCollection
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .project({
        title: 1,
        creatorName: 1,
        creatorId: 1,
        category: 1,
        emotionalTone: 1,
        visibility: 1,
        accessLevel: 1,
        featured: 1,
        likesCount: 1,
        commentsCount: 1,
        favoritesCount: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .toArray();

    const total = await lessonsCollection.countDocuments(filter);

    res.json({
      lessons,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching lessons:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get reported lessons with details
router.get("/reported-lessons", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10 } = req.query;
    const reportsCollection = db.collection("reports");
    const lessonsCollection = db.collection("lessons");
    const usersCollection = db.collection("users");

    // Verify admin
    const admin = await usersCollection.findOne({ _id: req.userId });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const skip = (page - 1) * limit;

    // Get reports with lesson and reporter details
    const reports = await reportsCollection
      .aggregate([
        {
          $lookup: {
            from: "lessons",
            localField: "lessonId",
            foreignField: "_id",
            as: "lesson"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "reporterUserId",
            foreignField: "_id",
            as: "reporter"
          }
        },
        {
          $unwind: "$lesson"
        },
        {
          $unwind: "$reporter"
        },
        {
          $group: {
            _id: "$lessonId",
            lesson: { $first: "$lesson" },
            reports: {
              $push: {
                reporterUserId: "$reporterUserId",
                reporterName: "$reporter.name",
                reporterEmail: "$reporter.email",
                reason: "$reason",
                createdAt: "$createdAt"
              }
            },
            reportCount: { $sum: 1 },
            firstReported: { $min: "$createdAt" }
          }
        },
        {
          $sort: { reportCount: -1, firstReported: -1 }
        },
        {
          $skip: skip
        },
        {
          $limit: parseInt(limit)
        }
      ])
      .toArray();

    const total = await reportsCollection.distinct("lessonId").length;

    res.json({
      reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching reported lessons:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user (admin)
router.delete("/user/:userId", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;
    const usersCollection = db.collection("users");
    const lessonsCollection = db.collection("lessons");
    const favoritesCollection = db.collection("favorites");
    const reportsCollection = db.collection("reports");

    // Verify admin
    const admin = await usersCollection.findOne({ _id: req.userId });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Don't allow admin to delete themselves
    if (userId === req.userId) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's lessons
    await lessonsCollection.deleteMany({ creatorId: userId });

    // Delete user's favorites
    await favoritesCollection.deleteMany({ userId: userId });

    // Delete reports made by user
    await reportsCollection.deleteMany({ reporterUserId: userId });

    // Delete the user
    await usersCollection.deleteOne({ _id: userId });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Take action on reported lesson (delete or ignore)
router.post("/reported-lesson/:lessonId/action", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { lessonId } = req.params;
    const { action } = req.body; // 'delete' or 'ignore'
    const usersCollection = db.collection("users");
    const lessonsCollection = db.collection("lessons");
    const reportsCollection = db.collection("reports");

    // Verify admin
    const admin = await usersCollection.findOne({ _id: req.userId });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (action === "delete") {
      // Delete the lesson
      const lesson = await lessonsCollection.findOne({ _id: lessonId });
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      await lessonsCollection.deleteOne({ _id: lessonId });

      // Update creator's lesson count
      await usersCollection.updateOne(
        { _id: lesson.creatorId },
        { $inc: { totalLessonsCreated: -1 } }
      );

      // Clear all reports for this lesson
      await reportsCollection.deleteMany({ lessonId });

      res.json({ message: "Lesson deleted and reports cleared" });
    } else if (action === "ignore") {
      // Clear all reports for this lesson
      await reportsCollection.deleteMany({ lessonId });

      res.json({ message: "Reports cleared" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error taking action on reported lesson:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
