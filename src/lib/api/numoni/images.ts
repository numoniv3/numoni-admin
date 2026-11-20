/*
 * Shrinks images in the browser before they're uploaded, so a phone photo of
 * a logo (often 3–8 MB) goes up as ~50–150 KB. Only image form fields we know
 * are pictures are touched; documents and CSVs are sent as they are.
 */

/** Longest side, in pixels, per multipart field name. */
const MAX_SIDE: Record<string, number> = { logo: 512, heroBanner: 1600, image: 1600, images: 1600 }
const QUALITY = 0.82
/** Small enough already — not worth re-encoding. */
const SKIP_BELOW_BYTES = 120 * 1024

const canResize = (f: File) => /^image\/(png|jpe?g|webp|heic|heif|bmp)$/i.test(f.type)

function load(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unreadable image')) }
    img.src = url
  })
}

/**
 * The image scaled to fit `maxSide` and re-encoded as WebP (keeps logo
 * transparency), or the original file when shrinking wouldn't help or fails.
 */
export async function shrinkImage(file: File, maxSide: number): Promise<File> {
  if (typeof document === 'undefined' || !canResize(file)) return file
  try {
    const img = await load(file)
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
    if (scale === 1 && file.size < SKIP_BELOW_BYTES) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', QUALITY))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    return file
  }
}

/** A copy of `form` with its known image fields shrunk (see `MAX_SIDE`). */
export async function shrinkFormImages(form: FormData): Promise<FormData> {
  const out = new FormData()
  for (const [key, value] of form.entries()) {
    const max = MAX_SIDE[key]
    out.append(key, max && value instanceof File ? await shrinkImage(value, max) : value)
  }
  return out
}
