import { FORMATS, PAPER_TYPES, PHOTO_PRICES_RUB } from '../data/price.ts'
import { formatRubles } from '../lib/calculator.ts'
import { FORMATS_IMAGE } from '../data/images.ts'
import { Icon } from './Icon.tsx'
import { Photo } from './Photo.tsx'
import { Reveal } from './Reveal.tsx'

export function Formats() {
  return (
    <section className="section formats" id="formats">
      <div className="container">
        <div className="formats__layout">
          <Reveal className="formats__intro">
            <p className="section__eyebrow">Форматы и бумага</p>
            <h2 className="section__title">Выберите, как будет выглядеть кадр</h2>
            <p className="section__lead">
              Четыре размера отпечатка и два типа бумаги закрывают почти любую задачу: от
              быстрых снимков для близких до крупных фотографий в интерьер.
            </p>
            <div className="formats__image">
              <Photo photo={FORMATS_IMAGE} withCaption />
            </div>
          </Reveal>

          <div className="formats__content">
            <Reveal>
              <ul className="format-cards">
                {FORMATS.map((format) => (
                  <li className="format-card" key={format.id}>
                    <span
                      className="format-card__preview"
                      style={{ aspectRatio: `${format.widthCm} / ${format.heightCm}` }}
                      aria-hidden="true"
                    />
                    <div className="format-card__body">
                      <h3 className="format-card__size">{format.size}</h3>
                      <p className="format-card__note">{format.note}</p>
                      <p className="format-card__price">
                        от {formatRubles(PHOTO_PRICES_RUB[format.id].glossy)} за фото
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delayMs={80}>
              <div className="paper-block">
                <h3 className="paper-block__title">
                  <Icon name="palette" />
                  Два типа бумаги
                </h3>
                <div className="paper-block__grid">
                  {PAPER_TYPES.map((paper) => (
                    <article className="paper-card" key={paper.id}>
                      <h4 className="paper-card__title">{paper.title}</h4>
                      <p className="paper-card__text">{paper.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={140}>
              <div className="price-table-wrap">
                <table className="price-table">
                  <caption className="price-table__caption">
                    Учебный прайс за одну фотографию
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Формат</th>
                      <th scope="col">Глянцевая</th>
                      <th scope="col">Матовая</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMATS.map((format) => (
                      <tr key={format.id}>
                        <th scope="row">{format.size}</th>
                        <td>{formatRubles(PHOTO_PRICES_RUB[format.id].glossy)}</td>
                        <td>{formatRubles(PHOTO_PRICES_RUB[format.id].matte)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="price-table__note">
                  Цены приведены для примера и не являются тарифами действующей компании.
                  Скидка и надбавка за срочность рассчитываются в калькуляторе.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
