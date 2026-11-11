function gammaEncode(value: number): number {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
}

export function oklchToRgb(value: string): string {
  const match = value
    .trim()
    .match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*[\d.]+%?)?\s*\)$/i)

  if (!match) return value

  const lightness = match[2] === '%' ? Number(match[1]) / 100 : Number(match[1])
  const chroma = Number(match[3])
  const hue = (Number(match[4]) * Math.PI) / 180

  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b

  const l = lPrime * lPrime * lPrime
  const m = mPrime * mPrime * mPrime
  const s = sPrime * sPrime * sPrime

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const toByte = (channel: number) => Math.round(gammaEncode(channel) * 255)

  return `rgb(${toByte(r)}, ${toByte(g)}, ${toByte(bl)})`
}

export function resolveCssColor(value: string): string {
  const trimmed = value.trim()
  return trimmed.startsWith('oklch(') ? oklchToRgb(trimmed) : trimmed
}

export function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
