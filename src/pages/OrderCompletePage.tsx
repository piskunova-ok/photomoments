import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.tsx'

export default function OrderCompletePage() {
  return (
    <main id="main" className="page page--center">
      <div className="container page__container">
        <div className="order-complete">
          <div className="order-complete__icon" aria-hidden="true">
            <Icon name="check" />
          </div>
          <h1 className="page__title">Заказ оформлен</h1>
          <p className="page__lead">
            Спасибо за ваш заказ! Мы получили вашу заявку и свяжемся с вами
            для подтверждения деталей.
          </p>
          <p className="order-complete__text">
            Параметры заказа (формат, бумага, количество, срочность и сумма)
            будут учтены при обработке. Если вы указали ссылку на фотографии
            на Яндекс Диске — мы проверим её при подтверждении заказа.
          </p>
          <p className="order-complete__text order-complete__text--muted">
            Эта страница показывается после успешной отправки формы. Если вы
            попали сюда напрямую — вы всегда можете вернуться на главную.
          </p>
          <Link to="/" className="btn btn--primary btn--lg">
            <Icon name="arrowRight" />
            <span>Вернуться на главную</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
