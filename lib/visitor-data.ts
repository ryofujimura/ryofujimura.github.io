/**
 * Visitor Data Collection Utility
 * Collects comprehensive browser and device information for analytics
 */

export interface NetworkInfo {
  effectiveType?: string       // 4g, 3g, 2g, slow-2g
  downlink?: number            // Mbps
  rtt?: number                 // Round trip time in ms
  saveData?: boolean           // Data saver enabled
  type?: string                // wifi, cellular, ethernet, etc.
}

export interface ScreenInfo {
  width: number
  height: number
  availWidth: number
  availHeight: number
  colorDepth: number
  pixelDepth: number
  devicePixelRatio: number
  orientation?: string
}

export interface BrowserInfo {
  userAgent: string
  language: string
  languages: string[]
  platform: string
  vendor: string
  cookiesEnabled: boolean
  doNotTrack: string | null
  hardwareConcurrency?: number
  deviceMemory?: number
  maxTouchPoints: number
  pdfViewerEnabled?: boolean
  webdriver: boolean
}

export interface TimingInfo {
  timezone: string
  timezoneOffset: number       // Minutes from UTC
  localTime: string            // ISO string
}

export interface CapabilitiesInfo {
  localStorage: boolean
  sessionStorage: boolean
  indexedDB: boolean
  webGL: boolean
  webGLVendor?: string
  webGLRenderer?: string
  canvas: boolean
  webRTC: boolean
  serviceWorker: boolean
  notifications: boolean
  geolocation: boolean
  bluetooth: boolean
  usb: boolean
  midi: boolean
  speechSynthesis: boolean
  speechRecognition: boolean
}

export interface MediaInfo {
  colorScheme: 'light' | 'dark' | 'unknown'
  reducedMotion: boolean
  reducedTransparency: boolean
  highContrast: boolean
  colorGamut: string
  hdr: boolean
  pointer: string              // fine, coarse, none
  hover: string                // hover, none
}

export interface VisitorData {
  // Core identification
  fingerprint: string          // Generated hash
  sessionId: string
  visitTimestamp: string
  
  // Browser & Device
  browser: BrowserInfo
  screen: ScreenInfo
  network?: NetworkInfo
  timing: TimingInfo
  
  // Capabilities & Features
  capabilities: CapabilitiesInfo
  media: MediaInfo
  
  // Page context
  pageInfo: {
    url: string
    referrer: string
    title: string
    pathname: string
    search: string
    hash: string
  }
  
  // Canvas fingerprint (hash only, not the actual data)
  canvasFingerprint?: string
  
  // WebGL fingerprint
  webGLFingerprint?: string
  
  // Audio fingerprint
  audioFingerprint?: string
  
  // Font detection (number of detected fonts)
  fontCount?: number
  
  // Plugin info
  plugins: string[]
  
  // History length (indicates browsing depth)
  historyLength: number
}

// Simple hash function for fingerprinting
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

// Generate canvas fingerprint
function getCanvasFingerprint(): string | undefined {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    
    canvas.width = 200
    canvas.height = 50
    
    // Draw text with specific styles
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('Fingerprint', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Canvas', 4, 17)
    
    // Add some shapes
    ctx.beginPath()
    ctx.arc(50, 25, 15, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
    
    return simpleHash(canvas.toDataURL())
  } catch {
    return undefined
  }
}

// Generate WebGL fingerprint
function getWebGLInfo(): { fingerprint?: string; vendor?: string; renderer?: string } {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return {}
    
    const glContext = gl as WebGLRenderingContext
    const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info')
    
    let vendor: string | undefined
    let renderer: string | undefined
    
    if (debugInfo) {
      vendor = glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      renderer = glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    }
    
    // Collect WebGL parameters for fingerprint
    const params = [
      glContext.getParameter(glContext.VERSION),
      glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION),
      glContext.getParameter(glContext.MAX_TEXTURE_SIZE),
      glContext.getParameter(glContext.MAX_VERTEX_ATTRIBS),
      glContext.getParameter(glContext.MAX_VERTEX_UNIFORM_VECTORS),
      glContext.getParameter(glContext.MAX_FRAGMENT_UNIFORM_VECTORS),
      vendor,
      renderer,
    ].filter(Boolean).join('|')
    
    return {
      fingerprint: simpleHash(params),
      vendor,
      renderer,
    }
  } catch {
    return {}
  }
}

