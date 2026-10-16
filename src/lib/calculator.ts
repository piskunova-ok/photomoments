/**
 * Чистая логика калькулятора фотопечати.
 *
 * Здесь нет React и DOM — только вычисления, поэтому функции удобно
 * тестировать отдельно (см. calculator.test.ts).
 *
 * Все деньги считаются в копейках (целые числа), чтобы избежать
 * ошибок округления чисел с плавающей точкой.
 */

import {
  getPhotoPriceRub,
  PRICING_RULES,
  QUANTITY_LIMITS,
  type FormatId,
  type PaperId,
} from '../data/price.ts'

export interface CalculatorInput {
  formatId: FormatId
  paperId: PaperId
  quantity: number
  urgent: boolean
}

export interface CalculatorResult {
  /** Цена за одну фотографию без скидок и надбавок, в копейках. */
  unitPriceKopecks: number
  /** Базовая стоимость: цена × количество, в копейках. */
  baseCostKopecks: number
  /** Размер применённой скидки в процентах (0, если скидки нет). */
  discountPercent: number
  /** Сумма скидки в копейках. */
  discountKopecks: number
  /** Стоимость после скидки, до надбавки за срочность, в копейках. */
  subtotalKopecks: number
  /** Размер надбавки за срочность в процентах (0, если не срочно). */
  urgentPercent: number
  /** Доплата за срочность в копейках. */
  urgentSurchargeKopecks: number
  /** Итоговая стоимость в копейках. */
  totalKopecks: number
  /** Средняя цена за одну фотографию с учётом скидки и надбавки, в копейках. */
  averagePerPhotoKopecks: number
}

export type QuantityValidation =
  | { valid: true; value: number }
  | { valid: false; message: string }

/**
 * Проверяет количество фотографий, введённое пользователем.
 * Не допускает пустого значения, нуля, отрицательных и нецелых чисел,
 * а также значений выше допустимого максимума.
 */
export function validateQuantity(raw: string | number): QuantityValidation {
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed === '') {
      return { valid: false, message: 'Укажите количество фотографий.' }
    }
    if (!/^\d+$/.test(trimmed)) {
      return { valid: false, message: 'Количество должно быть целым числом.' }
    }
  }

  const value = typeof raw === 'number' ? raw : Number(raw)

  if (!Number.isFinite(value)) {
    return { valid: false, message: 'Количество должно быть числом.' }
  }
  if (!Number.isInteger(value)) {
    return { valid: false, message: 'Количество должно быть целым числом.' }
  }
  if (value < QUANTITY_LIMITS.min) {
    return {
      valid: false,
      message: `Минимальное количество — ${QUANTITY_LIMITS.min} фото.`,
    }
  }
  if (value > QUANTITY_LIMITS.max) {
    return {
      valid: false,
      message: `Максимальное количество — ${QUANTITY_LIMITS.max.toLocaleString('ru-RU')} фото.`,
    }
  }

  return { valid: true, value }
}

/**
 * Считает стоимость заказа.
 *
 * Формула:
 *   1. Базовая стоимость = цена формата и бумаги × количество.
 *   2. Если количество ≥ 50 — скидка 10%.
 *   3. Если изготовление срочное — к стоимости после скидки добавляется 30%.
 */
export function calculatePrice(input: CalculatorInput): CalculatorResult {
  const quantity = Math.max(QUANTITY_LIMITS.min, Math.floor(input.quantity))
  const unitPriceKopecks = Math.round(getPhotoPriceRub(input.formatId, input.paperId) * 100)

  const baseCostKopecks = unitPriceKopecks * quantity

  const hasDiscount = quantity >= PRICING_RULES.discountMinQuantity
  const discountPercent = hasDiscount ? PRICING_RULES.discountPercent : 0
  const discountKopecks = hasDiscount
    ? Math.round((baseCostKopecks * PRICING_RULES.discountPercent) / 100)
    : 0

  const subtotalKopecks = baseCostKopecks - discountKopecks

  const urgentPercent = input.urgent ? PRICING_RULES.urgentSurchargePercent : 0
  const urgentSurchargeKopecks = input.urgent
    ? Math.round((subtotalKopecks * PRICING_RULES.urgentSurchargePercent) / 100)
    : 0

  const totalKopecks = subtotalKopecks + urgentSurchargeKopecks
  const averagePerPhotoKopecks = Math.round(totalKopecks / quantity)

  return {
    unitPriceKopecks,
    baseCostKopecks,
    discountPercent,
    discountKopecks,
    subtotalKopecks,
    urgentPercent,
    urgentSurchargeKopecks,
    totalKopecks,
    averagePerPhotoKopecks,
  }
}

/** Форматирует сумму в копейках как строку в рублях, например «1 234,50 ₽». */
export function formatKopecks(kopecks: number): string {
  const rubles = kopecks / 100
  return `${rubles.toLocaleString('ru-RU', {
    minimumFractionDigits: Number.isInteger(rubles) ? 0 : 2,
    maximumFractionDigits: 2,
  })} ₽`
}

/** Форматирует сумму в рублях как строку, например «1 234,50 ₽». */
export function formatRubles(rubles: number): string {
  return `${rubles.toLocaleString('ru-RU', {
    minimumFractionDigits: Number.isInteger(rubles) ? 0 : 2,
    maximumFractionDigits: 2,
  })} ₽`
}
