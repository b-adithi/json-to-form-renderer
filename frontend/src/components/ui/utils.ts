/**
 * Combines and merges CSS class names using clsx and Tailwind CSS merge utilities.
 *
 * This utility function combines multiple class name inputs using clsx for conditional
 * class application, then merges conflicting Tailwind CSS classes using twMerge to
 * ensure proper class precedence and avoid style conflicts.
 *
 * @param inputs - Variable number of class values that can be strings, objects, arrays, or conditional expressions
 * @returns A string containing the merged and optimized CSS class names
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn('text-red-500', 'bg-blue-100')
 * // Returns: 'text-red-500 bg-blue-100'
 *
 * // Conditional classes
 * cn('base-class', { 'active-class': isActive, 'disabled-class': isDisabled })
 *
 * // Tailwind class merging (conflicting classes are resolved)
 * cn('text-red-500', 'text-blue-500')
 * // Returns: 'text-blue-500' (last class takes precedence)
 * ```
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
