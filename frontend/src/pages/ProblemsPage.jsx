import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems";

import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["problems"],
    queryFn: problemsApi.getAll,
  });

  const problems = data?.problems || [];

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-base-200 relative noise-bg">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* HEADER */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4 stagger-children">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card bg-base-100">
                <div className="card-body animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-12 rounded-lg bg-base-300" />
                    <div className="flex-1">
                      <div className="h-5 w-40 bg-base-300 rounded mb-2" />
                      <div className="h-3 w-24 bg-base-300 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-full bg-base-300 rounded" />
                </div>
              </div>
            ))
          ) : problems.length === 0 ? (
            <div className="text-center py-12 text-base-content/50">
              No problems available yet.
            </div>
          ) : (
            problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problem/${problem._id}`}
                className="card bg-base-100/90 backdrop-blur-sm hover-glow border border-base-content/5 transition-all duration-300"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT SIDE */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Code2Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold">{problem.title}</h2>
                            <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-base-content/60"> {problem.category}</p>
                        </div>
                      </div>
                      <p className="text-base-content/80 mb-3">
                        {problem.description?.text || problem.description}
                      </p>
                    </div>
                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                      <span className="font-medium">Solve</span>
                      <ChevronRightIcon className="size-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* STATS FOOTER */}
        {!isLoading && problems.length > 0 && (
          <div className="mt-12 card bg-base-100/90 backdrop-blur-sm shadow-lg border border-base-content/5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-body">
              <div className="stats stats-vertical lg:stats-horizontal">
                <div className="stat">
                  <div className="stat-title">Total Problems</div>
                  <div className="stat-value text-primary">{problems.length}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Easy</div>
                  <div className="stat-value text-success">{easyProblemsCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Medium</div>
                  <div className="stat-value text-warning">{mediumProblemsCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Hard</div>
                  <div className="stat-value text-error">{hardProblemsCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProblemsPage;
