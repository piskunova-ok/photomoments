/**
 * УЧЕБНЫЙ ПРАЙС сервиса «ФотоМоменты».
 *
 * ВАЖНО: это демонстрационные цены для учебного проекта, а не реальные
 * тарифы действующей компании. Все значения собраны в одном месте,
 * чтобы заказчик мог отредактировать их без правки компонентов.
 */

export type FormatId = '10x15' | '13x18' | '15x21' | '20x30'
export type PaperId = 'glossy' | 'matte'

export interface PhotoFormat {
  id: FormatId
  /** Размер в сантиметрах для отображения */
  size: string
  /** Ширина в сантиметрах (для пропорций превью) */
  widthCm: number
  /** Высота в сантиметрах (для пропорций превью) */
  heightCm: number
  /** Короткое описание формата */
  note: string
}

export interface PaperType {
  id: PaperId
  title: string
  description: string
}

/** Учебные форматы фотографий. */
export const FORMATS: readonly PhotoFormat[] = [
  {
    id: '10x15',
    size: '10 × 15 см',
    widthCm: 10,
    heightCm: 15,
    note: 'Классический формат для быстрых отпечатков и подарков.',
  },
  {
    id: '13x18',
    size: '13 × 18 см',
    widthCm: 13,
    heightCm: 18,
    note: 'Увеличенный формат для семейных кадров и небольших рамок.',
  },
  {
    id: '15x21',
    size: '15 × 21 см',
    widthCm: 15,
    heightCm: 21,
    note: 'Выразительный формат для портретов и фото на память.',
  },
  {
    id: '20x30',
    size: '20 × 30 см',
    widthCm: 20,
    heightCm: 30,
    note: 'Крупный отпечаток для интерьера и больших подарков.',
  },
] as const

/** Учебные типы бумаги. */
export const PAPER_TYPES: readonly PaperType[] = [
  {
    id: 'glossy',
    title: 'Глянцевая бумага',
    description: 'Насыщенные цвета и глубокая детализация. Универсальный выбор.',
  },
  {
    id: 'matte',
    title: 'Матовая бумага',
    description: 'Мягкие оттенки без бликов. Приятна на ощупь и не отпечатывается.',
  },
] as const

/**
 * Цены за одну фотографию в рублях (учебный прайс).
 * Ключ — формат, значение — цена для каждого типа бумаги.
 */
export const PHOTO_PRICES_RUB: Record<FormatId, Record<PaperId, number>> = {
  '10x15': { glossy: 18, matte: 24 },
  '13x18': { glossy: 35, matte: 45 },
  '15x21': { glossy: 55, matte: 70 },
  '20x30': { glossy: 110, matte: 140 },
} as const

/** Условия скидок и надбавок (централизованно). */
export const PRICING_RULES = {
  /** Скидка включается, начиная с этого количества фотографий. */
  discountMinQuantity: 50,
  /** Размер скидки в процентах. */
  discountPercent: 10,
  /** Надбавка за срочное изготовление в процентах. */
  urgentSurchargePercent: 30,
} as const

/** Допустимый диапазон количества фотографий. */
export const QUANTITY_LIMITS = {
  min: 1,
  max: 10000,
} as const

/** Проверка, что формат существует в прайсе. */
export function getPhotoPriceRub(formatId: FormatId, paperId: PaperId): number {
  return PHOTO_PRICES_RUB[formatId][paperId]
}

export function getFormat(formatId: FormatId): PhotoFormat {
  const format = FORMATS.find((item) => item.id === formatId)
  if (!format) {
    throw new Error(`Неизвестный формат: ${formatId}`)
  }
  return format
}

export function getPaperType(paperId: PaperId): PaperType {
  const paper = PAPER_TYPES.find((item) => item.id === paperId)
  if (!paper) {
    throw new Error(`Неизвестный тип бумаги: ${paperId}`)
  }
  return paper
}
