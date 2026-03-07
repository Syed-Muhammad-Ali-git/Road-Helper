export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl animate-pulse"
        style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
      >
        🚗
      </div>
      <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      <p className="text-sm font-medium text-[var(--muted)]">Loading...</p>
    </div>
  );
}
