# react-image-morph

> Two images. One element. Zero deps.

Drop in two image URLs, get a buttery crossfade — on scroll, on hover, or anywhere in between. Pure CSS blending, GPU-composited, ~2.7 KB.

**👉 [Live demo: luxusmoberg.github.io/react-image-morph](https://luxusmoberg.github.io/react-image-morph/)**

```tsx
import { ImageMorph } from "react-image-morph";

<ImageMorph
  from="/before.jpg"
  to="/after.jpg"
  mode="scroll"        // or "hover"
  style={{ aspectRatio: "16 / 10", borderRadius: 12 }}
/>
```

## Why

Every "before/after" slider on the web is either:

- A 50 KB library that pulls in `gsap`, `framer-motion`, or both
- A custom `<input type="range">` hack with a clipped overlay
- A canvas-based mess that breaks on retina and chokes on big images

This is one component, ~100 lines, no dependencies. The browser does the compositing — you just toggle opacity on a stacked image.

## Install

```bash
npm install react-image-morph
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `from` | `string` | — | Image URL for the base layer (opacity 1) |
| `to` | `string` | — | Image URL for the top layer (opacity = progress) |
| `mode` | `"scroll" \| "hover"` | `"scroll"` | What drives the crossfade |
| `fromAlt` | `string` | `"before"` | Alt text for the base image |
| `toAlt` | `string` | `"after"` | Alt text for the top image |
| `easing` | `string` | `"cubic-bezier(0.23, 1, 0.32, 1)"` | CSS easing for the opacity transition |
| `objectFit` | `CSSProperties["objectFit"]` | `"cover"` | Applied to both images |
| `hoverSensitivity` | `number` | `1` | Multiplier on horizontal travel → progress (hover mode) |
| `onProgress` | `(p: number) => void` | — | Fires with `[0, 1]` on every frame |
| `className` | `string` | — | Applied to the wrapper |
| `style` | `CSSProperties` | — | Applied to the wrapper |
| `children` | `ReactNode` | — | Rendered above the images (captions, badges) |

## How it works

Both images render absolutely positioned in the same stacking context. The top image's `opacity` is bound to a `[0, 1]` progress value:

- **`mode="scroll"`** — `IntersectionObserver` + a single `scroll` listener (rAF-throttled). Progress = `0` when the wrapper's bottom edge enters the viewport, `1` when the top edge leaves it.
- **`mode="hover"`** — `pointermove` on the wrapper. Progress = cursor X / wrapper width.

A 80ms CSS transition smooths the jumps. `will-change: opacity` keeps it on the compositor thread.

No `requestAnimationFrame` loop, no canvas, no IntersectionObserver polling, no libraries.

## Examples

### Before / after reveal on scroll

```tsx
<ImageMorph
  from="/kitchen-old.jpg"
  to="/kitchen-new.jpg"
  mode="scroll"
  style={{ aspectRatio: "16 / 10", borderRadius: 12 }}
/>
```

### Product hover preview

```tsx
<ImageMorph
  from="/product-front.jpg"
  to="/product-detail.jpg"
  mode="hover"
  style={{ aspectRatio: "1 / 1", cursor: "ew-resize" }}
/>
```

### Drive anything with progress

```tsx
<ImageMorph
  from={a}
  to={b}
  mode="scroll"
  onProgress={(p) => {
    setCaption(`Reveal at ${Math.round(p * 100)}%`);
  }}
/>
```

## Why CSS, not canvas

Compositor-thread opacity is *free* on every device shipped in the last decade. A canvas redraw on every pointer move, on a 4K image, costs you 4-8ms per frame in JS — and you still have to composite the result. Stacking two images and animating one CSS property is what the browser is *built for*.

## License

MIT © Lucas Poulsen

## Links

- [Live demo](https://luxusmoberg.github.io/react-image-morph/)
- [GitHub repo](https://github.com/Luxusmoberg/react-image-morph)
- [npm package](https://www.npmjs.com/package/react-image-morph) *(publish after first star or PR — open an issue if you want it now)*