import test from 'node:test'
import assert from 'node:assert/strict'

import {
  calculatePrice,
  formatKopecks,
  formatRubles,
  isOrderComplete,
  validateQuantity,
} from './calculator.ts'

const glossy10x15 = { formatId: '10x15', paperId: 'glossy' } as const

test('1 фото, обычное изготовление — без скидок и надбавок', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 1, urgent: false })
  assert.equal(result.unitPriceKopecks, 1800)
  assert.equal(result.baseCostKopecks, 1800)
  assert.equal(result.discountPercent, 0)
  assert.equal(result.discountKopecks, 0)
  assert.equal(result.urgentSurchargeKopecks, 0)
  assert.equal(result.totalKopecks, 1800)
})

test('49 фото — скидка ещё не применяется', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 49, urgent: false })
  assert.equal(result.baseCostKopecks, 88200)
  assert.equal(result.discountPercent, 0)
  assert.equal(result.totalKopecks, 88200)
})

test('49 фото, срочно — надбавка 30% без скидки', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 49, urgent: true })
  assert.equal(result.discountKopecks, 0)
  assert.equal(result.urgentSurchargeKopecks, 26460)
  assert.equal(result.totalKopecks, 114660)
})

test('50 фото — скидка 10% включается', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 50, urgent: false })
  assert.equal(result.baseCostKopecks, 90000)
  assert.equal(result.discountPercent, 10)
  assert.equal(result.discountKopecks, 9000)
  assert.equal(result.subtotalKopecks, 81000)
  assert.equal(result.totalKopecks, 81000)
})

test('50 фото, срочно — надбавка считается от суммы после скидки', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 50, urgent: true })
  assert.equal(result.subtotalKopecks, 81000)
  assert.equal(result.urgentSurchargeKopecks, 24300)
  assert.equal(result.totalKopecks, 105300)
})

test('100 фото — скидка и итог', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 100, urgent: false })
  assert.equal(result.baseCostKopecks, 180000)
  assert.equal(result.discountKopecks, 18000)
  assert.equal(result.totalKopecks, 162000)
})

test('100 фото, срочно — полный расчёт', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 100, urgent: true })
  assert.equal(result.subtotalKopecks, 162000)
  assert.equal(result.urgentSurchargeKopecks, 48600)
  assert.equal(result.totalKopecks, 210600)
})

test('20×30 матовая, 60 фото, срочно — другой тариф', () => {
  const result = calculatePrice({
    formatId: '20x30',
    paperId: 'matte',
    quantity: 60,
    urgent: true,
  })
  assert.equal(result.unitPriceKopecks, 14000)
  assert.equal(result.baseCostKopecks, 840000)
  assert.equal(result.discountKopecks, 84000)
  assert.equal(result.subtotalKopecks, 756000)
  assert.equal(result.urgentSurchargeKopecks, 226800)
  assert.equal(result.totalKopecks, 982800)
})

test('срочность не влияет на итог, если не выбрана', () => {
  const normal = calculatePrice({ ...glossy10x15, quantity: 100, urgent: false })
  assert.equal(normal.urgentPercent, 0)
  assert.equal(normal.urgentSurchargeKopecks, 0)
  assert.equal(normal.totalKopecks, normal.subtotalKopecks)
})

test('некорректное количество зажимается до минимума', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 0, urgent: false })
  assert.equal(result.baseCostKopecks, 1800)
})

test('средняя цена за фото рассчитывается без ошибок округления', () => {
  const result = calculatePrice({ ...glossy10x15, quantity: 3, urgent: true })
  // 18 ₽ × 3 = 54 ₽; срочно +30% = 70,20 ₽; в среднем 23,40 ₽.
  assert.equal(result.totalKopecks, 7020)
  assert.equal(result.averagePerPhotoKopecks, 2340)
})

test('валидация количества: границы и недопустимые значения', () => {
  assert.equal(validateQuantity('1').valid, true)
  assert.equal(validateQuantity('50').valid, true)
  assert.equal(validateQuantity('10000').valid, true)

  assert.equal(validateQuantity('').valid, false)
  assert.equal(validateQuantity('0').valid, false)
  assert.equal(validateQuantity('-5').valid, false)
  assert.equal(validateQuantity('1.5').valid, false)
  assert.equal(validateQuantity('abc').valid, false)
  assert.equal(validateQuantity('10001').valid, false)
  assert.equal(validateQuantity(Number.NaN).valid, false)
})

test('готовность заказа: нужны формат, бумага и корректное количество', () => {
  const validQuantity = validateQuantity('10')

  assert.equal(isOrderComplete({ formatId: null, paperId: null, validation: validQuantity }), false)
  assert.equal(
    isOrderComplete({ formatId: '10x15', paperId: null, validation: validQuantity }),
    false,
  )
  assert.equal(
    isOrderComplete({ formatId: null, paperId: 'glossy', validation: validQuantity }),
    false,
  )
  assert.equal(
    isOrderComplete({ formatId: '10x15', paperId: 'glossy', validation: validateQuantity('') }),
    false,
  )
  assert.equal(
    isOrderComplete({ formatId: '10x15', paperId: 'glossy', validation: validateQuantity('0') }),
    false,
  )
  assert.equal(
    isOrderComplete({ formatId: '10x15', paperId: 'glossy', validation: validQuantity }),
    true,
  )
})

test('форматирование денежных значений', () => {
  const nbsp = '\u00A0'
  assert.equal(formatRubles(18), '18 ₽')
  assert.equal(formatRubles(1146.6), `1${nbsp}146,60 ₽`)
  assert.equal(formatKopecks(81000), '810 ₽')
  assert.equal(formatKopecks(7020), '70,20 ₽')
})
