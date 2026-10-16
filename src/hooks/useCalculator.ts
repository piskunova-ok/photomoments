import { useCallback, useMemo, useState } from 'react'

import {
  calculatePrice,
  validateQuantity,
  type CalculatorResult,
  type QuantityValidation,
} from '../lib/calculator.ts'
import { buildCalculatorPayload, type CalculatorPayload } from '../lib/yandexForm.ts'
import type { FormatId, PaperId } from '../data/price.ts'

export interface CalculatorController {
  formatId: FormatId
  paperId: PaperId
  urgent: boolean
  /** Текущий ввод количества (строка, только цифры). */
  quantityRaw: string
  /** Последнее корректное количество, участвующее в расчёте. */
  quantity: number
  /** Результат проверки текущего ввода. */
  validation: QuantityValidation
  result: CalculatorResult
  payload: CalculatorPayload
  setFormatId: (id: FormatId) => void
  setPaperId: (id: PaperId) => void
  setUrgent: (value: boolean) => void
  setQuantityRaw: (value: string) => void
  applyPreset: (value: number) => void
  /** Сбросить параметры к значениям по умолчанию. */
  reset: () => void
}

const DEFAULT_QUANTITY = 10

/**
 * Состояние калькулятора с моментальным пересчётом стоимости.
 * Хранит «сырой» ввод пользователя и отдельно последнее корректное
 * количество, поэтому отрицательные и нулевые значения не влияют на итог.
 */
export function useCalculator(): CalculatorController {
  const [formatId, setFormatId] = useState<FormatId>('10x15')
  const [paperId, setPaperId] = useState<PaperId>('glossy')
  const [urgent, setUrgent] = useState(false)
  const [quantityRaw, setQuantityRawState] = useState(String(DEFAULT_QUANTITY))
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)

  const validation = useMemo(() => validateQuantity(quantityRaw), [quantityRaw])

  const setQuantityRaw = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 5)
    setQuantityRawState(digits)

    const check = validateQuantity(digits)
    if (check.valid) {
      setQuantity(check.value)
    }
  }, [])

  const applyPreset = useCallback((value: number) => {
    setQuantityRawState(String(value))
    setQuantity(value)
  }, [])

  const result = useMemo(
    () => calculatePrice({ formatId, paperId, quantity, urgent }),
    [formatId, paperId, quantity, urgent],
  )

  const payload = useMemo(
    () => buildCalculatorPayload({ formatId, paperId, quantity, urgent, result }),
    [formatId, paperId, quantity, urgent, result],
  )

  const reset = useCallback(() => {
    setFormatId('10x15')
    setPaperId('glossy')
    setUrgent(false)
    setQuantityRawState(String(DEFAULT_QUANTITY))
    setQuantity(DEFAULT_QUANTITY)
  }, [])

  return {
    formatId,
    paperId,
    urgent,
    quantityRaw,
    quantity,
    validation,
    result,
    payload,
    setFormatId,
    setPaperId,
    setUrgent,
    setQuantityRaw,
    applyPreset,
    reset,
  }
}
