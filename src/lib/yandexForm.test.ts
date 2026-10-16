import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCalculatorPayload, buildYandexFormUrl, YANDEX_FORM_CONFIG } from './yandexForm.ts'

test('sum is passed with cents precision', () => {
  const payload = buildCalculatorPayload({
    formatId: '10x15',
    paperId: 'glossy',
    quantity: 1,
    urgent: false,
    result: {
      unitPriceKopecks: 1533,
      baseCostKopecks: 1533,
      discountPercent: 0,
      discountKopecks: 0,
      subtotalKopecks: 1533,
      urgentPercent: 0,
      urgentSurchargeKopecks: 0,
      totalKopecks: 1533,
      averagePerPhotoKopecks: 1533,
    },
  })
  assert.equal(payload.totalRubles, '15.33')
  const url = buildYandexFormUrl(payload, YANDEX_FORM_CONFIG)
  assert.ok(url)
  assert.ok(url.includes('answer_short_text_9008991348098040=15.33'))
})

test('integer sum becomes integer string without trailing zeros', () => {
  const payload = buildCalculatorPayload({
    formatId: '10x15',
    paperId: 'glossy',
    quantity: 50,
    urgent: false,
    result: {
      unitPriceKopecks: 1800,
      baseCostKopecks: 90000,
      discountPercent: 10,
      discountKopecks: 9000,
      subtotalKopecks: 81000,
      urgentPercent: 0,
      urgentSurchargeKopecks: 0,
      totalKopecks: 81000,
      averagePerPhotoKopecks: 1620,
    },
  })
  assert.equal(payload.totalRubles, '810')
  const url = buildYandexFormUrl(payload, YANDEX_FORM_CONFIG)
  assert.ok(url)
  assert.ok(url.includes('answer_short_text_9008991348098040=810'))
})
