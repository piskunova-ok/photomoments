import { ADVANTAGES } from '../data/content.ts'
import { Icon } from './Icon.tsx'
import { Reveal } from './Reveal.tsx'

export function Advantages() {
  return (
    <section className="section advantages" id="advantages">
      <div className="container">
        <Reveal className="section__head">
          <p className="section__eyebrow">Почему мы</p>
          <h2 className="section__title">Печать, к которой хочется вернуться</h2>
          <p className="section__lead">
            Мы заботимся о качестве отпечатка и о том, насколько просто оформить заказ.
            Вот что получает каждый клиент.
          </p>
        </Reveal>

        <ul className="advantages__grid">
          {ADVANTAGES.map((item, index) => (
            <li className="advantage" key={item.id}>
              <Reveal delayMs={index * 60}>
                <span className="advantage__icon">
                  <Icon name={item.icon} />
                </span>
                <h3 className="advantage__title">{item.title}</h3>
                <p className="advantage__text">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
