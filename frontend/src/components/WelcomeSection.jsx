import { useAuth } from "../context/AuthContext";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
        <div className="flex items-center justify-between">
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-pulse-glow">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-black text-shimmer">
                Welcome back, {user?.name?.split(" ")[0] || "there"}!
              </h1>
            </div>
            <p className="text-xl text-base-content/60 ml-16">
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center gap-3 text-white font-bold text-lg">
              <ZapIcon className="w-6 h-6" />
              <span>Create Session</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
