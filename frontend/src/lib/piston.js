// Code execution via Wandbox API (free, no auth required)
// Fallback: emkc Piston API (may require auth)

const WANDBOX_API = "https://wandbox.org/api";

// Wandbox compiler names for each language
const WANDBOX_COMPILERS = {
  javascript: { compiler: "nodejs-18.20.4", language: "JavaScript" },
  python: { compiler: "cpython-3.12.7", language: "Python" },
  java: { compiler: "openjdk-jdk-22+36", language: "Java" },
};

// Piston API config (fallback — may return 401)
const PISTON_API = "https://emkc.org/api/v2/piston";
const PISTON_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

/*
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  // Try Wandbox first (free, no auth)
  const wandboxResult = await executeWithWandbox(language, code);
  if (wandboxResult !== null) return wandboxResult;

  // Fallback to Piston
  const pistonResult = await executeWithPiston(language, code);
  if (pistonResult !== null) return pistonResult;

  return {
    success: false,
    error: "All code execution services are unavailable. Please try again later.",
  };
}

/**
 * Execute user code with visible test cases using dynamic runner generation.
 * This builds a combined source (user code + test runner) and executes in a single call.
 *
 * @param {string} language - programming language
 * @param {string} userCode - the user's solution code (function only)
 * @param {string} functionName - the function to call
 * @param {Array} testCases - array of { input, expectedOutput } (visible only)
 * @returns {Promise<{success:boolean, output?:string, error?:string, testResults?:Array}>}
 */
export async function executeWithTestCases(language, userCode, functionName, testCases) {
  if (!functionName || !testCases || testCases.length === 0) {
    // Fallback to raw execution if no test cases configured
    return executeCode(language, userCode);
  }

  const source = generateRunnerSource(language, userCode, functionName, testCases);
  const result = await executeCode(language, source);

  if (!result.success) {
    return result;
  }

  // Parse output lines and compare against expected
  const outputLines = result.output.trim().split("\n");

  const testResults = testCases.map((tc, i) => {
    const actual = outputLines[i] ? normalizeOutput(outputLines[i]) : "";
    const expected = normalizeOutput(tc.expectedOutput);
    return {
      testCase: i + 1,
      passed: actual === expected,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: (outputLines[i] || "No output").trim(),
    };
  });

  const passed = testResults.filter((r) => r.passed).length;

  return {
    success: true,
    output: result.output,
    testResults,
    passed,
    total: testCases.length,
    allPassed: passed === testCases.length,
  };
}

/**
 * Generate a combined source file: user code + test runner
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
    // For Java, inject main method into the Solution class
    const testCalls = inputs
      .map((input) => {
        return `        System.out.println(toJson(${functionName}(${parseJavaArgs(input)})));`;
      })
      .join("\n");

    const userCodeTrimmed = userCode.replace(/}\s*$/, "");

    return `import java.util.*;

${userCodeTrimmed}

    private static String toJson(Object obj) {
        if (obj instanceof int[]) {
            return Arrays.toString((int[]) obj).replace(" ", "");
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
${testCalls}
    }
}`;
  }

  // Fallback — just run the code as-is
  return userCode;
}

/**
 * Parse JSON array input into Java method arguments
 */
function parseJavaArgs(inputStr) {
  try {
    const args = JSON.parse(inputStr);
    return args
      .map((arg) => {
        if (Array.isArray(arg)) {
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

function normalizeOutput(output) {
  return output
    .trim()
    .replace(/\[\s+/g, "[")
    .replace(/\s+\]/g, "]")
    .replace(/\s*,\s*/g, ",");
}

async function executeWithWandbox(language, code) {
  const config = WANDBOX_COMPILERS[language];
  if (!config) return null;

  try {
    const response = await fetch(`${WANDBOX_API}/compile.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: config.compiler,
        code: code,
        stdin: "",
      }),
    });

    if (!response.ok) return null; // fall through to next provider

    const data = await response.json();

    // Wandbox returns: program_output, program_error, compiler_error, compiler_output
    const output = data.program_output || "";
    const stderr = data.program_error || "";
    const compilerError = data.compiler_error || "";

    if (compilerError && !output) {
      return {
        success: false,
        output: "",
        error: compilerError,
      };
    }

    if (stderr && !output) {
      return {
        success: false,
        output: "",
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || stderr || "No output",
    };
  } catch {
    return null; // network error, try next
  }
}

async function executeWithPiston(language, code) {
  const config = PISTON_VERSIONS[language];
  if (!config) {
    return {
      success: false,
      error: `Unsupported language: ${language}`,
    };
  }

  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) return null;

    const data = await response.json();

    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch {
    return null;
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}
