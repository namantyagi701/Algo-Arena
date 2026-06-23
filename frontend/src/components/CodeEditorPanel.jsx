import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, UploadIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isSubmitting,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onSubmitCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100/90 backdrop-blur-sm border-t border-base-300/50">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select className="select select-sm bg-base-200/50" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-outline btn-sm gap-2 hover-glow"
            disabled={isRunning || isSubmitting}
            onClick={onRunCode}
          >
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>

          {onSubmitCode && (
            <button
              className="btn btn-success btn-sm gap-2"
              disabled={isRunning || isSubmitting}
              onClick={onSubmitCode}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <UploadIcon className="size-4" />
                  Submit
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 15,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 16 },
            renderLineHighlight: "gutter",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
