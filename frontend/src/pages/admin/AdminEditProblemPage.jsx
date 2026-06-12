import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";
import { PlusIcon, Trash2Icon, Loader2Icon, ArrowLeftIcon } from "lucide-react";

function AdminEditProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

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
        examples: p.examples?.length ? p.examples.map((e) => ({ input: e.input || "", output: e.output || "", explanation: e.explanation || "" })) : [{ input: "", output: "", explanation: "" }],
        constraints: p.constraints?.length ? [...p.constraints] : [""],
        starterCode: { javascript: p.starterCode?.javascript || "", python: p.starterCode?.python || "", java: p.starterCode?.java || "" },
        expectedOutput: { javascript: p.expectedOutput?.javascript || "", python: p.expectedOutput?.python || "", java: p.expectedOutput?.java || "" },
      });
    }
  }, [data]);

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

    mutation.mutate({
      title: form.title,
      difficulty: form.difficulty,
      category: form.category,
      description: { text: form.descriptionText, notes: form.descriptionNotes.filter((n) => n.trim()) },
      examples: form.examples.filter((ex) => ex.input.trim() || ex.output.trim()),
      constraints: form.constraints.filter((c) => c.trim()),
      starterCode: form.starterCode,
      expectedOutput: form.expectedOutput,
    });
  };

  const addArrayItem = (field, template) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].map((item, i) => (i === index ? value : item)) }));
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
            <div className="form-control mt-2">
              <label className="label"><span className="label-text font-medium">Difficulty *</span></label>
              <select className="select select-bordered w-full md:w-48" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
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

        {/* Starter Code */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Starter Code</h2>
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

        {/* Expected Output */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Expected Output</h2>
            {["javascript", "python", "java"].map((lang) => (
              <div key={lang} className="form-control mt-2">
                <label className="label"><span className="label-text font-medium capitalize">{lang}</span></label>
                <textarea
                  className="textarea textarea-bordered font-mono text-sm h-20"
                  value={form.expectedOutput[lang]}
                  onChange={(e) => setForm({ ...form, expectedOutput: { ...form.expectedOutput, [lang]: e.target.value } })}
                />
              </div>
            ))}
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
