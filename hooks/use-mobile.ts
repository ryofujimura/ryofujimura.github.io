import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * SSR-safe mobile detection hook with matchMedia and resize listener.
 * Uses both matchMedia change events AND resize events for reliable detection
 * (handles iOS Safari address bar changes).
 * 
 * @param breakpoint - Width threshold in pixels (default: 768)
 * @returns boolean - true if viewport width < breakpoint
 */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState(false) // SSR-safe default

  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    
    const update = () => {
      setIsMobile(mq.matches)
    }

    // Initial check
    update()

    // Listen to matchMedia changes (orientation, device changes)
    mq.addEventListener('change', update)
    
    // Also listen to resize for address bar changes on mobile
    window.addEventListener('resize', update)

    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [breakpoint])

  return isMobile
}
