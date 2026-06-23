import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  SparklesIcon,
  Loader2Icon,
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  BookOpenIcon,
  Code2Icon,
  ZapIcon,
} from "lucide-react";
import toast from "react-hot-toast";

function StudentLoginPage() {
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
      if (userData.role === "admin") {
        toast.error("Please use the admin login page");
        setIsLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch {
      // error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex relative noise-bg">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 size-72 rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 size-96 rounded-full bg-white/8 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-white/10 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="flex flex-col justify-center px-16 relative z-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <SparklesIcon className="size-8 text-white" />
            </div>
            <span className="font-black text-3xl text-white font-mono tracking-wider">
              Algo Arena
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Sharpen Your Skills,
            <br />
            <span className="text-white/80">Ace Every Interview</span>
          </h1>

          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
            Practice coding problems, collaborate in real-time, and prepare for
            your dream tech role.
          </p>

          <div className="space-y-4 stagger-children">
            <div className="flex items-center gap-4 group">
              <div className="size-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                <Code2Icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Live Code Editor</p>
                <p className="text-white/60 text-sm">
                  Multi-language support with syntax highlighting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="size-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                <BookOpenIcon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Curated Problems</p>
                <p className="text-white/60 text-sm">
                  Handpicked challenges from top companies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="size-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                <ZapIcon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Instant Feedback</p>
                <p className="text-white/60 text-sm">
                  Run your code and get results in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.15s' }}>
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <span className="font-black text-2xl text-shimmer font-mono tracking-wider">
              Algo Arena
            </span>
          </div>

          <div className="card bg-base-100/90 backdrop-blur-sm shadow-2xl border border-base-content/5">
            <div className="card-body p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                  <BookOpenIcon className="size-4" />
                  Student Portal
                </div>
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-base-content/60 mt-1">
                  Sign in to continue practicing
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <MailIcon className="size-4 text-base-content/40" />
                    <input
                      id="student-email"
                      type="email"
                      placeholder="you@example.com"
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
                      id="student-password"
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
                  id="student-login-btn"
                  type="submit"
                  className="btn btn-primary w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="size-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="divider">OR</div>

              <p className="text-center text-sm text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="link link-primary font-semibold"
                >
                  Create one
                </Link>
              </p>

              <p className="text-center text-xs text-base-content/40 mt-3">
                Are you an administrator?{" "}
                <Link
                  to="/admin/login"
                  className="link link-secondary font-semibold"
                >
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLoginPage;
