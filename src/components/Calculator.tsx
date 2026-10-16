import type { CalculatorController } from '../hooks/useCalculator.ts'
import { formatKopecks, formatRubles } from '../lib/calculator.ts'
import { FORMATS, PAPER_TYPES, PRICING_RULES, QUANTITY_LIMITS } from '../data/price.ts'
import { Icon } from './Icon.tsx'

interface CalculatorProps {
  controller: CalculatorController
}

const QUANTITY_PRESETS = [10, 25, 50, 100] as const

export function Calculator({ controller }: CalculatorProps) {
  const {
    formatId,
    paperId,
    urgent,
    quantityRaw,
    quantity,
    validation,
    result,
    setFormatId,
    setPaperId,
    setUrgent,
    setQuantityRaw,
    applyPreset,
  } = controller

  const discountActive = result.discountPercent > 0

  return (
    <section className="section calculator" id="calculator">
      <div className="container">
        <div className="section__head section__head--center">
          <p className="section__eyebrow">Калькулятор</p>
          <h2 className="section__title">Посчитайте стоимость печати</h2>
          <p className="section__lead">
            Меняйте параметры — итог обновляется сразу. Цена за фото, скидка и надбавка за
            срочность считаются автоматически.
          </p>
        </div>

        <div className="calc">
          <form className="calc__controls" onSubmit={(event) => event.preventDefault()}>
            <fieldset className="calc__group">
              <legend className="calc__legend">Формат фотографии</legend>
              <div className="option-grid option-grid--format">
                {FORMATS.map((format) => (
                  <label
                    key={format.id}
                    className={`option option--format ${formatId === format.id ? 'option--checked' : ''}`}
                  >
                    <input
                      className="option__input"
                      type="radio"
                      name="calc-format"
                      value={format.id}
                      checked={formatId === format.id}
                      onChange={() => setFormatId(format.id)}
                    />
                    <span
                      className="option__preview"
                      style={{ aspectRatio: `${format.widthCm} / ${format.heightCm}` }}
                      aria-hidden="true"
                    />
                    <span className="option__label">{format.size}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="calc__group">
              <legend className="calc__legend">Тип бумаги</legend>
              <div className="option-grid option-grid--paper">
                {PAPER_TYPES.map((paper) => (
                  <label
                    key={paper.id}
                    className={`option option--paper ${paperId === paper.id ? 'option--checked' : ''}`}
                  >
                    <input
                      className="option__input"
                      type="radio"
                      name="calc-paper"
                      value={paper.id}
                      checked={paperId === paper.id}
                      onChange={() => setPaperId(paper.id)}
                    />
                    <span className="option__label">{paper.title}</span>
                    <span className="option__hint">{paper.description}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="calc__group">
              <legend className="calc__legend">Количество фотографий</legend>
              <div className="quantity">
                <button
                  type="button"
                  className="quantity__step"
                  aria-label="Уменьшить количество"
                  onClick={() => setQuantityRaw(String(Math.max(QUANTITY_LIMITS.min, quantity - 1)))}
                >
                  <Icon name="minus" />
                </button>
                <input
                  className="quantity__input"
                  id="calc-quantity"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={quantityRaw}
                  aria-describedby="calc-quantity-hint"
                  aria-invalid={!validation.valid}
                  onChange={(event) => setQuantityRaw(event.target.value)}
                />
                <button
                  type="button"
                  className="quantity__step"
                  aria-label="Увеличить количество"
                  onClick={() => setQuantityRaw(String(Math.min(QUANTITY_LIMITS.max, quantity + 1)))}
                >
                  <Icon name="plus" />
                </button>
              </div>

              <div className="quantity__presets" role="group" aria-label="Быстрый выбор количества">
                {QUANTITY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`chip ${quantity === preset ? 'chip--active' : ''}`}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset} фото
                  </button>
                ))}
              </div>

              <p
                className={`calc__hint ${validation.valid ? '' : 'calc__hint--error'}`}
                id="calc-quantity-hint"
                role={validation.valid ? undefined : 'alert'}
              >
                {validation.valid
                  ? `Скидка ${PRICING_RULES.discountPercent}% включится от ${PRICING_RULES.discountMinQuantity} фото. Введите число от ${QUANTITY_LIMITS.min} до ${QUANTITY_LIMITS.max.toLocaleString('ru-RU')}.`
                  : validation.message}
              </p>
            </fieldset>

            <fieldset className="calc__group">
              <legend className="calc__legend">Срок изготовления</legend>
              <div className="option-grid option-grid--speed">
                <label className={`option option--speed ${!urgent ? 'option--checked' : ''}`}>
                  <input
                    className="option__input"
                    type="radio"
                    name="calc-speed"
                    value="normal"
                    checked={!urgent}
                    onChange={() => setUrgent(false)}
                  />
                  <span className="option__label">Обычное</span>
                  <span className="option__hint">Без надбавки</span>
                </label>
                <label className={`option option--speed ${urgent ? 'option--checked' : ''}`}>
                  <input
                    className="option__input"
                    type="radio"
                    name="calc-speed"
                    value="urgent"
                    checked={urgent}
                    onChange={() => setUrgent(true)}
                  />
                  <span className="option__label">Срочное</span>
                  <span className="option__hint">+{PRICING_RULES.urgentSurchargePercent}% к стоимости</span>
                </label>
              </div>
            </fieldset>
          </form>

          <aside className="calc__summary" aria-live="polite" aria-label="Итоговая стоимость">
            <div className="calc__summary-head">
              <h3 className="calc__summary-title">Ваш заказ</h3>
              <p className="calc__summary-sub">
                {formatRubles(result.unitPriceKopecks / 100)} за одно фото · {quantity} шт.
              </p>
            </div>

            <dl className="calc__breakdown">
              <div className="calc__row">
                <dt>Цена за одну фотографию</dt>
                <dd>{formatKopecks(result.unitPriceKopecks)}</dd>
              </div>
              <div className="calc__row">
                <dt>
                  Базовая стоимость
                  <span className="calc__formula">
                    {formatKopecks(result.unitPriceKopecks)} × {quantity}
                  </span>
                </dt>
                <dd>{formatKopecks(result.baseCostKopecks)}</dd>
              </div>
              <div className={`calc__row ${discountActive ? 'calc__row--accent' : ''}`}>
                <dt>
                  Скидка {discountActive ? `${result.discountPercent}%` : `(от ${PRICING_RULES.discountMinQuantity} фото)`}
                </dt>
                <dd>{discountActive ? `− ${formatKopecks(result.discountKopecks)}` : '—'}</dd>
              </div>
              <div className="calc__row">
                <dt>Стоимость после скидки</dt>
                <dd>{formatKopecks(result.subtotalKopecks)}</dd>
              </div>
              <div className={`calc__row ${urgent ? 'calc__row--accent' : ''}`}>
                <dt>Срочность {urgent ? `(+${result.urgentPercent}%)` : ''}</dt>
                <dd>{urgent ? `+ ${formatKopecks(result.urgentSurchargeKopecks)}` : '—'}</dd>
              </div>
            </dl>

            <div className="calc__total">
              <span className="calc__total-label">Итого</span>
              <span className="calc__total-value">{formatKopecks(result.totalKopecks)}</span>
            </div>
            <p className="calc__average">
              В среднем {formatKopecks(result.averagePerPhotoKopecks)} за фотографию
            </p>

            <a className="btn btn--primary btn--block" href="#yandex-form">
              <Icon name="form" />
              <span>Перейти к оформлению</span>
            </a>
            <p className="calc__summary-note">
              Параметры заказа подставятся в форму автоматически.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
