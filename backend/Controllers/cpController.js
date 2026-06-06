import axios from "axios";
import User from "../Model/User.js";

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

const getCached = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const updateCPProfiles = async (req, res) => {
  try {
    const { leetcode } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cpProfiles = { leetcode: leetcode?.trim() || "" };
    await user.save();
    cache.delete(`lc_${user._id}`);

    res.json({ message: "LeetCode profile updated successfully", cpProfiles: user.cpProfiles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCPStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profiles = user.cpProfiles || {};
    const result = { leetcode: null, profiles };

    if (profiles.leetcode) {
      result.leetcode = await fetchLeetCodeStats(user._id, profiles.leetcode);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCPStatsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profiles = user.cpProfiles || {};
    const result = { leetcode: null, profiles };

    if (profiles.leetcode) {
      result.leetcode = await fetchLeetCodeStats(user._id, profiles.leetcode);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function fetchLeetCodeStats(userId, username) {
  const cacheKey = `lc_${userId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // Use LeetCode's official GraphQL API
    const { data } = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }`,
        variables: { username },
      },
      {
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://leetcode.com",
        },
      }
    );

    const user = data?.data?.matchedUser;
    if (!user) {
      return { platform: "LeetCode", username, error: "User not found. Check your username." };
    }

    const acStats = user.submitStats?.acSubmissionNum || [];
    const allQ = data?.data?.allQuestionsCount || [];

    const get = (arr, diff) => arr.find(x => x.difficulty === diff)?.count || 0;

    const result = {
      platform: "LeetCode",
      username,
      totalSolved: get(acStats, "All"),
      easySolved: get(acStats, "Easy"),
      mediumSolved: get(acStats, "Medium"),
      hardSolved: get(acStats, "Hard"),
      totalQuestions: get(allQ, "All"),
      totalEasy: get(allQ, "Easy"),
      totalMedium: get(allQ, "Medium"),
      totalHard: get(allQ, "Hard"),
      ranking: user.profile?.ranking || "N/A",
      acceptanceRate: 0,
      contributionPoints: 0,
      reputation: 0,
    };

    setCache(cacheKey, result);
    return result;
  } catch (err) {
    return { platform: "LeetCode", username, error: "Failed to fetch stats. Check your username." };
  }
}
