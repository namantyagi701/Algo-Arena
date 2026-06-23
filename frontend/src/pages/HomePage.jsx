import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300 relative noise-bg">
      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl text-shimmer font-mono tracking-wider">
                Algo Arena
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <Link to="/login">
            <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        {/* Background glow orbs */}
        <div className="absolute -top-20 -left-40 w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 -right-20 w-64 h-64 bg-secondary/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-slide-up">
            <div className="badge badge-primary badge-lg animate-subtle-bounce">
              <ZapIcon className="size-4" />
              Let's Code
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-shimmer">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>

            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              Connect face-to-face, code in real-time, and ace your technical interviews.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3 stagger-children">
              <div className="badge badge-lg badge-outline hover-glow">
                <CheckIcon className="size-4 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-lg badge-outline hover-glow">
                <CheckIcon className="size-4 text-success" />
                Code Editor
              </div>
              <div className="badge badge-lg badge-outline hover-glow">
                <CheckIcon className="size-4 text-success" />
                Multi-Language
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <button className="btn btn-primary btn-lg group">
                  Start Coding Now
                  <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <button className="btn btn-outline btn-lg hover-glow">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-content/5">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">50K+</div>
                <div className="stat-title">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-[2rem] blur-2xl animate-gradient-shift" />
              <img
                src="/hero.png"
                alt="Algo Arena Platform"
                className="relative w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-shimmer font-mono">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {/* Feature 1 */}
          <div className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover-glow border border-base-content/5">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 animate-float">
                <VideoIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content/70">
                Crystal clear video and audio for seamless communication during interviews
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover-glow border border-base-content/5">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content/70">
                Collaborate in real-time with syntax highlighting and multiple language support
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover-glow border border-base-content/5">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '1s' }}>
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-base-content/70">
                Share your screen, discuss solutions, and learn from each other in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER GLOW */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
export default HomePage;
