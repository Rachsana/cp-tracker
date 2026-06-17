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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});