const express = require('express');
const axios = require('axios');
const cors = require('cors');
const redis = require('./redis');

const app = express();
app.use(cors());
const PORT = 3000;

const cheerio = require('cheerio');

app.get('/api/cc/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `cc:${username}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const response = await axios.get(`https://www.codechef.com/users/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);

    const rating = $('.rating-number').first().text().trim();
    const result = { username, rating };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch CodeChef data' });
  }
});

app.get('/api/gfg/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `gfg:${username}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}/practice/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);

    const totalSolved = $('.scoreCard_head__score__oSi_x').first().text().trim();
    const result = { username, totalSolved };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GFG data' });
  }
});

app.get('/api/cf/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Codeforces data' });
  }
});

app.get('/api/lc/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `lc:${username}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username }
    };

    const response = await axios.post('https://leetcode.com/graphql', query, {
      headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' }
    });

    const result = response.data.data;
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch LeetCode data' });
  }
});

app.get('/api/dashboard/:cfHandle/:lcUsername/:ccUsername/:gfgUsername', async (req, res) => {
  const { cfHandle, lcUsername, ccUsername, gfgUsername } = req.params;

  try {
    const [cfRes, lcRes, ccRes, gfgRes] = await Promise.allSettled([
      axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`),
      axios.post('https://leetcode.com/graphql', {
        query: `query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats { acSubmissionNum { difficulty count } }
          }
        }`,
        variables: { username: lcUsername }
      }, { headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' } }),
      axios.get(`https://www.codechef.com/users/${ccUsername}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }),
      axios.get(`https://auth.geeksforgeeks.org/user/${gfgUsername}/practice/`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    ]);

    const cfData = cfRes.status === 'fulfilled' ? cfRes.value.data.result[0] : null;

    let cfSolved = 0;
if (cfData) {
  try {
    const cfSubmissions = await axios.get(
      `https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=10000`
    );
    const solved = new Set(
      cfSubmissions.data.result
        .filter(s => s.verdict === 'OK')
        .map(s => s.problem.contestId + s.problem.index)
    );
    cfSolved = solved.size;
  } catch {}
}

    const lcStats = lcRes.status === 'fulfilled'
      ? lcRes.value.data.data.matchedUser.submitStats.acSubmissionNum
      : [];

    const lcEasy = lcStats.find(s => s.difficulty === 'Easy')?.count || 0;
    const lcMedium = lcStats.find(s => s.difficulty === 'Medium')?.count || 0;
    const lcHard = lcStats.find(s => s.difficulty === 'Hard')?.count || 0;

    res.json({
  totalSolved: lcEasy + lcMedium + lcHard + cfSolved,
  activeDays: 0,
  donutData: {
    gfg: 0,
    lcEasy,
    lcMedium,
    lcHard,
    codechef: 0,
    codeforces: cfSolved,
  },
  cfRating: cfData?.rating || null,
});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});