/**
 * Visitor Data Collection Utility
 * Collects comprehensive browser and device information for analytics
 * Includes persistent visitor identification and behavioral tracking
 */

// Storage keys for persistent identification
const STORAGE_KEYS = {
  VISITOR_UUID: 'rf_visitor_uuid',
  FIRST_SEEN: 'rf_first_seen',
  VISIT_COUNT: 'rf_visit_count',
  LAST_SEEN: 'rf_last_seen',
} as const

// ========== PERSISTENT VISITOR IDENTITY ==========

export interface PersistentIdentity {
  visitorUUID: string           // UUID v4, stored in localStorage
  firstSeen: string             // ISO timestamp of first visit
  visitCount: number            // Total visits
  lastSeen: string              // Last visit timestamp
  isReturning: boolean          // True if not first visit
  storageType: 'localStorage' | 'sessionStorage' | 'none'
}

// ========== BEHAVIORAL SIGNALS ==========

export interface BehavioralSignals {
  // Time metrics
  pageLoadTime: string          // When page loaded (ISO)
  formOpenTime?: string         // When form was opened (ISO)
  formSubmitTime?: string       // When form was submitted (ISO)
  timeOnPageMs: number          // Total time on page in ms
  timeInFormMs?: number         // Time spent in form in ms
  
  // Scroll behavior
  scrollDepthMax: number        // 0-100 percentage
  scrollEvents: number          // Number of scroll events
  
  // Interaction metrics
  clickCount: number            // Total clicks on page
  keystrokes: number            // Total keystrokes in form
  fieldFocusCount: number       // How many times fields were focused
  
  // Typing patterns (aggregated, not raw)
  typingSpeedCpm?: number       // Characters per minute (if enough data)
  hesitationTimeMs?: number     // Time before first keystroke in form
  
  // Mouse/touch
  mouseMovements: number        // Movement event count
  touchEvents: number           // Touch event count
  
  // Navigation
  pagesInSession: string[]      // Pathnames visited this session
}

// ========== PARSED CONTACT INFO ==========

export interface ParsedContactInfo {
  // Extracted from freeform message
  name?: string
  email?: string
  phone?: string
  social?: {                    // Social media handles
    platform: string
    handle: string
  }[]
  // The raw message
  rawMessage: string
  // Detected topics/interests
  topics?: string[]
}

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
  
  // Persistent identity (for visitor continuity)
  identity: PersistentIdentity
  
  // Behavioral signals (for visitor recognition)
  behavior?: BehavioralSignals
  
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
  
  // Confidence score for visitor matching (calculated server-side or on query)
  confidenceScore?: {
    total: number               // 0-100
    breakdown: {
      identityMatch: number     // 0-40 (persistent UUID match)
      behavioralMatch: number   // 0-25 (similar behavior patterns)
      fingerprintMatch: number  // 0-15 (soft fingerprint)
      contextMatch: number      // 0-20 (IP/location context - server-side)
    }
    verdict: 'same' | 'likely' | 'uncertain' | 'different'
  }
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

