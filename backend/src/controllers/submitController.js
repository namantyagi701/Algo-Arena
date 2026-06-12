import Problem from "../models/Problem.js";

const WANDBOX_API = "https://wandbox.org/api";

const WANDBOX_COMPILERS = {
  javascript: { compiler: "nodejs-18.20.4", language: "JavaScript" },
  python: { compiler: "cpython-3.12.7", language: "Python" },
  java: { compiler: "openjdk-jdk-22+36", language: "Java" },
};

/**
 * Generate a complete source file that runs all test cases in a single execution.
 * The user's code is prepended, then a test runner calls the function for each test case.
 */
function generateRunnerSource(language, userCode, functionName, testCases) {
  const inputs = testCases.map((tc) => tc.input);

  if (language === "javascript") {
    const testRunner = inputs
      .map((input) => `console.log(JSON.stringify(${functionName}(...${input})));`)
      .join("\n");
    return `${userCode}\n\n${testRunner}`;
  }

  if (language === "python") {
    const testRunner = inputs
      .map((input) => `print(__import__('json').dumps(${functionName}(*${input})))`)
      .join("\n");
    return `${userCode}\n\n${testRunner}`;
  }

  if (language === "java") {
  const testCalls = inputs
    .map(
      (input) =>
        `        System.out.println(toJson(sol.${functionName}(${parseJavaArgs(input)})));`
    )
    .join("\n");

  const userCodeTrimmed = userCode.replace(/}\s*$/, "");

  return `import java.util.*;

${userCodeTrimmed}

    private static String toJson(Object obj) {
        if (obj instanceof int[]) {
            return Arrays.toString((int[]) obj).replace(" ", "");
        } else if (obj instanceof String[]) {
            return Arrays.toString((String[]) obj);
        } else if (obj instanceof char[]) {
            StringBuilder sb = new StringBuilder("[");
            char[] arr = (char[]) obj;
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append("\\"").append(arr[i]).append("\\"");
            }
            sb.append("]");
            return sb.toString();
        } else if (obj instanceof Boolean) {
            return String.valueOf(obj);
        }
        return String.valueOf(obj);
    }

    public static void main(String[] args) {
        Solution sol = new Solution();

${testCalls}
    }
}`;
}

  throw new Error(`Unsupported language: ${language}`);
}

/**
 * Parse JSON array input into Java method arguments.
 * e.g. "[[2,7,11,15], 9]" -> "new int[]{2,7,11,15}, 9"
 */
function parseJavaArgs(inputStr) {
  try {
    const args = JSON.parse(inputStr);
    return args
      .map((arg) => {
        if (Array.isArray(arg)) {
          // Check if it's an array of strings/chars
          if (arg.every((item) => typeof item === "string" && item.length === 1)) {
            return `new char[]{${arg.map((c) => `'${c}'`).join(", ")}}`;
          }
          if (arg.every((item) => typeof item === "string")) {
            return `new String[]{${arg.map((s) => `"${s}"`).join(", ")}}`;
          }
          return `new int[]{${arg.join(", ")}}`;
        }
        if (typeof arg === "string") return `"${arg}"`;
        return String(arg);
      })
      .join(", ");
  } catch {
    return inputStr;
  }
}

/**
 * Execute code via Wandbox API
 */
async function executeViaWandbox(language, code) {
  const config = WANDBOX_COMPILERS[language];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  const response = await fetch(`${WANDBOX_API}/compile.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler: config.compiler,
      code: code,
      stdin: "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Wandbox returned ${response.status}`);
  }

  const data = await response.json();

  const output = data.program_output || "";
  const stderr = data.program_error || "";
  const compilerError = data.compiler_error || "";

  if (compilerError && !output) {
    return { success: false, output: "", error: compilerError };
  }

  if (stderr && !output) {
    return { success: false, output: "", error: stderr };
  }

  return { success: true, output: output };
}

/**
 * Normalize output for comparison
 */
function normalizeOutput(output) {
  return output
    .trim()
    .replace(/\[\s+/g, "[")
    .replace(/\s+\]/g, "]")
    .replace(/\s*,\s*/g, ",");
}

/**
 * POST /api/submit
 * Submit code for evaluation against all test cases (visible + hidden)
 */
export async function submitCode(req, res) {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ message: "problemId, language, and code are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (!problem.functionName) {
      return res.status(400).json({ message: "This problem does not support submission (no functionName configured)" });
    }

    const allTestCases = problem.testCases || [];
    if (allTestCases.length === 0) {
      return res.status(400).json({ message: "No test cases configured for this problem" });
    }

    // Generate a single source file with all test cases
    const source = generateRunnerSource(language, code, problem.functionName, allTestCases);

    // Execute once via Wandbox
    const execResult = await executeViaWandbox(language, source);

    if (!execResult.success) {
      return res.status(200).json({
        passed: 0,
        total: allTestCases.length,
        allPassed: false,
        error: execResult.error,
        results: allTestCases.map((tc, i) => ({
          testCase: i + 1,
          passed: false,
          isHidden: tc.isHidden,
          input: tc.isHidden ? "Hidden" : tc.input,
          expected: tc.isHidden ? "Hidden" : tc.expectedOutput,
          actual: "Compilation/Runtime Error",
        })),
      });
    }

    // Parse output — each line corresponds to one test case
    const outputLines = execResult.output.trim().split("\n");

    let passed = 0;
    const results = allTestCases.map((tc, i) => {
      const actualOutput = outputLines[i] ? normalizeOutput(outputLines[i]) : "";
      const expectedOutput = normalizeOutput(tc.expectedOutput);
      const isPassed = actualOutput === expectedOutput;

      if (isPassed) passed++;

      return {
        testCase: i + 1,
        passed: isPassed,
        isHidden: tc.isHidden,
        // For hidden cases: only reveal input/expected if passed
        input: tc.isHidden ? "Hidden" : tc.input,
        expected: tc.isHidden ? "Hidden" : tc.expectedOutput,
        actual: tc.isHidden && !isPassed ? "Wrong Answer" : (outputLines[i] || "No output").trim(),
      };
    });

    res.status(200).json({
      passed,
      total: allTestCases.length,
      allPassed: passed === allTestCases.length,
      results,
    });
  } catch (error) {
    console.error("Error in submitCode:", error.message);
    res.status(500).json({ message: "Code execution failed. Please try again." });
  }
}