// Generate audio fingerprint
async function getAudioFingerprint(): Promise<string | undefined> {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return undefined
    
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const analyser = context.createAnalyser()
    const gainNode = context.createGain()
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1)
    
    gainNode.gain.value = 0 // Mute
    oscillator.type = 'triangle'
    oscillator.frequency.value = 10000
    
    oscillator.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(gainNode)
    gainNode.connect(context.destination)
    
    oscillator.start(0)
    
    return new Promise((resolve) => {
      scriptProcessor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          sum += Math.abs(data[i])
        }
        oscillator.disconnect()
        scriptProcessor.disconnect()
        context.close()
        resolve(simpleHash(sum.toString()))
      }
      
      // Timeout fallback
      setTimeout(() => {
        oscillator.disconnect()
        scriptProcessor.disconnect()
        context.close()
        resolve(undefined)
      }, 1000)
    })
  } catch {
    return undefined
  }
}

// Detect installed fonts (basic detection)
function detectFonts(): number {
  const baseFonts = ['monospace', 'sans-serif', 'serif']
  const testFonts = [
    'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
    'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Palatino Linotype',
    'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Helvetica',
    'Monaco', 'Consolas', 'Menlo', 'SF Pro', 'Roboto', 'Open Sans'
  ]
  
  const testString = 'mmmmmmmmmmlli'
  const testSize = '72px'
  
  const span = document.createElement('span')
  span.style.position = 'absolute'
  span.style.left = '-9999px'
  span.style.fontSize = testSize
  span.innerHTML = testString
  document.body.appendChild(span)
  
  // Get baseline widths
  const baseWidths: Record<string, number> = {}
  baseFonts.forEach(font => {
    span.style.fontFamily = font
    baseWidths[font] = span.offsetWidth
  })
  
  let detectedCount = 0
  testFonts.forEach(font => {
    let detected = false
    baseFonts.forEach(baseFont => {
      span.style.fontFamily = `'${font}', ${baseFont}`
      if (span.offsetWidth !== baseWidths[baseFont]) {
        detected = true
      }
    })
    if (detected) detectedCount++
  })
  
  document.body.removeChild(span)
  return detectedCount
}

// Get network information
function getNetworkInfo(): NetworkInfo | undefined {
  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string
      downlink?: number
      rtt?: number
      saveData?: boolean
      type?: string
    }
  }
  
  if (!nav.connection) return undefined
  
  return {
    effectiveType: nav.connection.effectiveType,
    downlink: nav.connection.downlink,
    rtt: nav.connection.rtt,
    saveData: nav.connection.saveData,
    type: nav.connection.type,
  }
}

// Get screen information
function getScreenInfo(): ScreenInfo {
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio,
    orientation: screen.orientation?.type,
  }
}

// Get browser information
function getBrowserInfo(): BrowserInfo {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    pdfViewerEnabled?: boolean
  }
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: Array.from(navigator.languages || [navigator.language]),
    platform: navigator.platform,
    vendor: navigator.vendor,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    pdfViewerEnabled: nav.pdfViewerEnabled,
    webdriver: navigator.webdriver || false,
  }
}

// Get timing information
function getTimingInfo(): TimingInfo {
  const now = new Date()
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: now.getTimezoneOffset(),
    localTime: now.toISOString(),
  }
}

// Check capabilities
function getCapabilities(): CapabilitiesInfo {
  const webGLInfo = getWebGLInfo()
  
  // Check localStorage
  let hasLocalStorage = false
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    hasLocalStorage = true
  } catch { /* disabled */ }
  
  // Check sessionStorage
  let hasSessionStorage = false
  try {
    sessionStorage.setItem('test', 'test')
    sessionStorage.removeItem('test')
    hasSessionStorage = true
  } catch { /* disabled */ }
  
  // Check IndexedDB
  let hasIndexedDB = false
  try {
    hasIndexedDB = !!window.indexedDB
  } catch { /* disabled */ }
  
  // Check canvas
  let hasCanvas = false
  try {
    const canvas = document.createElement('canvas')
    hasCanvas = !!(canvas.getContext && canvas.getContext('2d'))
  } catch { /* disabled */ }
  
  return {
    localStorage: hasLocalStorage,
    sessionStorage: hasSessionStorage,
    indexedDB: hasIndexedDB,
    webGL: !!webGLInfo.fingerprint,
    webGLVendor: webGLInfo.vendor,
    webGLRenderer: webGLInfo.renderer,
    canvas: hasCanvas,
    webRTC: !!window.RTCPeerConnection,
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window,
    geolocation: 'geolocation' in navigator,
    bluetooth: 'bluetooth' in navigator,
    usb: 'usb' in navigator,
    midi: 'requestMIDIAccess' in navigator,
    speechSynthesis: 'speechSynthesis' in window,
    speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
  }
}

