import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, LogOutIcon, SparklesIcon, ShieldIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl text-shimmer font-mono tracking-wider">
              Algo Arena
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {/* ADMIN LINK (admin only) */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 
                ${
                  location.pathname.startsWith("/admin")
                    ? "bg-primary text-primary-content shadow-md"
                    : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }
              `}
            >
              <div className="flex items-center gap-x-2.5">
                <ShieldIcon className="size-4" />
                <span className="font-medium hidden sm:inline">Admin</span>
              </div>
            </Link>
          )}

          {/* User avatar + logout dropdown */}
          <div className="dropdown dropdown-end ml-4">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-shadow duration-300 hover:shadow-[0_0_16px_oklch(var(--p)/0.3)]">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center w-full h-full text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
            >
              <li className="menu-title">
                <span className="text-base-content font-semibold">{user?.name}</span>
              </li>
              <li className="menu-title">
                <span className="text-base-content/50 text-xs">{user?.email}</span>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button onClick={logout} className="text-error">
                  <LogOutIcon className="size-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
