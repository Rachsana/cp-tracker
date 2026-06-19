const express = require("express");
const axios = require("axios");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// --- Codeforces ---
async function fetchCodeforces(handle) {
  const [infoRes, subsRes] = await Promise.all([
    axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
    axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=30`),
  ]);

  const info = infoRes.data.result[0];
  const submissions = subsRes.data.result.map((s) => ({
    platform: "codeforces",
    problemId: `${s.problem.contestId}${s.problem.index}`,
    problemName: s.problem.name,
    verdict: s.verdict === "OK" ? "AC" : s.verdict,
    difficulty: s.problem.rating ? String(s.problem.rating) : null,
    tags: s.problem.tags || [],
    solvedAt: new Date(s.creationTimeSeconds * 1000),
  }));

  return {
    profile: {
      cfRating: info.rating || 0,
      cfMaxRating: info.maxRating || 0,
      cfRank: info.rank || "unrated",
    },
    submissions,
  };
}

// --- LeetCode ---
async function fetchLeetcode(handle) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      recentSubmissionList(username: $username, limit: 30) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  const res = await axios.post(
    "https://leetcode.com/graphql",
    { query, variables: { username: handle } },
    { headers: { "Content-Type": "application/json" } }
  );

  const stats = res.data.data.matchedUser?.submitStats?.acSubmissionNum || [];
  const recent = res.data.data.recentSubmissionList || [];

  const easy = stats.find((s) => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find((s) => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find((s) => s.difficulty === "Hard")?.count || 0;

  const submissions = recent.map((s) => ({
    platform: "leetcode",
    problemId: s.titleSlug,
    problemName: s.title,
    verdict: s.statusDisplay === "Accepted" ? "AC" : s.statusDisplay.toUpperCase().slice(0, 3),
    difficulty: null,
    tags: [],
    solvedAt: new Date(parseInt(s.timestamp) * 1000),
  }));

  return {
    profile: {
      lcTotalSolved: easy + medium + hard,
      lcEasySolved: easy,
      lcMediumSolved: medium,
      lcHardSolved: hard,
    },
    submissions,
  };
}

// --- CodeChef (unofficial scrape via API) ---
async function fetchCodechef(handle) {
  try {
    const res = await axios.get(`https://www.codechef.com/users/${handle}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 10000,
    });

    const html = res.data;

    const ratingMatch = html.match(/<div class="rating-number">\s*(\d+)/);
    const starsMatch = html.match(/<span class="rating">\s*([\d★]+)/);

    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
    const stars = starsMatch ? starsMatch[1].trim() : "Unrated";

    if (!rating) {
      throw new Error("Could not parse rating — handle may be wrong or CodeChef changed their page structure");
    }

    return {
      profile: { ccRating: rating, ccStars: stars },
      submissions: [],
    };
  } catch (err) {
    console.error("CodeChef fetch failed:", err.message);
    return { profile: { ccRating: 0, ccStars: "Unrated" }, submissions: [] };
  }
}

// --- GFG (unofficial) ---
async function fetchGFG(handle) {
  try {
    const res = await axios.get(`https://gfg-stats.tashif.codes/${handle}`);
    const data = res.data;

    if (data.error) {
      throw new Error(data.message || "GFG user not found");
    }

    return {
      profile: { gfgSolved: data.totalProblemsSolved || 0 },
      submissions: [],
    };
  } catch (err) {
    console.error("GFG fetch failed:", err.message);
    return { profile: { gfgSolved: 0 }, submissions: [] };
  }
}

// POST /api/sync/all
router.post("/all", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    let profileUpdate = {};
    let allSubmissions = [];

    // Fetch from all platforms in parallel
    const fetches = await Promise.allSettled([
      user.codeforcesHandle ? fetchCodeforces(user.codeforcesHandle) : null,
      user.leetcodeHandle ? fetchLeetcode(user.leetcodeHandle) : null,
      user.codechefHandle ? fetchCodechef(user.codechefHandle) : null,
      user.gfgHandle ? fetchGFG(user.gfgHandle) : null,
    ]);

    fetches.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        profileUpdate = { ...profileUpdate, ...result.value.profile };
        allSubmissions = [...allSubmissions, ...result.value.submissions];
      }
    });

    // Update profile
    await prisma.profile.update({
      where: { userId: req.userId },
      data: { ...profileUpdate, lastSynced: new Date() },
    });

    // Upsert submissions
    for (const sub of allSubmissions) {
      await prisma.submission.upsert({
        where: {
          userId_platform_problemId: {
            userId: req.userId,
            platform: sub.platform,
            problemId: sub.problemId,
          },
        },
        update: { verdict: sub.verdict },
        create: { userId: req.userId, ...sub },
      });
    }

    const updatedProfile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    res.json({ message: "Sync successful", profile: updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed", error: err.message });
  }
});

module.exports = router;
