import { CheckCircleIcon, XCircleIcon, EyeOffIcon, TerminalIcon } from "lucide-react";

function OutputPanel({ output, submitResult }) {
  // If there's a submit result, show that
  if (submitResult) {
    return (
      <div className="h-full bg-base-100 flex flex-col">
        <div className="px-4 py-2 bg-base-200/80 backdrop-blur-sm border-b border-base-300/50 font-semibold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="size-3.5 text-base-content/50" />
            <span>Submission Results</span>
          </div>
          {submitResult.allPassed ? (
            <span className="badge badge-success badge-sm gap-1">
              <CheckCircleIcon className="size-3" />
              Accepted
            </span>
          ) : (
            <span className="badge badge-error badge-sm gap-1">
              <XCircleIcon className="size-3" />
              {submitResult.error ? "Error" : "Wrong Answer"}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {/* Summary bar */}
          <div className="flex items-center gap-3 mb-2">
            <div className="text-sm font-semibold">
              {submitResult.passed}/{submitResult.total} test cases passed
            </div>
            <progress
              className={`progress w-32 ${submitResult.allPassed ? "progress-success" : "progress-error"}`}
              value={submitResult.passed}
              max={submitResult.total}
            />
          </div>

          {/* Error message */}
          {submitResult.error && (
            <div className="bg-error/10 border border-error/30 rounded-lg p-3">
              <pre className="text-sm font-mono text-error whitespace-pre-wrap">{submitResult.error}</pre>
            </div>
          )}

          {/* Per test case results */}
          {submitResult.results?.map((result) => (
            <div
              key={result.testCase}
              className={`border rounded-lg p-3 transition-colors duration-200 ${
                result.passed
                  ? "border-success/30 bg-success/5"
                  : "border-error/30 bg-error/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {result.passed ? (
                  <CheckCircleIcon className="size-4 text-success" />
                ) : (
                  <XCircleIcon className="size-4 text-error" />
                )}
                <span className="text-sm font-semibold">
                  Test Case {result.testCase}
                </span>
                {result.isHidden && (
                  <span className="badge badge-ghost badge-xs gap-1">
                    <EyeOffIcon className="size-3" />
                    Hidden
                  </span>
                )}
              </div>

              {!result.isHidden ? (
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <div className="flex gap-2">
                    <span className="text-base-content/50 min-w-[70px]">Input:</span>
                    <span className="text-base-content/80">{result.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-base-content/50 min-w-[70px]">Expected:</span>
                    <span className="text-base-content/80">{result.expected}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-base-content/50 min-w-[70px]">Output:</span>
                    <span className={result.passed ? "text-success" : "text-error"}>
                      {result.actual}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-xs text-base-content/40 italic">
                  {result.passed ? "Passed" : "Wrong Answer — hidden test case details are not shown"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: show run output
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200/80 backdrop-blur-sm border-b border-base-300/50 font-semibold text-sm flex items-center gap-2">
        <TerminalIcon className="size-3.5 text-base-content/50" />
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/40">
            <TerminalIcon className="size-8 mb-2 opacity-30" />
            <p className="text-sm">Click &quot;Run Code&quot; to see the output here...</p>
          </div>
        ) : output.testResults ? (
          // Run with test cases result
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm font-semibold">
                {output.passed}/{output.total} visible test cases passed
              </div>
              <progress
                className={`progress w-32 ${output.allPassed ? "progress-success" : "progress-error"}`}
                value={output.passed}
                max={output.total}
              />
            </div>
            {output.testResults.map((result) => (
              <div
                key={result.testCase}
                className={`border rounded-lg p-3 transition-colors duration-200 ${
                  result.passed
                    ? "border-success/30 bg-success/5"
                    : "border-error/30 bg-error/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {result.passed ? (
                    <CheckCircleIcon className="size-4 text-success" />
                  ) : (
                    <XCircleIcon className="size-4 text-error" />
                  )}
                  <span className="text-sm font-semibold">Test Case {result.testCase}</span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <div className="flex gap-2">
                    <span className="text-base-content/50 min-w-[70px]">Input:</span>
                    <span className="text-base-content/80">{result.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-base-content/50 min-w-[70px]">Expected:</span>
                    <span className="text-base-content/80">{result.expected}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-base-content/50 min-w-[70px]">Output:</span>
                    <span className={result.passed ? "text-success" : "text-error"}>
                      {result.actual}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : output.success ? (
          <pre className="text-sm font-mono text-success whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
