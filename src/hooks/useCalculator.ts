import { useCallback, useMemo, useState } from 'react'

import {
  calculatePrice,
  isOrderComplete,
  validateQuantity,
  type CalculatorResult,
  type QuantityValidation,
} from '../lib/calculator.ts'
import { buildCalculatorPayload, type CalculatorPayload } from '../lib/yandexForm.ts'
import type { FormatId, PaperId } from '../data/price.ts'

export interface CalculatorController {
  formatId: FormatId | null
  paperId: PaperId | null
  urgent: boolean
  /** Текущий ввод количества (строка, только цифры). Пусто — ничего не введено. */
  quantityRaw: string
  /** Последнее корректное количество, участвующее в расчёте. */
  quantity: number
  /** Результат проверки текущего ввода. */
  validation: QuantityValidation
  /** Показывать ли ошибку количества (после ввода или попытки оформления). */
  quantityTouched: boolean
  /** Все обязательные параметры выбраны, расчёт готов. */
  isComplete: boolean
  /** Результат расчёта или null, пока параметры не выбраны. */
  result: CalculatorResult | null
  /** Данные для Яндекс Формы или null, пока расчёт не готов. */
  payload: CalculatorPayload | null
  setFormatId: (id: FormatId) => void
  setPaperId: (id: PaperId) => void
  setUrgent: (value: boolean) => void
  setQuantityRaw: (value: string) => void
  applyPreset: (value: number) => void
  /** Пометить количество как затронутое, чтобы показать ошибку после попытки оформления. */
  markQuantityTouched: () => void
  /** Сбросить параметры к значениям по умолчанию (пустое состояние). */
  reset: () => void
}

/**
 * Состояние калькулятора с моментальным пересчётом стоимости.
 *
 * Изначально формат и бумага не выбраны, а количество пустое — расчёт и данные
 * для Яндекс Формы остаются null, пока не заполнены все обязательные параметры.
 * Хранит «сырой» ввод пользователя и отдельно последнее корректное количество,
 * поэтому некорректные значения не влияют на итог.
 */
export function useCalculator(): CalculatorController {
  const [formatId, setFormatId] = useState<FormatId | null>(null)
  const [paperId, setPaperId] = useState<PaperId | null>(null)
  const [urgent, setUrgent] = useState(false)
  const [quantityRaw, setQuantityRawState] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [quantityTouched, setQuantityTouched] = useState(false)

  const validation = useMemo(() => validateQuantity(quantityRaw), [quantityRaw])

  const setQuantityRaw = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 5)
    setQuantityRawState(digits)
    setQuantityTouched(true)

    const check = validateQuantity(digits)
    if (check.valid) {
      setQuantity(check.value)
    }
  }, [])

  const applyPreset = useCallback((value: number) => {
    setQuantityRawState(String(value))
    setQuantity(value)
    setQuantityTouched(true)
  }, [])

  const markQuantityTouched = useCallback(() => {
    setQuantityTouched(true)
  }, [])

  const isComplete = useMemo(
    () => isOrderComplete({ formatId, paperId, validation }),
    [formatId, paperId, validation],
  )

  const result = useMemo(() => {
    if (!isComplete || formatId === null || paperId === null) {
      return null
    }
    return calculatePrice({ formatId, paperId, quantity, urgent })
  }, [isComplete, formatId, paperId, quantity, urgent])

  const payload = useMemo(() => {
    if (result === null || formatId === null || paperId === null) {
      return null
    }
    return buildCalculatorPayload({ formatId, paperId, quantity, urgent, result })
  }, [result, formatId, paperId, quantity, urgent])

  const reset = useCallback(() => {
    setFormatId(null)
    setPaperId(null)
    setUrgent(false)
    setQuantityRawState('')
    setQuantity(0)
    setQuantityTouched(false)
  }, [])

  return {
    formatId,
    paperId,
    urgent,
    quantityRaw,
    quantity,
    validation,
    quantityTouched,
    isComplete,
    result,
    payload,
    setFormatId,
    setPaperId,
    setUrgent,
    setQuantityRaw,
    applyPreset,
    markQuantityTouched,
    reset,
  }
}
