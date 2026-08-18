import { Variants } from "framer-motion";
import { MotionPreset } from "./types/story";

export const characterMotionVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 15 },
  idle: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  "enter-left": {
    opacity: 1,
    x: [-60, 0],
    scale: [0.95, 1],
    transition: { duration: 0.45, ease: "easeOut" },
  },
  "enter-right": {
    opacity: 1,
    x: [60, 0],
    scale: [0.95, 1],
    transition: { duration: 0.45, ease: "easeOut" },
  },
  "exit-left": {
    opacity: [1, 0],
    x: [0, -60],
    transition: { duration: 0.35, ease: "easeIn" },
  },
  "exit-right": {
    opacity: [1, 0],
    x: [0, 60],
    transition: { duration: 0.35, ease: "easeIn" },
  },
  "fade-in": {
    opacity: [0, 1],
    scale: [0.98, 1],
    transition: { duration: 0.4, ease: "easeOut" },
  },
  "fade-out": {
    opacity: [1, 0],
    transition: { duration: 0.3, ease: "easeIn" },
  },
  shake: {
    opacity: 1,
    x: [0, -12, 12, -8, 8, -4, 4, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  "small-shake": {
    opacity: 1,
    x: [0, -5, 5, -3, 3, 0],
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  bounce: {
    opacity: 1,
    y: [0, -18, 0, -8, 0],
    transition: { duration: 0.45, ease: "easeOut" },
  },
  pulse: {
    opacity: 1,
    scale: [1, 1.05, 0.98, 1],
    y: [0, -4, 0],
    transition: { duration: 0.45, ease: "easeInOut" },
  },
  "zoom-in": {
    scale: [0.85, 1.05, 1],
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  "zoom-out": {
    scale: [1.1, 0.98, 1],
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const screenOverlayVariants: Variants = {
  none: { opacity: 0 },
  flash: {
    opacity: [0, 0.9, 0],
    backgroundColor: "#ffffff",
    transition: { duration: 0.35, ease: "easeOut" },
  },
  shake: {
    x: [0, -10, 10, -6, 6, 0],
    y: [0, 6, -6, 3, -3, 0],
    transition: { duration: 0.45 },
  },
  "slow-background-zoom": {
    scale: [1, 1.08],
    transition: { duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" },
  },
};

export function getMotionVariant(preset?: MotionPreset) {
  if (!preset || preset === "none") return "idle";
  return preset;
}
