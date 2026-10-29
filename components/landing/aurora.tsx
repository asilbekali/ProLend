/**
 * The light behind the whole page: three soft pools of colour drifting on
 * black. Plain radial gradients (no blur filter), so phones paint it cheaply.
 */
export default function Aurora() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="animate-aurora-a absolute -left-[20vw] top-[10vh] h-[80vh] w-[80vw] opacity-55"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,150,30,0.55), rgba(255,110,20,0.22) 45%, transparent 75%)",
        }}
      />
      <div
        className="animate-aurora-b absolute -right-[25vw] top-[35vh] h-[90vh] w-[75vw] opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,196,40,0.45), rgba(255,140,20,0.16) 50%, transparent 78%)",
        }}
      />
      <div
        className="animate-aurora-a absolute -bottom-[30vh] left-[10vw] h-[70vh] w-[70vw] opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(25,195,125,0.4), rgba(25,195,125,0.12) 50%, transparent 78%)",
          animationDelay: "-9s",
        }}
      />
      {/* Darken the middle so text always sits on near-black. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(0,0,0,0.7), transparent)" }}
      />
    </div>
  );
}