// Remove undefined values from object (Firestore doesn't accept undefined)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as T
  }
  
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value)
      }
    }
    return cleaned as T
  }
  
  return obj
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
    
    let resolved = false
    
    const cleanup = () => {
      if (resolved) return
      resolved = true
      try {
        oscillator.disconnect()
        scriptProcessor.disconnect()
        if (context.state !== 'closed') {
          context.close()
        }
      } catch {
        // Ignore cleanup errors
      }
    }
    
    return new Promise((resolve) => {
      scriptProcessor.onaudioprocess = (e) => {
        if (resolved) return
        const data = e.inputBuffer.getChannelData(0)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          sum += Math.abs(data[i])
        }
        cleanup()
        resolve(simpleHash(sum.toString()))
      }
      
      // Timeout fallback
      setTimeout(() => {
        if (resolved) return
        cleanup()
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

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// ========== PERSISTENT IDENTITY FUNCTIONS ==========

/**
 * Get or create persistent visitor identity
 * Uses localStorage primarily, sessionStorage as fallback
 */
export function getPersistentIdentity(): PersistentIdentity {
  const now = new Date().toISOString()
  
  // Try localStorage first
  try {
    const existingUUID = localStorage.getItem(STORAGE_KEYS.VISITOR_UUID)
    const firstSeen = localStorage.getItem(STORAGE_KEYS.FIRST_SEEN)
    const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0', 10)
    
    if (existingUUID && firstSeen) {
      // Returning visitor
      const newCount = visitCount + 1
      localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, newCount.toString())
      localStorage.setItem(STORAGE_KEYS.LAST_SEEN, now)
      
      return {
        visitorUUID: existingUUID,
        firstSeen,
        visitCount: newCount,
        lastSeen: now,
        isReturning: true,
        storageType: 'localStorage',
      }
    }
    
    // New visitor - create identity
    const newUUID = generateUUID()
    localStorage.setItem(STORAGE_KEYS.VISITOR_UUID, newUUID)
    localStorage.setItem(STORAGE_KEYS.FIRST_SEEN, now)
    localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, '1')
    localStorage.setItem(STORAGE_KEYS.LAST_SEEN, now)
    
    return {
      visitorUUID: newUUID,
      firstSeen: now,
      visitCount: 1,
      lastSeen: now,
      isReturning: false,
      storageType: 'localStorage',
    }
  } catch {
    // localStorage blocked, try sessionStorage
    try {
      const existingUUID = sessionStorage.getItem(STORAGE_KEYS.VISITOR_UUID)
      
      if (existingUUID) {
        return {
          visitorUUID: existingUUID,
          firstSeen: sessionStorage.getItem(STORAGE_KEYS.FIRST_SEEN) || now,
          visitCount: 1,
          lastSeen: now,
          isReturning: false, // Can't know in sessionStorage
          storageType: 'sessionStorage',
        }
      }
      
      const newUUID = generateUUID()
      sessionStorage.setItem(STORAGE_KEYS.VISITOR_UUID, newUUID)
      sessionStorage.setItem(STORAGE_KEYS.FIRST_SEEN, now)
      
      return {
        visitorUUID: newUUID,
        firstSeen: now,
        visitCount: 1,
        lastSeen: now,
        isReturning: false,
        storageType: 'sessionStorage',
      }
    } catch {
      // Both storage types blocked
      return {
        visitorUUID: generateUUID(),
        firstSeen: now,
        visitCount: 1,
        lastSeen: now,
        isReturning: false,
        storageType: 'none',
      }
    }
  }
}

// ========== BEHAVIORAL TRACKING ==========

/**
 * Behavioral tracker class - instantiate on page load
 * Call getBehavioralSignals() when ready to collect
 */
export class BehaviorTracker {
  private pageLoadTime: Date
  private formOpenTime?: Date
  private scrollDepthMax = 0
  private scrollEvents = 0
  private clickCount = 0
  private keystrokes = 0
  private fieldFocusCount = 0
  private firstKeystrokeTime?: Date
  private mouseMovements = 0
  private touchEvents = 0
  private pagesInSession: string[] = []
  private listeners: Array<() => void> = []
  
  constructor() {
    this.pageLoadTime = new Date()
    this.pagesInSession = [window.location.pathname]
    this.setupListeners()
  }
  
  private setupListeners() {
    // Scroll tracking
    const scrollHandler = () => {
      this.scrollEvents++
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const depth = Math.round((scrollTop / scrollHeight) * 100)
        if (depth > this.scrollDepthMax) {
          this.scrollDepthMax = depth
        }
      }
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })
    this.listeners.push(() => window.removeEventListener('scroll', scrollHandler))
    
    // Click tracking
    const clickHandler = () => { this.clickCount++ }
    document.addEventListener('click', clickHandler)
    this.listeners.push(() => document.removeEventListener('click', clickHandler))
    
    // Mouse movement tracking (throttled)
    let lastMouseMove = 0
    const mouseMoveHandler = () => {
      const now = Date.now()
      if (now - lastMouseMove > 100) {
        this.mouseMovements++
        lastMouseMove = now
      }
    }
    document.addEventListener('mousemove', mouseMoveHandler, { passive: true })
    this.listeners.push(() => document.removeEventListener('mousemove', mouseMoveHandler))
    
    // Touch tracking
    const touchHandler = () => { this.touchEvents++ }
    document.addEventListener('touchstart', touchHandler, { passive: true })
    this.listeners.push(() => document.removeEventListener('touchstart', touchHandler))
  }
  
  /**
   * Call when form is opened
   */
  markFormOpened() {
    this.formOpenTime = new Date()
  }
  
  /**
   * Call on each keystroke in the form
   */
  recordKeystroke() {
    this.keystrokes++
    if (!this.firstKeystrokeTime) {
      this.firstKeystrokeTime = new Date()
    }
  }
  
  /**
   * Call when a field is focused
   */
  recordFieldFocus() {
    this.fieldFocusCount++
  }
  
  /**
   * Get collected behavioral signals
   */
  getBehavioralSignals(): BehavioralSignals {
    const now = new Date()
    const timeOnPageMs = now.getTime() - this.pageLoadTime.getTime()
    const timeInFormMs = this.formOpenTime 
      ? now.getTime() - this.formOpenTime.getTime() 
      : undefined
    
    // Calculate typing speed if enough data
    let typingSpeedCpm: number | undefined
    if (this.keystrokes > 10 && this.firstKeystrokeTime) {
      const typingDurationMs = now.getTime() - this.firstKeystrokeTime.getTime()
      if (typingDurationMs > 1000) {
        typingSpeedCpm = Math.round((this.keystrokes / typingDurationMs) * 60000)
      }
    }
    
    // Calculate hesitation time
    let hesitationTimeMs: number | undefined
    if (this.formOpenTime && this.firstKeystrokeTime) {
      hesitationTimeMs = this.firstKeystrokeTime.getTime() - this.formOpenTime.getTime()
    }
    
    return {
      pageLoadTime: this.pageLoadTime.toISOString(),
      formOpenTime: this.formOpenTime?.toISOString(),
      formSubmitTime: now.toISOString(),
      timeOnPageMs,
      timeInFormMs,
      scrollDepthMax: this.scrollDepthMax,
      scrollEvents: this.scrollEvents,
      clickCount: this.clickCount,
      keystrokes: this.keystrokes,
      fieldFocusCount: this.fieldFocusCount,
      typingSpeedCpm,
      hesitationTimeMs,
      mouseMovements: this.mouseMovements,
      touchEvents: this.touchEvents,
      pagesInSession: this.pagesInSession,
    }
  }
  
  /**
   * Cleanup listeners
   */
  destroy() {
    this.listeners.forEach(cleanup => cleanup())
    this.listeners = []
  }
}

