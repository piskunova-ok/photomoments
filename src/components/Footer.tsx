import { NAV_LINKS } from "../data/content.ts";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__container">
        <nav className="site-footer__nav" aria-label="Навигация в подвале">
        <div className="site-footer__col">
          <h2 className="site-footer__heading">Разделы</h2>
          <ul className="site-footer__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Документы</h2>
          <ul className="site-footer__list">
            <li>
              <a href="/privacy">Политика конфиденциальности</a>
            </li>
            <li>
              <a href="/offer">Публичная оферта</a>
            </li>
          </ul>
        </div>
      </nav>
      </div>
    </footer>
  );
}
