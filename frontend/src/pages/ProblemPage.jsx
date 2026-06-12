import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems";
import { submitApi } from "../api/submit";
import { LANGUAGE_CONFIG } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeWithTestCases } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => problemsApi.getById(id),
    enabled: !!id,
  });

  const currentProblem = data?.problem;

  // Set starter code when problem loads or language changes
  useEffect(() => {
    if (currentProblem) {
      setCode(currentProblem.starterCode?.[selectedLanguage] || "");
      setOutput(null);
      setSubmitResult(null);
    }
  }, [currentProblem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  // Run Code — client-side execution with visible test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setSubmitResult(null);

    const visibleTestCases = currentProblem?.testCases || [];
    const functionName = currentProblem?.functionName;

    const result = await executeWithTestCases(
      selectedLanguage,
      code,
      functionName,
      visibleTestCases
    );

    setOutput(result);
    setIsRunning(false);

    if (result.testResults) {
      if (result.allPassed) {
        toast.success("All visible tests passed! Try submitting.");
      } else {
        toast.error(`${result.passed}/${result.total} tests passed.`);
      }
    } else if (result.success) {
      toast.success("Code executed successfully!");
    } else {
      toast.error("Code execution failed!");
    }
  };

  // Submit — server-side execution with hidden test cases
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput(null);
    setSubmitResult(null);

    try {
      const result = await submitApi.submit(currentProblem._id, selectedLanguage, code);
      setSubmitResult(result);

      if (result.allPassed) {
        triggerConfetti();
        toast.success("🎉 All tests passed! Solution accepted!");
      } else if (result.error) {
        toast.error("Compilation/Runtime error!");
      } else {
        toast.error(`${result.passed}/${result.total} test cases passed.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed!");
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-base-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-screen bg-base-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-base-content/60">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblem._id}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} submitResult={submitResult} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