// Get media preferences
function getMediaInfo(): MediaInfo {
  const matchMedia = (query: string) => {
    try {
      return window.matchMedia(query).matches
    } catch {
      return false
    }
  }
  
  let colorScheme: 'light' | 'dark' | 'unknown' = 'unknown'
  if (matchMedia('(prefers-color-scheme: dark)')) {
    colorScheme = 'dark'
  } else if (matchMedia('(prefers-color-scheme: light)')) {
    colorScheme = 'light'
  }
  
  let colorGamut = 'srgb'
  if (matchMedia('(color-gamut: p3)')) {
    colorGamut = 'p3'
  } else if (matchMedia('(color-gamut: rec2020)')) {
    colorGamut = 'rec2020'
  }
  
  let pointer = 'none'
  if (matchMedia('(pointer: fine)')) {
    pointer = 'fine'
  } else if (matchMedia('(pointer: coarse)')) {
    pointer = 'coarse'
  }
  
  let hover = 'none'
  if (matchMedia('(hover: hover)')) {
    hover = 'hover'
  }
  
  return {
    colorScheme,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)'),
    reducedTransparency: matchMedia('(prefers-reduced-transparency: reduce)'),
    highContrast: matchMedia('(prefers-contrast: more)'),
    colorGamut,
    hdr: matchMedia('(dynamic-range: high)'),
    pointer,
    hover,
  }
}

// Get plugins list
function getPlugins(): string[] {
  try {
    return Array.from(navigator.plugins || []).map(p => p.name)
  } catch {
    return []
  }
}

// Generate session ID
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Generate unique fingerprint from collected data
function generateFingerprint(data: Partial<VisitorData>): string {
  const components = [
    data.browser?.userAgent,
    data.browser?.language,
    data.browser?.platform,
    data.browser?.hardwareConcurrency,
    data.browser?.deviceMemory,
    data.screen?.width,
    data.screen?.height,
    data.screen?.colorDepth,
    data.screen?.devicePixelRatio,
    data.timing?.timezone,
    data.canvasFingerprint,
    data.webGLFingerprint,
    data.capabilities?.webGLVendor,
    data.capabilities?.webGLRenderer,
    data.fontCount,
  ].filter(Boolean).join('|')
  
  return simpleHash(components)
}

/**
 * Collect all visitor data
 * Call this when the user interacts with the contact form
 */
export async function collectVisitorData(): Promise<VisitorData> {
  const browser = getBrowserInfo()
  const screenInfo = getScreenInfo()
  const network = getNetworkInfo()
  const timing = getTimingInfo()
  const capabilities = getCapabilities()
  const media = getMediaInfo()
  const plugins = getPlugins()
  const webGLInfo = getWebGLInfo()
  
  // Async operations
  const [audioFingerprint] = await Promise.all([
    getAudioFingerprint(),
  ])
  
  const canvasFingerprint = getCanvasFingerprint()
  const fontCount = detectFonts()
  
  const partialData: Partial<VisitorData> = {
    browser,
    screen: screenInfo,
    timing,
    capabilities,
    canvasFingerprint,
    webGLFingerprint: webGLInfo.fingerprint,
    fontCount,
  }
  
  const fingerprint = generateFingerprint(partialData)
  const sessionId = generateSessionId()
  
  return {
    fingerprint,
    sessionId,
    visitTimestamp: new Date().toISOString(),
    browser,
    screen: screenInfo,
    network,
    timing,
    capabilities,
    media,
    pageInfo: {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    },
    canvasFingerprint,
    webGLFingerprint: webGLInfo.fingerprint,
    audioFingerprint,
    fontCount,
    plugins,
    historyLength: window.history.length,
  }
}

/**
 * Lightweight visitor data for quick collection
 * Use this for initial page load tracking
 */
export function collectBasicVisitorData(): Partial<VisitorData> {
  return {
    visitTimestamp: new Date().toISOString(),
    browser: getBrowserInfo(),
    screen: getScreenInfo(),
    timing: getTimingInfo(),
    media: getMediaInfo(),
    pageInfo: {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    },
    historyLength: window.history.length,
  }
}
