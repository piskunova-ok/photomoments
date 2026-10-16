import { ORDER_STEPS } from '../data/content.ts'
import { ORDER_IMAGE } from '../data/images.ts'
import { Icon } from './Icon.tsx'
import { Photo } from './Photo.tsx'
import { Reveal } from './Reveal.tsx'

const STEP_ICONS = ['calculator', 'upload', 'form', 'box'] as const

export function HowToOrder() {
  return (
    <section className="section howto" id="how-to-order">
      <div className="container">
        <div className="howto__layout">
          <Reveal className="howto__media">
            <Photo photo={ORDER_IMAGE} withCaption />
          </Reveal>

          <div className="howto__content">
            <Reveal className="section__head">
              <p className="section__eyebrow">Как оформить заказ</p>
              <h2 className="section__title">Четыре шага до готовых фотографий</h2>
              <p className="section__lead">
                Никаких сложных форм и звонков. Основное вы сделаете сами за пару минут.
              </p>
            </Reveal>

            <ol className="steps">
              {ORDER_STEPS.map((step, index) => (
                <li className="step" key={step.number}>
                  <Reveal delayMs={index * 70}>
                    <span className="step__icon" aria-hidden="true">
                      <Icon name={STEP_ICONS[index]} />
                    </span>
                    <div className="step__body">
                      <h3 className="step__title">
                        <span className="step__number">Шаг {step.number}</span>
                        {step.title}
                      </h3>
                      <p className="step__text">{step.text}</p>
                      {step.number === 2 && (
                        <p className="step__extra">
                          <Icon name="upload" />
                          Совет: создайте на Яндекс Диске отдельную папку с номером заказа —
                          так мы быстрее найдём ваши файлы.
                        </p>
                      )}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
