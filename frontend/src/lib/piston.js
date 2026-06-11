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
