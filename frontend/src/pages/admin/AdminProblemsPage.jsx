import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../../lib/utils";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  SearchIcon,
  EditIcon,
  Trash2Icon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  Loader2Icon,
} from "lucide-react";

function AdminProblemsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, problem: null });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-problems", { search, difficulty, page }],
    queryFn: () => adminApi.getProblems({ search, difficulty, page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteProblem(id),
    onSuccess: () => {
      toast.success("Problem deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-problems"] });
      setDeleteModal({ open: false, problem: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete problem");
    },
  });

  const problems = data?.problems || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-base-content/60 mt-1">{pagination.total} total problems</p>
        </div>
        <Link to="/admin/problems/add" className="btn btn-primary gap-2">
          <PlusCircleIcon className="size-5" />
          Add Problem
        </Link>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search problems..."
                className="input input-bordered w-full pl-10 input-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="select select-bordered select-sm w-full sm:w-40"
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            >
              <option value="">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-md overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="h-4 w-40 bg-base-300 rounded animate-pulse" /></td>
                  <td><div className="h-5 w-16 bg-base-300 rounded animate-pulse" /></td>
                  <td><div className="h-4 w-28 bg-base-300 rounded animate-pulse" /></td>
                  <td><div className="h-4 w-24 bg-base-300 rounded animate-pulse ml-auto" /></td>
                </tr>
              ))
            ) : problems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-base-content/50">
                  No problems found
                </td>
              </tr>
            ) : (
              problems.map((problem) => (
                <tr key={problem._id} className="hover">
                  <td className="font-medium">{problem.title}</td>
                  <td>
                    <span className={`badge badge-sm ${getDifficultyBadgeClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="text-base-content/60 text-sm">{problem.category}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/problem/${problem._id}`}
                        className="btn btn-ghost btn-xs tooltip"
                        data-tip="View"
                      >
                        <EyeIcon className="size-4" />
                      </Link>
                      <Link
                        to={`/admin/problems/edit/${problem._id}`}
                        className="btn btn-ghost btn-xs tooltip"
                        data-tip="Edit"
                      >
                        <EditIcon className="size-4" />
                      </Link>
                      <button
                        className="btn btn-ghost btn-xs text-error tooltip"
                        data-tip="Delete"
                        onClick={() => setDeleteModal({ open: true, problem })}
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="btn btn-sm btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <span className="text-sm text-base-content/60">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="btn btn-sm btn-ghost"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        title={deleteModal.problem?.title}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteModal({ open: false, problem: null })}
        onConfirm={() => deleteMutation.mutate(deleteModal.problem._id)}
      />
    </div>
  );
}

export default AdminProblemsPage;
