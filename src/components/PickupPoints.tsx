import { DEMO_DATA_NOTICE, PICKUP_POINTS } from '../data/content.ts'
import { Icon } from './Icon.tsx'
import { Reveal } from './Reveal.tsx'

export function PickupPoints() {
  return (
    <section className="section pickup" id="pickup">
      <div className="container">
        <Reveal className="section__head">
          <p className="section__eyebrow">Пункты выдачи</p>
          <h2 className="section__title">Три адреса, где вас ждут фотографии</h2>
          <p className="section__lead">
            Готовые заказы можно забрать в удобной точке города. Перед визитом дождитесь
            сообщения о готовности.
          </p>
        </Reveal>

        <ul className="pickup__grid">
          {PICKUP_POINTS.map((point, index) => (
            <li className="pickup-card" key={point.id}>
              <Reveal delayMs={index * 70}>
                <span className="pickup-card__pin" aria-hidden="true">
                  <Icon name="pin" />
                </span>
                <h3 className="pickup-card__title">{point.title}</h3>
                <address className="pickup-card__address">{point.address}</address>
                <dl className="pickup-card__meta">
                  <div>
                    <dt>
                      <Icon name="clock" /> Часы работы
                    </dt>
                    <dd>{point.hours}</dd>
                  </div>
                  <div>
                    <dt>
                      <Icon name="phone" /> Телефон
                    </dt>
                    <dd>{point.phone}</dd>
                  </div>
                </dl>
                <p className="pickup-card__landmark">{point.landmark}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delayMs={120}>
          <p className="demo-notice" role="note">
            <strong>Учебные данные.</strong> {DEMO_DATA_NOTICE}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
