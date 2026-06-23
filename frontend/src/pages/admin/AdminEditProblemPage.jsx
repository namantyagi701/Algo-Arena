import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";
import {
  PlusIcon,
  Trash2Icon,
  Loader2Icon,
  ArrowLeftIcon,
  EyeOffIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";

/* ─── Argument helpers (shared with Add page) ─── */
const ARG_TYPES = [
  { value: "number", label: "Number" },
  { value: "string", label: "String" },
  { value: "number[]", label: "Array of Numbers" },
  { value: "string[]", label: "Array of Strings" },
  { value: "boolean", label: "Boolean" },
  { value: "null", label: "Null" },
];

function defaultArgValue(type) {
  switch (type) {
    case "number":
      return "";
    case "string":
      return "";
    case "number[]":
      return "";
    case "string[]":
      return "";
    case "boolean":
      return "true";
    case "null":
      return "";
    default:
      return "";
  }
}

function createEmptyArg() {
  return { type: "number", value: "" };
}

function argToJsonValue(arg) {
  switch (arg.type) {
    case "number":
      return Number(arg.value);
    case "string":
      return String(arg.value);
    case "number[]":
      return arg.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .map(Number);
    case "string[]":
      return arg.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    case "boolean":
      return arg.value === "true";
    case "null":
      return null;
    default:
      return arg.value;
  }
}

function argsToJsonString(args) {
  try {
    const values = args.map(argToJsonValue);
    return JSON.stringify(values);
  } catch {
    return "[]";
  }
}

/**
 * Parse a JSON input string (e.g. '[[2,7,11,15], 9]') back into structured args.
 * Falls back to a single string arg if parsing fails.
 */
function parseJsonInputToArgs(inputStr) {
  try {
    const parsed = JSON.parse(inputStr);
    if (!Array.isArray(parsed)) {
      return [{ type: "string", value: inputStr }];
    }
    return parsed.map((val) => {
      if (val === null) return { type: "null", value: "" };
      if (typeof val === "boolean") return { type: "boolean", value: String(val) };
      if (typeof val === "number") return { type: "number", value: String(val) };
      if (typeof val === "string") return { type: "string", value: val };
      if (Array.isArray(val)) {
        if (val.every((item) => typeof item === "number")) {
          return { type: "number[]", value: val.join(", ") };
        }
        if (val.every((item) => typeof item === "string")) {
          return { type: "string[]", value: val.join(", ") };
        }
        // Mixed array — fall back to number array
        return { type: "number[]", value: val.join(", ") };
      }
      return { type: "string", value: JSON.stringify(val) };
    });
  } catch {
    return [{ type: "string", value: inputStr }];
  }
}

function AdminEditProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-problem", id],
    queryFn: () => adminApi.getProblemById(id),
  });

  // Prefill form when data loads
  useEffect(() => {
    if (data?.problem) {
      const p = data.problem;
      setForm({
        title: p.title || "",
        difficulty: p.difficulty || "Easy",
        category: p.category || "",
        descriptionText: p.description?.text || "",
        descriptionNotes: p.description?.notes?.length ? p.description.notes : [""],
        examples: p.examples?.length
          ? p.examples.map((e) => ({ input: e.input || "", output: e.output || "", explanation: e.explanation || "" }))
          : [{ input: "", output: "", explanation: "" }],
        constraints: p.constraints?.length ? [...p.constraints] : [""],
        functionName: p.functionName || "",
        starterCode: {
          javascript: p.starterCode?.javascript || "",
          python: p.starterCode?.python || "",
          java: p.starterCode?.java || "",
        },
        testCases: p.testCases?.length
          ? p.testCases.map((tc) => ({
              args: parseJsonInputToArgs(tc.input || "[]"),
              expectedOutput: tc.expectedOutput || "",
              isHidden: tc.isHidden || false,
            }))
          : [{ args: [createEmptyArg()], expectedOutput: "", isHidden: false }],
      });
    }
  }, [data]);

  const buildPayload = () => {
    if (!form) return {};
    return {
      title: form.title,
      difficulty: form.difficulty,
      category: form.category,
      description: {
        text: form.descriptionText,
        notes: form.descriptionNotes.filter((n) => n.trim()),
      },
      examples: form.examples.filter((ex) => ex.input.trim() || ex.output.trim()),
      constraints: form.constraints.filter((c) => c.trim()),
      functionName: form.functionName,
      starterCode: form.starterCode,
      testCases: form.testCases
        .filter((tc) => tc.args.length > 0 || tc.expectedOutput.trim())
        .map((tc) => ({
          input: argsToJsonString(tc.args),
          expectedOutput: tc.expectedOutput.trim(),
          isHidden: tc.isHidden,
        })),
    };
  };

  const mutation = useMutation({
    mutationFn: (payload) => adminApi.updateProblem(id, payload),
    onSuccess: () => {
      toast.success("Problem updated successfully!");
      navigate("/admin/problems");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update problem");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim() || !form.descriptionText.trim()) {
      toast.error("Title, category, and description are required");
      return;
    }
    mutation.mutate(buildPayload());
  };

  /* ─── Array helpers ─── */
  const addArrayItem = (field, template) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].map((item, i) => (i === index ? value : item)) }));
  };

  /* ─── Test-case argument helpers ─── */
  const addArg = (tcIndex) => {
    setForm((prev) => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) =>
        i === tcIndex ? { ...tc, args: [...tc.args, createEmptyArg()] } : tc
      ),
    }));
  };

  const removeArg = (tcIndex, argIndex) => {
    setForm((prev) => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) =>
        i === tcIndex ? { ...tc, args: tc.args.filter((_, j) => j !== argIndex) } : tc
      ),
    }));
  };

  const updateArg = (tcIndex, argIndex, updates) => {
    setForm((prev) => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) =>
        i === tcIndex
          ? {
              ...tc,
              args: tc.args.map((arg, j) =>
                j === argIndex
                  ? {
                      ...arg,
                      ...updates,
                      ...(updates.type && updates.type !== arg.type ? { value: defaultArgValue(updates.type) } : {}),
                    }
                  : arg
              ),
            }
          : tc
      ),
    }));
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(buildPayload(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !form) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-8 w-48 bg-base-300 rounded animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-md">
            <div className="card-body space-y-4">
              <div className="h-6 w-32 bg-base-300 rounded animate-pulse" />
              <div className="h-10 w-full bg-base-300 rounded animate-pulse" />
              <div className="h-10 w-full bg-base-300 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/problems")} className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeftIcon className="size-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Edit Problem</h1>
          <p className="text-base-content/60 mt-1">Update "{form.title}"</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Title *</span></label>
                <input type="text" className="input input-bordered" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Category *</span></label>
                <input type="text" className="input input-bordered" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Difficulty *</span></label>
                <select className="select select-bordered w-full" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Function Name *</span></label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={form.functionName}
                  onChange={(e) => setForm({ ...form, functionName: e.target.value })}
                  placeholder="e.g. twoSum"
                />
                <label className="label"><span className="label-text-alt text-base-content/50">The function name to call in the test runner</span></label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Description</h2>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Description Text *</span></label>
              <textarea className="textarea textarea-bordered h-28" value={form.descriptionText} onChange={(e) => setForm({ ...form, descriptionText: e.target.value })} required />
            </div>
            <div className="form-control mt-3">
              <label className="label"><span className="label-text font-medium">Notes</span></label>
              {form.descriptionNotes.map((note, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" className="input input-bordered flex-1 input-sm" value={note} onChange={(e) => updateArrayItem("descriptionNotes", i, e.target.value)} />
                  {form.descriptionNotes.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm btn-circle text-error" onClick={() => removeArrayItem("descriptionNotes", i)}>
                      <Trash2Icon className="size-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm w-fit gap-1" onClick={() => addArrayItem("descriptionNotes", "")}>
                <PlusIcon className="size-4" /> Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Examples</h2>
            {form.examples.map((example, i) => (
              <div key={i} className="border border-base-300 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-base-content/60">Example {i + 1}</span>
                  {form.examples.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => removeArrayItem("examples", i)}>
                      <Trash2Icon className="size-3" /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs">Input</span></label>
                    <input type="text" className="input input-bordered input-sm" value={example.input} onChange={(e) => updateArrayItem("examples", i, { ...example, input: e.target.value })} />
                  </div>
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text text-xs">Output</span></label>
                    <input type="text" className="input input-bordered input-sm" value={example.output} onChange={(e) => updateArrayItem("examples", i, { ...example, output: e.target.value })} />
                  </div>
                </div>
                <div className="form-control mt-2">
                  <label className="label py-1"><span className="label-text text-xs">Explanation (optional)</span></label>
                  <input type="text" className="input input-bordered input-sm" value={example.explanation} onChange={(e) => updateArrayItem("examples", i, { ...example, explanation: e.target.value })} />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm w-fit gap-1" onClick={() => addArrayItem("examples", { input: "", output: "", explanation: "" })}>
              <PlusIcon className="size-4" /> Add Example
            </button>
          </div>
        </div>

        {/* Constraints */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Constraints</h2>
            {form.constraints.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" className="input input-bordered flex-1 input-sm" value={c} onChange={(e) => updateArrayItem("constraints", i, e.target.value)} />
                {form.constraints.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm btn-circle text-error" onClick={() => removeArrayItem("constraints", i)}>
                    <Trash2Icon className="size-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm w-fit gap-1" onClick={() => addArrayItem("constraints", "")}>
              <PlusIcon className="size-4" /> Add Constraint
            </button>
          </div>
        </div>

        {/* Test Cases — structured argument builder */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Test Cases</h2>
            <p className="text-sm text-base-content/50 mb-3">
              Add function arguments using the structured builder below. Each argument has a type and a value.
              For arrays, separate items with commas (e.g. <code className="text-xs bg-base-200 px-1 py-0.5 rounded">2, 7, 11, 15</code>).
            </p>

            {form.testCases.map((tc, tcIdx) => (
              <div
                key={tcIdx}
                className={`border rounded-lg p-4 mb-3 ${tc.isHidden ? "border-warning/40 bg-warning/5" : "border-base-300"}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-base-content/60">Test Case {tcIdx + 1}</span>
                    {tc.isHidden && (
                      <span className="badge badge-warning badge-xs gap-1">
                        <EyeOffIcon className="size-3" /> Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="label cursor-pointer gap-2 py-0">
                      <span className="label-text text-xs">Hidden</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-warning toggle-xs"
                        checked={tc.isHidden}
                        onChange={(e) =>
                          updateArrayItem("testCases", tcIdx, { ...tc, isHidden: e.target.checked })
                        }
                      />
                    </label>
                    {form.testCases.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeArrayItem("testCases", tcIdx)}
                      >
                        <Trash2Icon className="size-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Arguments */}
                <div className="mb-3">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">Function Arguments</span>
                  </label>
                  {tc.args.map((arg, argIdx) => (
                    <div key={argIdx} className="flex items-start gap-2 mb-2">
                      <div className="badge badge-ghost badge-sm mt-2 shrink-0 font-mono">
                        arg {argIdx + 1}
                      </div>
                      <select
                        className="select select-bordered select-xs w-36 shrink-0"
                        value={arg.type}
                        onChange={(e) => updateArg(tcIdx, argIdx, { type: e.target.value })}
                      >
                        {ARG_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {arg.type === "boolean" ? (
                        <select
                          className="select select-bordered select-xs flex-1"
                          value={arg.value}
                          onChange={(e) => updateArg(tcIdx, argIdx, { value: e.target.value })}
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : arg.type === "null" ? (
                        <input
                          type="text"
                          className="input input-bordered input-xs flex-1 opacity-50"
                          value="null"
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          className="input input-bordered input-xs flex-1 font-mono"
                          value={arg.value}
                          onChange={(e) => updateArg(tcIdx, argIdx, { value: e.target.value })}
                          placeholder={
                            arg.type === "number"
                              ? "e.g. 9"
                              : arg.type === "string"
                              ? 'e.g. hello world'
                              : arg.type === "number[]"
                              ? "e.g. 2, 7, 11, 15"
                              : arg.type === "string[]"
                              ? "e.g. hello, world"
                              : ""
                          }
                        />
                      )}
                      {tc.args.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs btn-circle text-error mt-0.5"
                          onClick={() => removeArg(tcIdx, argIdx)}
                        >
                          <Trash2Icon className="size-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs w-fit gap-1"
                    onClick={() => addArg(tcIdx)}
                  >
                    <PlusIcon className="size-3" /> Add Argument
                  </button>

                  {/* Live preview of generated input */}
                  <div className="mt-2 text-xs text-base-content/40 font-mono bg-base-200/50 rounded px-2 py-1">
                    Generated: <span className="text-base-content/70">{argsToJsonString(tc.args)}</span>
                  </div>
                </div>

                {/* Expected output */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">Expected Output</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-sm font-mono"
                    value={tc.expectedOutput}
                    onChange={(e) =>
                      updateArrayItem("testCases", tcIdx, { ...tc, expectedOutput: e.target.value })
                    }
                    placeholder='e.g. [0,1] or [[-1,-1,2],[-1,0,1]] or true or "hello"'
                  />
                  <label className="label py-0.5">
                    <span className="label-text-alt text-base-content/50">
                      Include the outer brackets (e.g. <code className="bg-base-200 px-1 rounded font-mono text-[10px]">[[-1,-1,2],[-1,0,1]]</code>) to match the function's return value.
                    </span>
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-ghost btn-sm w-fit gap-1"
              onClick={() =>
                addArrayItem("testCases", {
                  args: [createEmptyArg()],
                  expectedOutput: "",
                  isHidden: false,
                })
              }
            >
              <PlusIcon className="size-4" /> Add Test Case
            </button>
          </div>
        </div>

        {/* Starter Code */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Starter Code</h2>
            <p className="text-sm text-base-content/50 mb-3">
              Function/class skeleton only — do not include test case calls.
            </p>
            {["javascript", "python", "java"].map((lang) => (
              <div key={lang} className="form-control mt-2">
                <label className="label"><span className="label-text font-medium capitalize">{lang}</span></label>
                <textarea
                  className="textarea textarea-bordered font-mono text-sm h-32"
                  value={form.starterCode[lang]}
                  onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, [lang]: e.target.value } })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* JSON Preview */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <button
              type="button"
              className="flex items-center gap-2 w-full text-left"
              onClick={() => setShowJsonPreview(!showJsonPreview)}
            >
              <CodeIcon className="size-4 text-base-content/50" />
              <span className="text-sm font-medium text-base-content/60">JSON Preview</span>
              {showJsonPreview ? (
                <ChevronUpIcon className="size-4 text-base-content/40 ml-auto" />
              ) : (
                <ChevronDownIcon className="size-4 text-base-content/40 ml-auto" />
              )}
            </button>
            {showJsonPreview && (
              <div className="mt-3 relative">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs absolute top-2 right-2 gap-1"
                  onClick={handleCopyJson}
                >
                  {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <pre className="bg-base-200 rounded-lg p-4 text-xs font-mono overflow-x-auto max-h-96">
                  {JSON.stringify(buildPayload(), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-8">
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin/problems")}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? (<><Loader2Icon className="size-4 animate-spin" /> Saving...</>) : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditProblemPage;
