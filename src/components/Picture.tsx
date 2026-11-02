import type { CSSProperties } from 'react'

type Src = { base: string; widths: number[]; w: number; h: number; lqip?: string }

export function srcSet(img: Src, ext: 'avif' | 'webp') {
  return img.widths.map((w) => `${img.base}-${w}.${ext} ${Math.min(w, img.w)}w`).join(', ')
}

export default function Picture({
  img,
  alt,
  sizes,
  className,
  imgClassName,
  eager,
  style,
}: {
  img: Src
  alt: string
  sizes: string
  className?: string
  imgClassName?: string
  eager?: boolean
  style?: CSSProperties
}) {
  const fallback = `${img.base}-${img.widths[img.widths.length - 1]}.webp`
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcSet(img, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(img, 'webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={img.w}
        height={img.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        className={imgClassName}
        style={img.lqip ? { backgroundImage: `url(${img.lqip})`, backgroundSize: 'cover' } : undefined}
      />
    </picture>
  )
}
