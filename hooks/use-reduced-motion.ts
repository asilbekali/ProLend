"use client";

// Single import path for the reduced-motion preference across the app. Wraps
// motion's implementation (which returns `true` when the user asks for reduced
// motion, `null` before hydration) so components can gate scroll/parallax/tilt.
export { useReducedMotion } from "motion/react";
