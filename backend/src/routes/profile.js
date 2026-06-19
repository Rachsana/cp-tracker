const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const updateHandlesSchema = z.object({
  codeforcesHandle: z.string().optional(),
  leetcodeHandle: z.string().optional(),
  codechefHandle: z.string().optional(),
  gfgHandle: z.string().optional(),
});

// GET /api/profile/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true },
      select: {
        id: true,
        email: true,
        username: true,
        codeforcesHandle: true,
        leetcodeHandle: true,
        codechefHandle: true,
        gfgHandle: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/profile/handles
router.put("/handles", authMiddleware, async (req, res) => {
  const parsed = updateHandlesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: parsed.data,
    });

    res.json({ message: "Handles updated", user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
