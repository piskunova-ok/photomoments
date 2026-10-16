import { PRICING_RULES } from '../data/price.ts'
import { HERO_GALLERY, HERO_IMAGE } from '../data/images.ts'
import { Icon } from './Icon.tsx'
import { Photo } from './Photo.tsx'
import { Reveal } from './Reveal.tsx'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__content">
          <Reveal>
            <p className="hero__eyebrow">
              <span className="dot" aria-hidden="true" />
              Студия печати фотографий
            </p>
          </Reveal>

          <Reveal delayMs={60}>
            <h1 className="hero__title">
              Ваши моменты
              <br />
              <span className="hero__title-accent">на настоящей бумаге</span>
            </h1>
          </Reveal>

          <Reveal delayMs={120}>
            <p className="hero__lead">
              Печатаем фотографии форматов от 10 × 15 до 20 × 30 см на глянцевой и матовой
              бумаге. Выберите параметры в калькуляторе — стоимость посчитается моментально,
              а скидка от {PRICING_RULES.discountMinQuantity} фотографий включится сама.
            </p>
          </Reveal>

          <Reveal delayMs={180}>
            <div className="hero__actions">
              <a className="btn btn--primary btn--lg" href="#calculator">
                <Icon name="calculator" />
                <span>Рассчитать стоимость</span>
              </a>
              <a className="btn btn--ghost btn--lg" href="#formats">
                Посмотреть форматы
                <Icon name="arrowRight" />
              </a>
            </div>
          </Reveal>

          <Reveal delayMs={240}>
            <dl className="hero__stats">
              <div className="hero__stat">
                <dt>Форматы</dt>
                <dd>4</dd>
              </div>
              <div className="hero__stat">
                <dt>Типа бумаги</dt>
                <dd>2</dd>
              </div>
              <div className="hero__stat">
                <dt>Скидка от</dt>
                <dd>{PRICING_RULES.discountMinQuantity} фото</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal className="hero__media" delayMs={140}>
          <div className="hero__photo-main">
            <Photo photo={HERO_IMAGE} eager />
          </div>
          <div className="hero__collage">
            {HERO_GALLERY.map((photo, index) => (
              <div className={`hero__collage-item hero__collage-item--${index + 1}`} key={photo.id}>
                <Photo photo={photo} />
              </div>
            ))}
          </div>
          <div className="hero__badge" aria-hidden="true">
            <Icon name="sparkles" />
            <span>Глянец и мат</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
