import Problem from "../models/Problem.js";

// GET /api/problems — public list (excludes hidden test cases and solutionTemplate)
export async function getProblems(req, res) {
  try {
    const problems = await Problem.find()
      .sort({ createdAt: -1 });

    // Filter out hidden test cases from each problem
    const sanitized = problems.map((p) => {
      const obj = p.toObject();
      obj.testCases = (obj.testCases || []).filter((tc) => !tc.isHidden);
      return obj;
    });

    res.status(200).json({ problems: sanitized });
  } catch (error) {
    console.error("Error in getProblems:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/problems/:id — public detail (excludes hidden test cases)
export async function getProblemById(req, res) {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Filter out hidden test cases
    const obj = problem.toObject();
    obj.testCases = (obj.testCases || []).filter((tc) => !tc.isHidden);

    res.status(200).json({ problem: obj });
  } catch (error) {
    console.error("Error in getProblemById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
