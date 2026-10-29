import { ImageResponse } from "next/og";

export const alt = "IELTS Spelling Practice: hear a word, type it, get instant feedback";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const letters = ["a", "c", "c", "o", "m", "m", "o", "d", "a", "t", "i", "o", "n"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: "#F8FAFC",
          color: "#0F172A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#4F46E5",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            Aa
          </div>
          <div style={{ fontSize: 32, color: "#64748B" }}>IELTS Spelling Practice</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 40, lineHeight: 1.1, letterSpacing: -2 }}>
          Stop losing Listening marks to spelling.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 48 }}>
          {letters.map((l, i) => (
            <div
              key={i}
              style={{
                width: 60,
                height: 72,
                borderRadius: 14,
                border: "2px solid #E2E8F0",
                background: i === 2 || i === 5 ? "#FEE2E2" : "#FFFFFF",
                color: i === 2 || i === 5 ? "#DC2626" : "#0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 600,
              }}
            >
              {l}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 28, color: "#64748B", marginTop: 40 }}>
          Hear it in a UK, US or Australian accent. Type it. Get instant feedback.
        </div>
      </div>
    ),
    size,
  );
}
