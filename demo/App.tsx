import { ImageMorph } from "../src";

const A = "https://picsum.photos/seed/morph-a/1600/1000";
const B = "https://picsum.photos/seed/morph-b/1600/1000";

export default function App() {
  return (
    <main
      style={{
        margin: 0,
        background: "#0c0c0a",
        color: "#e8e4da",
        fontFamily:
          "'Inter Tight', system-ui, -apple-system, 'Helvetica Neue', sans-serif",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          padding: "120px 24px 80px",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c86e46",
            margin: "0 0 16px",
          }}
        >
          react-image-morph
        </p>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.05,
            fontWeight: 400,
            margin: "0 0 24px",
            letterSpacing: "-0.02em",
          }}
        >
          Two images.
          <br />
          One element.
          <br />
          Zero deps.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#b6b0a3" }}>
          Drop in two URLs. Crossfade them on scroll, on hover, or anywhere in
          between. Pure CSS blending — the browser does the work.
        </p>
      </header>

      <section
        style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c86e46",
            margin: "0 0 24px",
          }}
        >
          mode = "scroll"
        </p>
        <ImageMorph
          from={A}
          to={B}
          mode="scroll"
          fromAlt="Old kitchen"
          toAlt="New kitchen"
          style={{
            aspectRatio: "16 / 10",
            borderRadius: 12,
          }}
        />
      </section>

      <section
        style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c86e46",
            margin: "0 0 24px",
          }}
        >
          mode = "hover"
        </p>
        <ImageMorph
          from={B}
          to={A}
          mode="hover"
          fromAlt="Product"
          toAlt="Product detail"
          style={{
            aspectRatio: "16 / 10",
            borderRadius: 12,
            cursor: "ew-resize",
          }}
        />
      </section>

      <section
        style={{
          padding: "120px 24px 160px",
          maxWidth: 720,
          margin: "0 auto",
          fontSize: 14,
          color: "#6b6760",
          lineHeight: 1.6,
        }}
      >
        <pre
          style={{
            background: "#161613",
            border: "1px solid #2a2a26",
            borderRadius: 8,
            padding: 20,
            overflowX: "auto",
            fontSize: 13,
          }}
        >{`import { ImageMorph } from "react-image-morph";

<ImageMorph
  from="/before.jpg"
  to="/after.jpg"
  mode="scroll"        // or "hover"
  style={{ aspectRatio: "16/10" }}
/>`}</pre>
      </section>
    </main>
  );
}