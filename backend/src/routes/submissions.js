const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/submissions?platform=codeforces&limit=20
router.get("/", authMiddleware, async (req, res) => {
  const { platform, limit = 20, page = 1 } = req.query;

  const where = { userId: req.userId };
  if (platform) where.platform = platform;

  try {
    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { solvedAt: "desc" },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    const total = await prisma.submission.count({ where });

    res.json({ submissions, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/submissions/stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    const platformCounts = await prisma.submission.groupBy({
      by: ["platform"],
      where: { userId: req.userId, verdict: "AC" },
      _count: { id: true },
    });

    const verdictCounts = await prisma.submission.groupBy({
      by: ["verdict"],
      where: { userId: req.userId },
      _count: { id: true },
    });

    res.json({ profile, platformCounts, verdictCounts });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
