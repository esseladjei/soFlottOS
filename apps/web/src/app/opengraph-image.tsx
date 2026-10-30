import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top left, rgba(34,211,238,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(129,140,248,0.28), transparent 28%), #020617",
          color: "white",
          padding: 72,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 84,
              height: 84,
              borderRadius: 24,
              background:
                "linear-gradient(135deg, rgba(34,211,238,1), rgba(59,130,246,1), rgba(99,102,241,1))",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              color: "#020617",
            }}
          >
            soFlott
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, color: "#a5f3fc", letterSpacing: 6 }}>
              NEXT.JS + ASP.NET
            </span>
            <span style={{ fontSize: 56, fontWeight: 700 }}>{siteConfig.name}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 74, lineHeight: 1.05, fontWeight: 700, maxWidth: 960 }}>
            Regional B2B courier service.
          </div>
          <div style={{ fontSize: 28, color: "#cbd5e1", maxWidth: 980, lineHeight: 1.5 }}>
            Direct deliveries around Augsburg, Mering and Munich, with digital proof of delivery
            and transparent invoicing.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
