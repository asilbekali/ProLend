import { ImageResponse } from "next/og";

export const alt = "TH-LABS — AI dubbing for natural multilingual voice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Press Start 2P isn't loaded here (Satori would need the font binary), so the
// OG wordmark uses a heavy monospaced system stack that still reads as the
// technical/brand voice on a near-black field with a single violet accent.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050607",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
          }}
        >
          / AI DUBBING SYSTEM
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#ffffff",
            }}
          >
            TH-LABS
            <div
              style={{
                width: 26,
                height: 26,
                marginLeft: 24,
                marginBottom: 8,
                borderRadius: 999,
                background: "#8b5cf6",
                display: "flex",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "rgba(255,255,255,0.62)" }}>
            Natural multilingual voice conversion — 40+ languages, in real time.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>Voice clone</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <span>Lip sync</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <span>~2s latency</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
