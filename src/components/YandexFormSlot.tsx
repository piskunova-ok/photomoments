import type { CalculatorPayload } from '../lib/yandexForm.ts'
import {
  buildYandexFormUrl,
  isYandexFormConfigured,
  YANDEX_FORM_CONFIG,
} from '../lib/yandexForm.ts'
import { Icon } from './Icon.tsx'
import { Reveal } from './Reveal.tsx'
import { useEffect, useMemo, useState } from 'react'

interface YandexFormSlotProps {
  payload: CalculatorPayload | null
}

export function YandexFormSlot({ payload }: YandexFormSlotProps) {
  const configured = isYandexFormConfigured(YANDEX_FORM_CONFIG)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [frozenPayload, setFrozenPayload] = useState<CalculatorPayload | null>(null)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  const frozenFormUrl = useMemo(() => {
    if (!frozenPayload) return null
    return buildYandexFormUrl(frozenPayload, YANDEX_FORM_CONFIG)
  }, [frozenPayload])

  const hasPayloadChanged = useMemo(() => {
    if (!frozenPayload || !payload) return false
    return (
      frozenPayload.totalRubles !== payload.totalRubles ||
      frozenPayload.quantity !== payload.quantity ||
      frozenPayload.formatLabel !== payload.formatLabel ||
      frozenPayload.paperLabel !== payload.paperLabel ||
      frozenPayload.urgencyLabel !== payload.urgencyLabel
    )
  }, [frozenPayload, payload])

  useEffect(() => {
    if (isFormOpen && hasPayloadChanged) {
      setShowUpdatePrompt(true)
    } else {
      setShowUpdatePrompt(false)
    }
  }, [isFormOpen, hasPayloadChanged])

  const quantityValid = payload !== null && Number.isFinite(payload.quantity) && payload.quantity >= 1

  const openForm = () => {
    if (!payload || !quantityValid) return
    setFrozenPayload(payload)
    setIsFormOpen(true)
    setShowUpdatePrompt(false)
  }

  const updateWithCurrent = () => {
    if (!payload) return
    setFrozenPayload(payload)
    setShowUpdatePrompt(false)
  }

  const dismissUpdate = () => {
    setShowUpdatePrompt(false)
  }

  const formSrc = frozenFormUrl

  return (
    <section className="section form-slot" id="yandex-form">
      <div className="container">
        <Reveal>
          <div className="form-slot__card">
            <div className="form-slot__head">
              <span className="form-slot__icon" aria-hidden="true">
                <Icon name="form" />
              </span>
              <div>
                <p className="section__eyebrow">Оформление заказа</p>
                <h2 className="form-slot__title">Форма заказа</h2>
              </div>
            </div>

            {!configured ? (
              <>
                <p className="form-slot__text">
                  Здесь будет размещена Яндекс Форма. Параметры печати и итоговая сумма
                  подставятся в её поля автоматически.
                </p>
              </>
            ) : (
              <>
                {!isFormOpen ? (
                  <div className="form-slot__embed form-slot__embed--link">
                    {!quantityValid && payload && (
                      <p className="form-slot__note" role="alert" style={{ color: '#dc2626' }}>
                        Укажите корректное количество фотографий для оформления заказа.
                      </p>
                    )}
                    <button
                      className="btn btn--primary"
                      type="button"
                      onClick={openForm}
                      disabled={!payload || !quantityValid}
                    >
                      <Icon name="form" />
                      <span>Оформить заказ</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {showUpdatePrompt && (
                      <div
                        className="form-slot__update-prompt"
                        role="status"
                        aria-live="polite"
                        style={{
                          background: '#fef3c7',
                          border: '1px solid #f59e0b',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          marginBottom: '16px',
                        }}
                      >
                        <p className="form-slot__text" style={{ marginBottom: '8px' }}>
                          Параметры расчёта изменились. Обновить сумму в форме? Обновление может привести
                          к потере введённых данных.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button className="btn btn--primary" type="button" onClick={updateWithCurrent}>
                            Обновить расчёт в форме
                          </button>
                          <button className="btn" type="button" onClick={dismissUpdate}>
                            Не обновлять
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="form-slot__embed form-slot__embed--iframe">
                      {formSrc && (
                        <iframe
                          src={formSrc}
                          title="Яндекс Форма"
                          width="100%"
                          height="600"
                          loading="lazy"
                          style={{ border: 0, width: '100%', minHeight: '600px' }}
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}