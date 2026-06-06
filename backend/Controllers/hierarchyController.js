import User from "../Model/User.js";

const fetchSubordinates = async (userId, depth = 0, maxDepth = 3) => {
  if (depth >= maxDepth) return [];

  const children = await User.find({ creatorId: userId }).select("-password");
  const result = [];

  for (const child of children) {
    const childObj = child.toObject();
    childObj.children = await fetchSubordinates(child._id, depth + 1, maxDepth);
    childObj.childCount = childObj.children.length;
    result.push(childObj);
  }

  return result;
};

export const getDeepHierarchy = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === "student") {
      const self = await User.findById(req.user._id).select("-password");
      return res.json({ children: [], self: self.toObject() });
    }

    const maxDepthMap = {
      super_admin: 4,
      dean: 3,
      hod: 2,
      mentor: 1,
    };

    const maxDepth = maxDepthMap[role] || 1;
    const children = await fetchSubordinates(req.user._id, 0, maxDepth);

    const computeStats = (nodes) => {
      let totalStudents = 0;
      let totalScore = 0;
      let studentCount = 0;

      const traverse = (items) => {
        for (const item of items) {
          if (item.role === "student") {
            totalStudents++;
            totalScore += item.score || 0;
            studentCount++;
          }
          if (item.children && item.children.length > 0) {
            traverse(item.children);
          }
        }
      };

      traverse(nodes);
      return {
        totalStudents,
        averageScore: studentCount > 0 ? Math.round(totalScore / studentCount) : 0,
      };
    };

    const stats = computeStats(children);
    res.json({ children, stats });
  } catch (error) {
    console.error("Hierarchy error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getChildrenOf = async (req, res) => {
  try {
    const { userId } = req.params;
    const isAllowed = await isInHierarchy(req.user._id, userId);

    if (!isAllowed && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view this user's data" });
    }

    const children = await User.find({ creatorId: userId }).select("-password");
    res.json({ children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isInHierarchy = async (parentId, targetId) => {
  if (parentId.toString() === targetId.toString()) return true;
  const children = await User.find({ creatorId: parentId }).select("_id");
  for (const child of children) {
    if (child._id.toString() === targetId.toString()) return true;
    const found = await isInHierarchy(child._id, targetId);
    if (found) return true;
  }
  return false;
};
