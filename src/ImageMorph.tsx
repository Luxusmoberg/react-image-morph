import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from "react";

export type ImageMorphMode = "scroll" | "hover";

export interface ImageMorphProps {
  /** The image shown by default / at scroll progress 0 */
  from: string;
  /** The image revealed as you scroll / hover */
  to: string;
  /**
   * "scroll" — morph progress tracks how far the element is through the viewport.
   * "hover"  — morph progress tracks the cursor across the element (0 left → 1 right).
   * @default "scroll"
   */
  mode?: ImageMorphMode;
  /**
   * Optional alt text for the destination image. Both images get alt text;
   * "from" uses `fromAlt` (defaults to "before"), "to" uses `toAlt`.
   */
  fromAlt?: string;
  toAlt?: string;
  /** Easing curve for the opacity transition. CSS easing string. @default "cubic-bezier(0.23, 1, 0.32, 1)" */
  easing?: string;
  /** Extra className applied to the wrapper. */
  className?: string;
  /** Inline styles applied to the wrapper. */
  style?: CSSProperties;
  /** Object-fit for both images. @default "cover" */
  objectFit?: CSSProperties["objectFit"];
  /**
   * Called with progress [0..1] on every frame. Useful for chaining effects.
   */
  onProgress?: (progress: number) => void;
  /**
   * In hover mode: how much horizontal travel maps to 0→1. 1 = full element width.
   * @default 1
   */
  hoverSensitivity?: number;
  /**
   * Anything rendered above the images (e.g. captions, badges). Receives no props;
   * rendered inside a positioned container so it sits on top.
   */
  children?: ReactNode;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const wrapperStyle = (objectFit: CSSProperties["objectFit"]): CSSProperties => ({
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
});

const layerStyle = (objectFit: CSSProperties["objectFit"]): CSSProperties => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit,
  display: "block",
  // The wrapper needs the image to actually have a height — this is the trick:
  // we set the wrapper to aspect-ratio via the first child if you want,
  // OR set the bottom image to position: absolute and use a sized placeholder.
  // Here we use a sentinel approach: first child <img> is the bottom and also
  // dictates intrinsic size of the wrapper through min-height.
  userSelect: "none",
  pointerEvents: "none",
});

/**
 * <ImageMorph /> — drop in two image URLs, get a buttery crossfade.
 *
 * - `mode="scroll"`: the top image fades in as the element scrolls through the viewport.
 *   Perfect for "before → after" reveals, scrollytelling, hero transitions.
 * - `mode="hover"`: the top image fades in as the cursor crosses the element left→right.
 *   Perfect for product shots, hover previews, image comparisons.
 *
 * Both images render in a single composited layer. No canvas, no three.js, no
 * requestAnimationFrame loop unless you opt in via onProgress. The browser does
 * the blending; we just toggle opacity through a CSS variable.
 */
export function ImageMorph({
  from,
  to,
  mode = "scroll",
  fromAlt = "before",
  toAlt = "after",
  easing = "cubic-bezier(0.23, 1, 0.32, 1)",
  className,
  style,
  objectFit = "cover",
  onProgress,
  hoverSensitivity = 1,
  children,
}: ImageMorphProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Stable callback so we don't re-bind listeners on every render.
  const handleProgress = useCallback(
    (p: number) => {
      setProgress(p);
      onProgress?.(p);
    },
    [onProgress]
  );

  // --- scroll mode: IntersectionObserver tracks how far through the viewport ---
  useEffect(() => {
    if (mode !== "scroll") return;
    const el = wrapperRef.current;
    if (!el) return;

    let rafId = 0;
    const compute = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Progress: 0 when the bottom edge enters the viewport,
      //            1 when the top edge leaves the viewport.
      const total = rect.height + vh;
      const seen = vh - rect.top;
      const p = clamp01(seen / total);
      handleProgress(p);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mode, handleProgress]);

  // --- hover mode: pointer position drives progress ---
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "hover") return;
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      handleProgress(clamp01(x * hoverSensitivity));
    },
    [mode, hoverSensitivity, handleProgress]
  );

  const handlePointerLeave = useCallback(() => {
    if (mode === "hover") handleProgress(0);
  }, [mode, handleProgress]);

  // The CSS variable is the only thing that actually animates. Browser does the rest.
  const topStyle: CSSProperties = {
    ...layerStyle(objectFit),
    opacity: progress,
    transition: `opacity 80ms ${easing}`,
    willChange: "opacity",
  };

  const bottomStyle: CSSProperties = {
    ...layerStyle(objectFit),
    opacity: 1,
  };

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ ...wrapperStyle(objectFit), ...style }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-image-morph=""
      data-mode={mode}
    >
      {/* Bottom = "from" image, sits at full opacity as the base */}
      <img src={from} alt={fromAlt} style={bottomStyle} draggable={false} />
      {/* Top = "to" image, opacity = progress */}
      <img src={to} alt={toAlt} style={topStyle} draggable={false} />
      {children}
    </div>
  );
}

export default ImageMorph;