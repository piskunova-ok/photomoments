import { useState } from 'react'

import type { PhotoSource } from '../data/images.ts'

interface PhotoProps {
  photo: PhotoSource
  className?: string
  /** Как грузить изображение: сразу или лениво. */
  eager?: boolean
  /** Показывать ли подпись под изображением. */
  withCaption?: boolean
}

/**
 * Изображение с «мягким» поведением: если файл не загрузился,
 * вместо битой картинки показываем аккуратный плейсхолдер.
 */
export function Photo({ photo, className = '', eager = false, withCaption = false }: PhotoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`photo photo--fallback ${className}`.trim()} role="img" aria-label={photo.alt}>
        <span aria-hidden="true">ФотоМоменты</span>
      </div>
    )
  }

  const image = (
    <img
      className={`photo__img ${className}`.trim()}
      src={photo.src}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )

  if (!withCaption || !photo.caption) {
    return image
  }

  return (
    <figure className="photo">
      {image}
      <figcaption className="photo__caption">{photo.caption}</figcaption>
    </figure>
  )
}
