import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const tailwindColorClasses: Record<
  string,
  { bg: string; text: string; hover?: string }
> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-600",
    hover: "hover:bg-blue-700",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-600",
    hover: "hover:bg-green-700",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-600",
    hover: "hover:bg-purple-700",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/20",
    text: "text-orange-600",
    hover: "hover:bg-orange-700",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900/20",
    text: "text-indigo-600",
    hover: "hover:bg-indigo-700",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-900/20",
    text: "text-rose-600",
    hover: "hover:bg-rose-700",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-600",
    hover: "hover:bg-red-700",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/20",
    text: "text-pink-600",
    hover: "hover:bg-pink-700",
  },
  slate: {
    bg: "bg-slate-100 dark:bg-slate-900/20",
    text: "text-slate-600",
    hover: "hover:bg-slate-700",
  },
};

export function getTailwindColorClasses(color: string) {
  return tailwindColorClasses[color] ?? tailwindColorClasses.blue;
}
