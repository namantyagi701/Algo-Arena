import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpenIcon,
  PlusCircleIcon,
  LogOutIcon,
  SparklesIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/admin", icon: BookOpenIcon, label: "All Problems", end: true },
  { to: "/admin/problems/add", icon: PlusCircleIcon, label: "Add Problem" },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-base-300">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <SparklesIcon className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talent IQ
            </span>
            <span className="text-xs text-base-content/50 font-medium -mt-1">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end, disabled }) => (
          <Link
            key={to}
            to={disabled ? "#" : to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
              ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
              ${
                isActive(to, end)
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
            `}
          >
            <Icon className="size-5" />
            {label}
            {disabled && (
              <span className="ml-auto text-xs badge badge-ghost badge-sm">Soon</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn btn-ghost btn-sm w-full justify-start gap-2 text-error hover:bg-error/10"
        >
          <LogOutIcon className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-base-100 border-r border-base-300 flex-col fixed h-screen">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-base-100 shadow-xl">
            <button
              className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40 bg-base-100 border-b border-base-300 px-4 py-3 flex items-center gap-3">
          <button
            className="btn btn-ghost btn-sm btn-square"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="size-5" />
          </button>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
