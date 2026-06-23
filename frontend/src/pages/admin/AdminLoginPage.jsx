import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  SparklesIcon,
  Loader2Icon,
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  ShieldIcon,
  ServerIcon,
  BarChart3Icon,
  SettingsIcon,
} from "lucide-react";
import toast from "react-hot-toast";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role !== "admin") {
        toast.error("This account does not have admin access");
        setIsLoading(false);
        return;
      }
      navigate("/admin");
    } catch {
      // error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-neutral to-base-300 flex relative">
      {/* Left Panel — Admin Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-neutral-900">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Glow accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-error/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-warning/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-error/8 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }} />


        <div className="flex flex-col justify-center px-16 relative z-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-14 rounded-2xl bg-error/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-error/30">
              <ShieldIcon className="size-8 text-error" />
            </div>
            <div>
              <span className="font-black text-3xl text-white font-mono tracking-wider block">
                Algo Arena
              </span>
              <span className="text-error/80 text-xs font-semibold tracking-widest uppercase">
                Admin Console
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Command Center
            <br />
            <span className="text-white/50">Full Platform Control</span>
          </h1>

          <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-md">
            Manage problems, monitor users, and control every aspect of the
            Algo Arena platform.
          </p>

          <div className="space-y-4 stagger-children">
            <div className="flex items-center gap-4 group">
              <div className="size-11 rounded-xl bg-error/15 flex items-center justify-center border border-error/20 group-hover:bg-error/25 transition-colors duration-300">
                <ServerIcon className="size-5 text-error" />
              </div>
              <div>
                <p className="text-white font-semibold">Problem Management</p>
                <p className="text-white/40 text-sm">
                  Create, edit, and manage coding challenges
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="size-11 rounded-xl bg-error/15 flex items-center justify-center border border-error/20 group-hover:bg-error/25 transition-colors duration-300">
                <BarChart3Icon className="size-5 text-error" />
              </div>
              <div>
                <p className="text-white font-semibold">Analytics Dashboard</p>
                <p className="text-white/40 text-sm">
                  Track user performance and platform metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="size-11 rounded-xl bg-error/15 flex items-center justify-center border border-error/20 group-hover:bg-error/25 transition-colors duration-300">
                <SettingsIcon className="size-5 text-error" />
              </div>
              <div>
                <p className="text-white font-semibold">Platform Settings</p>
                <p className="text-white/40 text-sm">
                  Configure and fine-tune the platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Admin Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.15s' }}>
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="size-10 rounded-xl bg-gradient-to-br from-error to-warning flex items-center justify-center shadow-lg">
              <ShieldIcon className="size-6 text-white" />
            </div>
            <div className="text-center">
              <span className="font-black text-2xl bg-gradient-to-r from-error to-warning bg-clip-text text-transparent font-mono tracking-wider block">
                Algo Arena
              </span>
              <span className="text-error/70 text-xs font-semibold tracking-widest uppercase">
                Admin
              </span>
            </div>
          </div>

          <div className="card bg-base-100/90 backdrop-blur-sm shadow-2xl border border-error/15">
            <div className="card-body p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-error/10 text-error rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                  <ShieldIcon className="size-4" />
                  Administrator Access
                </div>
                <h2 className="text-2xl font-bold">Admin Login</h2>
                <p className="text-base-content/60 mt-1">
                  Restricted to authorized personnel only
                </p>
              </div>

              {/* Security notice */}
              <div className="alert alert-warning py-3 mb-4 text-sm">
                <ShieldIcon className="size-4 shrink-0" />
                <span>
                  This area is restricted. All login attempts are logged.
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Admin Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <MailIcon className="size-4 text-base-content/40" />
                    <input
                      id="admin-email"
                      type="email"
                      placeholder="admin@algoarena.com"
                      className="grow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LockIcon className="size-4 text-base-content/40" />
                    <input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      className="grow"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <button
                  id="admin-login-btn"
                  type="submit"
                  className="btn btn-error w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    <>
                      <ShieldIcon className="size-4" />
                      Sign In as Admin
                      <ArrowRightIcon className="size-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-base-content/40 mt-6">
                Not an administrator?{" "}
                <Link
                  to="/login"
                  className="link link-primary font-semibold"
                >
                  Student Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
