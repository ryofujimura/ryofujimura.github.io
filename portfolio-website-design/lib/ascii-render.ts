/**
 * Image-to-ASCII conversion following Alex Harri's approach:
 * https://alexharri.com/blog/ascii-rendering
 *
 * - Grid cells with optional supersampling for anti-aliasing
 * - Lightness → character ramp (darker → denser)
 * - Monospace output for terminal/canvas display
 */

/** Character ramp: low density (dark) → high density (bright). Space = empty. */
export const ASCII_RAMP = " .:-=+*#%@";

/** Relative luminance from RGB [0..255]. See Alex Harri / WCAG. */
export function rgbToLightness(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Map lightness in [0,1] to one character from the ramp.
 * Low lightness → denser characters (right of ramp).
 */
export function lightnessToChar(lightness: number, ramp: string = ASCII_RAMP): string {
  const i = Math.min(ramp.length - 1, Math.floor(lightness * ramp.length));
  return ramp[Math.max(0, i)];
}

export type AsciiOptions = {
  /** Number of columns (cells) in the ASCII grid */
  cols: number;
  /** Number of rows */
  rows: number;
  /** Supersampling samples per cell (e.g. 4 = 2x2). More = less jaggies. */
  sampleQuality?: number;
  /** Custom character ramp */
  ramp?: string;
};

/**
 * Convert canvas ImageData to an ASCII string.
 * Uses a grid of cells; each cell's lightness is sampled (center or supersampled)
 * and mapped to a character per Alex Harri's lightness mapping.
 */
export function imageDataToAscii(
  data: ImageData,
  width: number,
  height: number,
  options: AsciiOptions
): string {
  const { cols, rows, sampleQuality = 2, ramp = ASCII_RAMP } = options;
  const cellW = width / cols;
  const cellH = height / rows;
  const samples = Math.max(1, sampleQuality);
  const lines: string[] = [];

  for (let row = 0; row < rows; row++) {
    let line = "";
    for (let col = 0; col < cols; col++) {
      let sum = 0;
      let count = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const x = (col + (sx + 0.5) / samples) * cellW;
          const y = (row + (sy + 0.5) / samples) * cellH;
          const ix = Math.min(width - 1, Math.floor(x));
          const iy = Math.min(height - 1, Math.floor(y));
          const i = (iy * width + ix) * 4;
          const r = data.data[i];
          const g = data.data[i + 1];
          const b = data.data[i + 2];
          sum += rgbToLightness(r, g, b);
          count += 1;
        }
      }
      const lightness = count > 0 ? sum / count : 0;
      line += lightnessToChar(lightness, ramp);
    }
    lines.push(line);
  }

  return lines.join("\n");
}

/**
 * Same as imageDataToAscii but returns a 2D array of characters (for overlays or per-cell styling).
 */
export function imageDataToAsciiGrid(
  data: ImageData,
  width: number,
  height: number,
  options: AsciiOptions
): string[][] {
  const { cols, rows, sampleQuality = 2, ramp = ASCII_RAMP } = options;
  const cellW = width / cols;
  const cellH = height / rows;
  const samples = Math.max(1, sampleQuality);
  const grid: string[][] = [];

  for (let row = 0; row < rows; row++) {
    const line: string[] = [];
    for (let col = 0; col < cols; col++) {
      let sum = 0;
      let count = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const x = (col + (sx + 0.5) / samples) * cellW;
          const y = (row + (sy + 0.5) / samples) * cellH;
          const ix = Math.min(width - 1, Math.floor(x));
          const iy = Math.min(height - 1, Math.floor(y));
          const i = (iy * width + ix) * 4;
          sum += rgbToLightness(data.data[i], data.data[i + 1], data.data[i + 2]);
          count += 1;
        }
      }
      line.push(lightnessToChar(count > 0 ? sum / count : 0, ramp));
    }
    grid.push(line);
  }

  return grid;
}
