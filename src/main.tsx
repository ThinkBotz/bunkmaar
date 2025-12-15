import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// SW is auto-managed via PwaBanner using useRegisterSW

// Disable pinch-zoom and double-tap zoom in installed PWA contexts
// while keeping regular scroll and interactions.
(() => {
	if (typeof window === 'undefined') return;
	// prevent multi-touch (pinch) zoom
	window.addEventListener(
		'touchstart',
		(e) => {
			if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 1) {
				e.preventDefault();
			}
		},
		{ passive: false }
	);
	// prevent ctrl+wheel zoom (desktop or Chrome on some devices)
	window.addEventListener(
		'wheel',
		(e) => {
			if ((e as WheelEvent).ctrlKey) e.preventDefault();
		},
		{ passive: false }
	);
	// prevent double-tap to zoom
	let lastTouch = 0;
	window.addEventListener(
		'touchend',
		(e) => {
			const now = Date.now();
			if (now - lastTouch <= 300) {
				e.preventDefault();
			}
			lastTouch = now;
		},
		{ passive: false }
	);
})();

createRoot(document.getElementById("root")!).render(<App />);
