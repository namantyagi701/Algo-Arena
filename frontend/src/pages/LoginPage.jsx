import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon, Loader2Icon, MailIcon, LockIcon, ArrowRightIcon, ShieldIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("student"); // "student" | "admin"
  const { login } = useAuth();
  const navigate = useNavigate();

  const isAdminMode = loginMode === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await login(email, password);

      if (isAdminMode) {
        if (userData.role !== "admin") {
          toast.error("This account does not have admin access");
          setIsLoading(false);
          return;
        }
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch {
      // error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <span className="font-black text-2xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talent IQ
            </span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-base-content/60 mb-4">Sign in to continue</p>

          {/* Login Mode Toggle */}
          <div className="flex bg-base-200 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMode("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${!isAdminMode
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/60 hover:text-base-content"
                }`}
            >
              <UserIcon className="size-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${isAdminMode
                  ? "bg-error text-error-content shadow-md"
                  : "text-base-content/60 hover:text-base-content"
                }`}
            >
              <ShieldIcon className="size-4" />
              Admin
            </button>
          </div>

          {/* Admin mode indicator */}
          {isAdminMode && (
            <div className="alert alert-warning py-2 mb-2 text-sm">
              <ShieldIcon className="size-4" />
              <span>Admin login — requires administrator credentials</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <MailIcon className="size-4 text-base-content/40" />
                <input
                  type="email"
                  placeholder={isAdminMode ? "admin@talentiq.com" : "you@example.com"}
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
              type="submit"
              className={`btn w-full ${isAdminMode ? "btn-error" : "btn-primary"}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <>
                  {isAdminMode ? "Sign In as Admin" : "Sign In"}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          {!isAdminMode && (
            <>
              <div className="divider">OR</div>

              <p className="text-center text-sm text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link link-primary font-semibold">
                  Create one
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
