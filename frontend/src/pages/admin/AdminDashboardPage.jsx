import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import {
  BookOpenIcon,
  UsersIcon,
  BarChart3Icon,
  TrendingUpIcon,
} from "lucide-react";

function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
  });

  const statCards = [
    {
      label: "Total Problems",
      value: stats?.totalProblems ?? 0,
      icon: BookOpenIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: UsersIcon,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Easy",
      value: stats?.easy ?? 0,
      icon: BarChart3Icon,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Medium",
      value: stats?.medium ?? 0,
      icon: TrendingUpIcon,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Hard",
      value: stats?.hard ?? 0,
      icon: TrendingUpIcon,
      color: "text-error",
      bg: "bg-error/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/60 mt-1">Overview of your coding platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body p-5">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-base-300" />
                  <div className="h-4 w-16 rounded bg-base-300" />
                  <div className="h-8 w-12 rounded bg-base-300" />
                </div>
              ) : (
                <>
                  <div className={`size-10 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                  <p className="text-sm text-base-content/60 mt-2">{label}</p>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg">Quick Actions</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <a href="/admin/problems/add" className="btn btn-primary btn-sm">
              + Add New Problem
            </a>
            <a href="/admin/problems" className="btn btn-ghost btn-sm">
              Manage Problems
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
