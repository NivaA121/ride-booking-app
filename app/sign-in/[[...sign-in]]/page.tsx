import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-dark-900 overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-pink/10 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Clerk widget wrapper */}
      <div className="relative z-10 animate-fade-in">
        <SignIn />
      </div>
    </div>
  );
}
