import Problem from "../models/Problem.js";

// GET /api/problems — public list
export async function getProblems(req, res) {
  try {
    const problems = await Problem.find()
      .sort({ createdAt: -1 });

    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error in getProblems:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/problems/:id — public detail
export async function getProblemById(req, res) {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
