import Problem from "../models/Problem.js";
import User from "../models/User.js";

// POST /api/admin/problems
export async function createProblem(req, res) {
  try {
    const {
      title,
      difficulty,
      category,
      description,
      examples,
      constraints,
      functionName,
      starterCode,
      testCases,
      expectedOutput,
    } = req.body;

    if (!title || !difficulty || !category || !description?.text) {
      return res.status(400).json({ message: "Title, difficulty, category, and description are required" });
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({ message: "Difficulty must be Easy, Medium, or Hard" });
    }

    const problem = await Problem.create({
      title,
      difficulty,
      category,
      description,
      examples: examples || [],
      constraints: constraints || [],
      functionName: functionName || "",
      starterCode: starterCode || {},
      testCases: testCases || [],
      expectedOutput: expectedOutput || {},
      createdBy: req.user._id,
    });

    res.status(201).json({ problem });
  } catch (error) {
    console.error("Error in createProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/admin/problems
export async function getAllProblemsAdmin(req, res) {
  try {
    const { search, difficulty, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "name email"),
      Problem.countDocuments(filter),
    ]);

    res.status(200).json({
      problems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error in getAllProblemsAdmin:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/admin/problems/:id
export async function getProblemByIdAdmin(req, res) {
  try {
    const problem = await Problem.findById(req.params.id).populate("createdBy", "name email");

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemByIdAdmin:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// PUT /api/admin/problems/:id
export async function updateProblem(req, res) {
  try {
    const {
      title,
      difficulty,
      category,
      description,
      examples,
      constraints,
      functionName,
      starterCode,
      testCases,
      expectedOutput,
    } = req.body;

    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({ message: "Difficulty must be Easy, Medium, or Hard" });
    }

    const updateData = {
      ...(title && { title }),
      ...(difficulty && { difficulty }),
      ...(category && { category }),
      ...(description && { description }),
      ...(examples && { examples }),
      ...(constraints && { constraints }),
      ...(starterCode && { starterCode }),
      ...(expectedOutput && { expectedOutput }),
    };

    // Allow setting functionName even if empty string
    if (functionName !== undefined) updateData.functionName = functionName;
    // Allow setting testCases even if empty array
    if (testCases !== undefined) updateData.testCases = testCases;

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in updateProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// DELETE /api/admin/problems/:id
export async function deleteProblem(req, res) {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/admin/stats
export async function getDashboardStats(req, res) {
  try {
    const [totalProblems, totalUsers, difficultyCounts] = await Promise.all([
      Problem.countDocuments(),
      User.countDocuments(),
      Problem.aggregate([
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),
    ]);

    const stats = {
      totalProblems,
      totalUsers,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    difficultyCounts.forEach(({ _id, count }) => {
      stats[_id.toLowerCase()] = count;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error in getDashboardStats:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
