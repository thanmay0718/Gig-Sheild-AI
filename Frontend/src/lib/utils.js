import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";       // ADDED: prevents Tailwind conflicts
                                                 // e.g. cn("px-2", "px-4") → "px-4"
                                                 // without twMerge it would be "px-2 px-4"

export function cn(...classes) {
  return twMerge(clsx(classes));                 // CHANGED: was classes.filter(Boolean).join(" ")
                                                 // clsx handles conditionals/arrays
                                                 // twMerge resolves Tailwind conflicts
}