// ========== MESSAGE PARSING ==========

/**
 * Parse freeform message to extract structured contact info
 */
export function parseContactMessage(message: string): ParsedContactInfo {
  const result: ParsedContactInfo = {
    rawMessage: message,
  }
  
  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi
  const emails = message.match(emailRegex)
  if (emails && emails.length > 0) {
    result.email = emails[0]
  }
  
  // Phone regex (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?(?:\(?[0-9]{3}\)?[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{4}/g
  const phones = message.match(phoneRegex)
  if (phones && phones.length > 0) {
    result.phone = phones[0].replace(/[^\d+]/g, '') // Normalize
  }
  
  // Social media handles
  const socialPatterns = [
    { platform: 'twitter', regex: /@([A-Za-z0-9_]{1,15})\b/g },
    { platform: 'instagram', regex: /(?:instagram|ig)[:\s]*@?([A-Za-z0-9._]{1,30})/gi },
    { platform: 'linkedin', regex: /linkedin\.com\/in\/([A-Za-z0-9-]+)/gi },
    { platform: 'github', regex: /github\.com\/([A-Za-z0-9-]+)/gi },
    { platform: 'discord', regex: /([A-Za-z0-9_]{2,32}#[0-9]{4})/g },
  ]
  
  const socials: { platform: string; handle: string }[] = []
  for (const { platform, regex } of socialPatterns) {
    const matches = message.matchAll(regex)
    for (const match of matches) {
      if (match[1] && !socials.some(s => s.handle === match[1])) {
        socials.push({ platform, handle: match[1] })
      }
    }
  }
  if (socials.length > 0) {
    result.social = socials
  }
  
  // Name extraction (heuristic: "I'm X", "My name is X", "This is X", or first capitalized words)
  const namePatterns = [
    /(?:I'm|I am|my name is|this is|hi,?\s*I'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+here/i,
    /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/m, // Name at end
  ]
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      // Avoid common false positives
      const falsePositives = ['Hello', 'Hi', 'Hey', 'Thanks', 'Thank', 'Please', 'Just', 'Really', 'Great']
      if (!falsePositives.includes(match[1].split(' ')[0])) {
        result.name = match[1]
        break
      }
    }
  }
  
  // Topic/interest detection
  const topicKeywords: Record<string, string[]> = {
    'job_opportunity': ['job', 'position', 'hiring', 'opportunity', 'role', 'work with', 'join'],
    'collaboration': ['collaborate', 'partner', 'work together', 'project together'],
    'consulting': ['consult', 'advice', 'help with', 'guidance'],
    'research': ['research', 'academic', 'paper', 'publication', 'study'],
    'freelance': ['freelance', 'contract', 'gig', 'project-based'],
    'networking': ['connect', 'coffee', 'chat', 'meet', 'network'],
    'feedback': ['feedback', 'review', 'thoughts on', 'opinion'],
    'general_inquiry': ['question', 'wondering', 'curious', 'interested'],
  }
  
  const detectedTopics: string[] = []
  const lowerMessage = message.toLowerCase()
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      detectedTopics.push(topic)
    }
  }
  if (detectedTopics.length > 0) {
    result.topics = detectedTopics
  }
  
  return result
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
 * @param behaviorTracker Optional behavior tracker for behavioral signals
 */
export async function collectVisitorData(
  behaviorTracker?: BehaviorTracker
): Promise<VisitorData> {
  const browser = getBrowserInfo()
  const screenInfo = getScreenInfo()
  const network = getNetworkInfo()
  const timing = getTimingInfo()
  const capabilities = getCapabilities()
  const media = getMediaInfo()
  const plugins = getPlugins()
  const webGLInfo = getWebGLInfo()
  const identity = getPersistentIdentity()
  
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
  
  // Get behavioral signals if tracker provided
  const behavior = behaviorTracker?.getBehavioralSignals()
  
  // Build visitor data object
  const visitorData: VisitorData = {
    fingerprint,
    sessionId,
    visitTimestamp: new Date().toISOString(),
    identity,
    behavior,
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
  
  // Remove undefined values (Firestore doesn't accept undefined)
  return removeUndefined(visitorData)
}

/**
 * Lightweight visitor data for quick collection
 * Use this for initial page load tracking
 */
export function collectBasicVisitorData(): Partial<VisitorData> {
  const data: Partial<VisitorData> = {
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
  
  // Remove undefined values (Firestore doesn't accept undefined)
  return removeUndefined(data)
}
