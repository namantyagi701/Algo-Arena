import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon, Loader2Icon, MailIcon, LockIcon, UserIcon, ArrowRightIcon } from "lucide-react";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch {
      // error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4 relative noise-bg">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-secondary/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="card w-full max-w-md bg-base-100/90 backdrop-blur-sm shadow-2xl border border-base-content/5 animate-slide-up relative z-10">
        <div className="card-body">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <span className="font-black text-2xl text-shimmer font-mono tracking-wider">
              Algo Arena
            </span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center text-base-content/60 mb-6">Join the coding community</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <UserIcon className="size-4 text-base-content/40" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="grow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <MailIcon className="size-4 text-base-content/40" />
                <input
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
                  type="password"
                  placeholder="••••••••"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
              <label className="label">
                <span className="label-text-alt text-base-content/50">Minimum 6 characters</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
