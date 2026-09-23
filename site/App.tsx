import { useState } from "react";
import { ImageMorph } from "react-image-morph";

// Real-world-flavored image pairs (royalty-free via Picsum, seeded for stable URLs)
const PAIRS = {
  scroll: {
    from: "https://picsum.photos/seed/scroll-old/1600/1000",
    to: "https://picsum.photos/seed/scroll-new/1600/1000",
    label: "Renovation reveal",
    fromAlt: "Old kitchen, dark cabinets",
    toAlt: "New kitchen, white marble and brass",
  },
  hover: {
    from: "https://picsum.photos/seed/hover-front/1200/1200",
    to: "https://picsum.photos/seed/hover-detail/1200/1200",
    label: "Product hover",
    fromAlt: "Sneaker, three-quarter view",
    toAlt: "Sneaker, side profile detail",
  },
  drive: {
    from: "https://picsum.photos/seed/landscape-day/1600/900",
    to: "https://picsum.photos/seed/landscape-night/1600/900",
    label: "Day → night",
    fromAlt: "Mountain valley at golden hour",
    toAlt: "Same valley under starlight",
  },
};

function CopyBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderTop: "1px solid var(--border)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          borderRadius: "8px 8px 0 0",
          background: "var(--surface)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-faint)",
        }}
      >
        <span>{label}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            });
          }}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: copied ? "var(--accent)" : "var(--fg-dim)",
            padding: "4px 10px",
            borderRadius: 4,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "color 200ms var(--ease-out), border-color 200ms var(--ease-out)",
          }}
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: 18,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "0 0 8px 8px",
          overflowX: "auto",
          color: "var(--fg-dim)",
          lineHeight: 1.6,
          fontSize: 13,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Demo({
  mode,
  pair,
  aspectRatio,
  code,
  showDrive = false,
}: {
  mode: "scroll" | "hover";
  pair: typeof PAIRS.scroll;
  aspectRatio: string;
  code: string;
  showDrive?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  return (
    <section style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          mode = "{mode}"
        </span>
        <span style={{ fontSize: 13, color: "var(--fg-faint)" }}>
          {pair.label}
        </span>
      </header>

      <ImageMorph
        from={pair.from}
        to={pair.to}
        mode={mode}
        fromAlt={pair.fromAlt}
        toAlt={pair.toAlt}
        onProgress={setProgress}
        style={{
          aspectRatio,
          borderRadius: 12,
          cursor: mode === "hover" ? "ew-resize" : undefined,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
        }}
      />

      {showDrive && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ color: "var(--fg-faint)" }}>progress:</span>
          <div
            style={{
              flex: 1,
              height: 4,
              background: "var(--border)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                background: "var(--accent)",
                transition: "width 80ms var(--ease-out)",
              }}
            />
          </div>
          <span style={{ color: "var(--accent)", minWidth: 48, textAlign: "right" }}>
            {(progress * 100).toFixed(0)}%
          </span>
        </div>
      )}

      <CopyBlock label={`example · ${mode}`} code={code} />
    </section>
  );
}

export default function App() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          padding: "140px 24px 100px",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            margin: "0 0 20px",
          }}
        >
          react-image-morph
        </p>
        <h1
          style={{
            fontSize: "clamp(44px, 7vw, 88px)",
            lineHeight: 1.02,
            fontWeight: 400,
            margin: "0 0 32px",
            letterSpacing: "-0.025em",
            color: "var(--fg)",
          }}
        >
          Two images.
          <br />
          One element.
          <br />
          <span style={{ color: "var(--fg-faint)" }}>Zero deps.</span>
        </h1>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            color: "var(--fg-dim)",
            maxWidth: 620,
          }}
        >
          A drop-in React component for crossfading two images — on scroll, on
          hover, or anywhere you can drive a number between 0 and 1. Pure CSS
          blending. GPU-composited. ~2.7 KB.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
          <a
            href="https://github.com/Luxusmoberg/react-image-morph"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 22px",
              background: "var(--fg)",
              color: "var(--bg)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.01em",
              transition: "transform 200ms var(--ease-out)",
            }}
          >
            Install on npm →
          </a>
          <a
            href="#demos"
            style={{
              padding: "12px 22px",
              border: "1px solid var(--border)",
              color: "var(--fg)",
              borderRadius: 8,
              fontSize: 14,
              transition: "border-color 200ms var(--ease-out)",
            }}
          >
            See it work
          </a>
        </div>
      </section>

      {/* First scroll demo — big and dramatic */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <ImageMorph
          from={PAIRS.drive.from}
          to={PAIRS.drive.to}
          mode="scroll"
          fromAlt={PAIRS.drive.fromAlt}
          toAlt={PAIRS.drive.toAlt}
          style={{
            aspectRatio: "16 / 9",
            borderRadius: 12,
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)",
          }}
        />
        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "var(--fg-faint)",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          scroll to morph · the entire element is the scroll progress driver
        </p>
      </section>

      {/* Demos */}
      <div id="demos">
        <Demo
          mode="scroll"
          pair={PAIRS.scroll}
          aspectRatio="16 / 10"
          showDrive
          code={`import { ImageMorph } from "react-image-morph";

<ImageMorph
  from="/kitchen-old.jpg"
  to="/kitchen-new.jpg"
  mode="scroll"
  onProgress={(p) => console.log(p)}
  style={{ aspectRatio: "16 / 10", borderRadius: 12 }}
/>`}
        />

        <Demo
          mode="hover"
          pair={PAIRS.hover}
          aspectRatio="1 / 1"
          code={`import { ImageMorph } from "react-image-morph";

<ImageMorph
  from="/shoe-front.jpg"
  to="/shoe-detail.jpg"
  mode="hover"
  style={{ aspectRatio: "1 / 1", cursor: "ew-resize" }}
/>`}
        />
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "80px 24px 60px",
          maxWidth: 880,
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
          marginTop: 80,
          color: "var(--fg-faint)",
          fontSize: 13,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span>
          react-image-morph · MIT · built by{" "}
          <a
            href="https://github.com/Luxusmoberg"
            style={{ color: "var(--fg-dim)" }}
          >
            Lucas Poulsen
          </a>
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
          2.7 KB · 0 deps · 1 prop
        </span>
      </footer>
    </main>
  );
}