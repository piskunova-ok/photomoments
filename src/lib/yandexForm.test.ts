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
      totalKopecks: 1533,
      discountApplied: false,
      rushApplied: false,
      discountPercent: 0,
      rushPercent: 30,
      baseKopecks: 1533,
      afterDiscountKopecks: 1533,
      afterRushKopecks: 1533,
      averagePriceKopecks: 1533,
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
      totalKopecks: 81000,
      discountApplied: true,
      rushApplied: false,
      discountPercent: 10,
      rushPercent: 30,
      baseKopecks: 90000,
      afterDiscountKopecks: 81000,
      afterRushKopecks: 81000,
      averagePriceKopecks: 1620,
    },
  })
  assert.equal(payload.totalRubles, '810')
  const url = buildYandexFormUrl(payload, YANDEX_FORM_CONFIG)
  assert.ok(url)
  assert.ok(url.includes('answer_short_text_9008991348098040=810'))
})
