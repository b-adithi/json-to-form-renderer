import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * A React hook that detects whether the current viewport is in mobile size.
 *
 * This hook uses the `matchMedia` API to listen for viewport changes and determines
 * if the current screen width is below the mobile breakpoint. It returns a boolean
 * value indicating the mobile state and automatically updates when the viewport size changes.
 *
 * @returns {boolean} `true` if the current viewport width is below the mobile breakpoint, `false` otherwise
 *
 * @remarks
 * - The hook initializes with `undefined` and resolves to a boolean after the first render
 * - Uses `window.matchMedia` for efficient viewport change detection
 * - Automatically cleans up event listeners when the component unmounts
 * - Depends on the `MOBILE_BREAKPOINT` constant being defined in the module scope
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
