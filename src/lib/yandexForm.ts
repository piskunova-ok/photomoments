/**
 * Подготовка к интеграции с Яндекс Формой (следующий этап).
 *
 * Здесь НЕТ реальных идентификаторов формы и вопросов — их нужно получить
 * после создания формы в конструкторе Яндекс Форм. Пока идентификаторы
 * пустые, форма считается неподключённой и слот под неё показывает
 * понятную заглушку.
 *
 * Документация по предзаполнению полей через GET-параметры:
 *   https://yandex.ru/support/forms/ru/pre-fill
 *   https://yandex.ru/support/forms/ru/get-params
 *   https://yandex.ru/support/forms/ru/publish
 *   https://yandex.ru/support/forms/ru/success-page
 */

import type { CalculatorResult } from './calculator.ts'
import { getFormat, getPaperType, type FormatId, type PaperId } from '../data/price.ts'

/**
 * Конфигурация интеграции. Поля заполняются на следующем этапе,
 * когда форма будет создана. Значения-примеры здесь намеренно пустые.
 */
export interface YandexFormConfig {
  /** Идентификатор опубликованной формы. */
  formId: string
  /** Базовый адрес формы (по умолчанию — официальный домен Яндекс Форм). */
  baseUrl: string
  /** Идентификаторы вопросов формы для предзаполнения. */
  questionIds: {
    format: string
    paper: string
    quantity: string
    urgency: string
    total: string
  }
  /** Прямая ссылка на опубликованную форму (если предоставлена). */
  formUrl?: string
  /** HTML-код для встраивания формы через iframe (если предоставлен Яндексом). */
  iframeHtml?: string
}

export const YANDEX_FORM_CONFIG: YandexFormConfig = {
  formId: '',
  baseUrl: 'https://forms.yandex.ru/u',
  questionIds: {
    format: '',
    paper: '',
    quantity: '',
    urgency: '',
    total: 'answer_short_text_9008991348098040',
  },
  formUrl: 'https://forms.yandex.ru/u/6ad1297e5057b299a33f8ed2/',
  iframeHtml: undefined,
}

/** Данные калькулятора, которые нужно передать в Яндекс Форму. */
export interface CalculatorPayload {
  formatId: FormatId
  formatLabel: string
  paperId: PaperId
  paperLabel: string
  quantity: number
  urgency: 'urgent' | 'normal'
  urgencyLabel: string
  totalRubles: string
}

/**
 * Собирает человекочитаемые данные заказа из выбранных параметров.
 * Эти значения затем предзаполняют поля формы через GET-параметры.
 */
export function buildCalculatorPayload(input: {
  formatId: FormatId
  paperId: PaperId
  quantity: number
  urgent: boolean
  result: CalculatorResult
}): CalculatorPayload {
  const format = getFormat(input.formatId)
  const paper = getPaperType(input.paperId)

  return {
    formatId: input.formatId,
    formatLabel: format.size,
    paperId: input.paperId,
    paperLabel: paper.title,
    quantity: input.quantity,
    urgency: input.urgent ? 'urgent' : 'normal',
    urgencyLabel: input.urgent ? 'Срочное изготовление' : 'Обычное изготовление',
    totalRubles: (() => {
      const rub = input.result.totalKopecks / 100
      // keep precision up to cents, avoid trailing .00
      return Number(rub.toFixed(2)).toString()
    })(),
  }
}

/** Проверяет, готова ли конфигурация формы к использованию. */
export function isYandexFormConfigured(config: YandexFormConfig = YANDEX_FORM_CONFIG): boolean {
  const { questionIds, formUrl, iframeHtml, formId } = config
  const hasUrlOrIframe = Boolean(formUrl || iframeHtml)
  const hasClassicConfig = Boolean(
    formId &&
      questionIds.format &&
      questionIds.paper &&
      questionIds.quantity &&
      questionIds.urgency &&
      questionIds.total,
  )
  return hasUrlOrIframe || hasClassicConfig
}

/**
 * Строит URL формы с предзаполненными параметрами.
 * Возвращает null, пока форма не сконфигурирована (реальные ID не заданы).
 */
export function buildYandexFormUrl(
  payload: CalculatorPayload,
  config: YandexFormConfig = YANDEX_FORM_CONFIG,
): string | null {
  if (!isYandexFormConfigured(config)) {
    return null
  }

  if (config.formUrl) {
    const url = new URL(config.formUrl)
    const { questionIds } = config
    if (questionIds.format) url.searchParams.set(questionIds.format, payload.formatLabel)
    if (questionIds.paper) url.searchParams.set(questionIds.paper, payload.paperLabel)
    if (questionIds.quantity) url.searchParams.set(questionIds.quantity, String(payload.quantity))
    if (questionIds.urgency) url.searchParams.set(questionIds.urgency, payload.urgencyLabel)
    if (questionIds.total) url.searchParams.set(questionIds.total, String(payload.totalRubles))
    return url.toString()
  }

  const { questionIds } = config
  if (!(config.formId && questionIds.format && questionIds.paper && questionIds.quantity && questionIds.urgency && questionIds.total)) {
    return config.formUrl ?? null
  }

  const params = new URLSearchParams({
    [questionIds.format]: payload.formatLabel,
    [questionIds.paper]: payload.paperLabel,
    [questionIds.quantity]: String(payload.quantity),
    [questionIds.urgency]: payload.urgencyLabel,
    [questionIds.total]: String(payload.totalRubles),
  })

  return `${config.baseUrl.replace(/\/$/, '')}/${config.formId}?${params.toString()}`
}

/** Возвращает HTML-код iframe для встраивания формы (если предоставлен). */
export function getYandexFormIframeHtml(config: YandexFormConfig = YANDEX_FORM_CONFIG): string | null {
  return config.iframeHtml ?? null
}
