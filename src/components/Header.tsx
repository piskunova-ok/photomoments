import { useEffect, useState } from 'react'

import { NAV_LINKS } from '../data/content.ts'
import { Icon } from './Icon.tsx'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="logo" href="#top" aria-label="ФотоМоменты — на главную">
          <span className="logo__mark" aria-hidden="true">
            ФМ
          </span>
          <span className="logo__text">
            Фото<span className="logo__accent">Моменты</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Основная навигация">
          <ul className="site-nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a className="site-nav__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--primary btn--sm site-header__cta" href="#calculator">
            <Icon name="calculator" />
            <span>Рассчитать стоимость</span>
          </a>

          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}
        hidden={!menuOpen}
      >
        <nav aria-label="Мобильная навигация">
          <ul className="mobile-nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="mobile-nav__link"
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
