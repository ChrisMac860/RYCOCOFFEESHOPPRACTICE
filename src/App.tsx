import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  business,
  galleryItems,
  menuGroups,
  menuPhotoFeatures,
  navItems,
  openingHours,
  type GalleryItem,
  type MenuPhotoFeature
} from "./data/siteContent";

const desktopQuery = "(min-width: 900px)";

const desktopSections = [
  { label: "Home", href: "/#home", id: "home", route: "/" },
  { label: "Menu", href: "/#menu", id: "menu", route: "/menu" },
  { label: "About", href: "/#about", id: "about", route: "/about" },
  { label: "Visit", href: "/#visit", id: "visit", route: "/visit" },
  { label: "Gallery", href: "/#gallery", id: "gallery", route: "/gallery" },
  { label: "Contact", href: "/#contact", id: "contact", route: "/contact" }
];

const desktopRouteToSection = new Map(desktopSections.map((section) => [section.route, section.id]));

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && "matchMedia" in window ? window.matchMedia(desktopQuery).matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return undefined;
    }

    const media = window.matchMedia(desktopQuery);
    const syncDesktopState = () => setIsDesktop(media.matches);

    syncDesktopState();

    if (media.addEventListener) {
      media.addEventListener("change", syncDesktopState);
      return () => media.removeEventListener("change", syncDesktopState);
    }

    media.addListener?.(syncDesktopState);
    return () => media.removeListener?.(syncDesktopState);
  }, []);

  return isDesktop;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    if (!isDesktop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isDesktop, location.pathname]);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    const routeSection = desktopRouteToSection.get(location.pathname);

    if (location.pathname !== "/" && routeSection) {
      navigate({ pathname: "/", hash: `#${routeSection}` }, { replace: true });
      return;
    }

    if (location.pathname !== "/") {
      return;
    }

    const targetId = location.hash.replace("#", "") || "home";
    const scrollToSection = () => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView?.({ block: "start" });
    };

    if ("requestAnimationFrame" in window) {
      window.requestAnimationFrame(scrollToSection);
    } else {
      scrollToSection();
    }
  }, [isDesktop, location.hash, location.pathname, navigate]);

  return (
    <div className="site-shell">
      <Header
        isDesktop={isDesktop}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onNavigate={() => setMenuOpen(false)}
      />
      <main id="main">
        {isDesktop ? (
          <DesktopScrollPage />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/visit" element={<VisitPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        )}
      </main>
      {!isDesktop && <Footer />}
    </div>
  );
}

type HeaderProps = {
  isDesktop: boolean;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigate: () => void;
};

function Header({ isDesktop, menuOpen, onMenuToggle, onNavigate }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="header-grid">
        <Link className="brand-mark" to={isDesktop ? "/#home" : "/"} onClick={onNavigate} aria-label="RYCO home">
          <img src="/images/ryco-official-logo-cropped.png" alt="" />
        </Link>
        {!isDesktop && (
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={onMenuToggle}
          >
            <span />
            <span />
          </button>
        )}
        <nav id="site-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Primary navigation">
          {isDesktop
            ? desktopSections.map((section) => (
                <Link
                  key={section.id}
                  to={section.href}
                  onClick={onNavigate}
                  className={(location.hash || "#home") === `#${section.id}` ? "active" : undefined}
                >
                  {section.label}
                </Link>
              ))
            : navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onNavigate}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  {item.label}
                </NavLink>
              ))}
        </nav>
        <a className="header-call" href={business.phoneHref} aria-label={`Call ${business.phoneDisplay}`}>
          Call
        </a>
      </div>
    </header>
  );
}

function DesktopScrollPage() {
  return (
    <div className="desktop-scroll-page">
      <DesktopHomeSection />
      <DesktopMenuSection />
      <DesktopAboutSection />
      <DesktopVisitSection />
      <DesktopGallerySection />
      <DesktopContactSection />
    </div>
  );
}

function DesktopHomeSection() {
  return (
    <section id="home" className="desktop-section desktop-home page-grid" data-animate>
      <div className="desktop-section-number">01</div>
      <div className="desktop-home-copy">
        <p className="mono-line">30 Killyman St / Moy / BT71 7SJ</p>
        <h1>RYCO</h1>
        <p className="hero-statement">
          Coffee, acai bowls, smoothies, traybakes and toasties from a bright local coffee house in the Moy.
        </p>
        <div className="action-row">
          <Link className="text-action" to="/#menu">
            See menu
          </Link>
          <Link className="text-action muted" to="/#visit">
            Visit
          </Link>
        </div>
      </div>
      <figure className="desktop-photo desktop-home-photo" tabIndex={0}>
        <img src="/images/ryco-restaurantguru-photo.jpg" alt="RYCO Coffee House blue storefront in Moy" />
        <figcaption>Open Wednesday to Monday</figcaption>
      </figure>
      <aside className="hours-panel desktop-hours" data-testid="opening-hours">
        <div className="panel-title">Opening hours</div>
        <HoursList compact />
      </aside>
    </section>
  );
}

function DesktopMenuSection() {
  return (
    <section id="menu" className="desktop-section desktop-menu-section page-grid">
      <div className="desktop-section-number">02</div>
      <div className="desktop-section-heading">
        <h2>Menu</h2>
        <p>Coffee, bowls, smoothies and counter food for sit-in mornings, quick lunches and takeaway stops in the Moy.</p>
      </div>
      <div className="desktop-menu-photos">
        {menuPhotoFeatures.map((item) => (
          <figure className="desktop-photo" key={item.src}>
            <img src={item.src} alt={item.alt} />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
      <div className="desktop-menu-list" aria-label="Ryco menu highlights">
        {menuGroups.map((group, index) => (
          <article key={group.title}>
            <p className="mono-line">{String(index + 1).padStart(2, "0")}</p>
            <h3>{group.title}</h3>
            <p>{group.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DesktopAboutSection() {
  return (
    <section id="about" className="desktop-section desktop-about-section page-grid">
      <div className="desktop-section-number">03</div>
      <div className="desktop-section-heading">
        <h2>About Ryco</h2>
        <p>A bright local coffee house on Killyman Street, serving coffee, breakfast pots, bowls and lunch bites.</p>
      </div>
      <div className="desktop-large-statement">
        <p>Designed for the everyday stop-in.</p>
      </div>
      <div className="copy-stack">
        <p>
          Regulars call in for friendly service, relaxed visits, and a coffee-and-food counter built around acai bowls,
          cortados, lattes, traybakes, smoothies and lunch-friendly toasties.
        </p>
        <p>
          The blue storefront, counter bakes and takeaway-friendly menu make Ryco easy to find and easy to use, whether you are
          sitting in or taking coffee back through the village.
        </p>
      </div>
    </section>
  );
}

function DesktopVisitSection() {
  return (
    <section id="visit" className="desktop-section desktop-visit-section page-grid">
      <div className="desktop-section-number">04</div>
      <div className="desktop-section-heading">
        <h2>Visit</h2>
        <p>Find Ryco on Killyman Street, close to the centre of Moy, open Wednesday to Monday.</p>
      </div>
      <div className="visit-address">
        <p className="mono-line">Address</p>
        <h3>{business.address}</h3>
        <div className="action-row">
          <a className="text-action" href={business.mapsHref} target="_blank" rel="noreferrer">
            Directions
          </a>
          <a className="text-action muted" href={business.phoneHref} aria-label={`Call ${business.phoneDisplay}`}>
            Call
          </a>
        </div>
      </div>
      <div className="hours-panel desktop-hours" data-testid="opening-hours">
        <div className="panel-title">Opening hours</div>
        <HoursList />
      </div>
      <figure className="desktop-photo desktop-visit-photo">
        <img src="/images/ryco-restaurantguru-photo.jpg" alt="RYCO blue storefront on Killyman Street" />
      </figure>
    </section>
  );
}

function DesktopGallerySection() {
  return (
    <section id="gallery" className="desktop-section desktop-gallery-section page-grid">
      <div className="desktop-section-number">05</div>
      <div className="desktop-section-heading">
        <h2>Gallery</h2>
        <p>Storefront, coffee, bowls and house favourites from the Ryco counter and Killyman Street.</p>
      </div>
      <GalleryGrid items={galleryItems} />
    </section>
  );
}

function DesktopContactSection() {
  return (
    <section id="contact" className="desktop-section desktop-contact-section page-grid">
      <div className="desktop-section-number">06</div>
      <div className="desktop-section-heading">
        <h2>Contact</h2>
        <p>Call ahead, check the socials, or get directions straight to 30 Killyman Street.</p>
      </div>
      <div className="contact-primary">
        <p className="mono-line">RYCO Coffee House</p>
        <h3>{business.address}</h3>
        <p>For the latest counter specials and daily updates, use Ryco's social profiles or call the shop directly.</p>
      </div>
      <div className="contact-actions">
        <a href={business.phoneHref} aria-label={`Call ${business.phoneDisplay}`}>
          Call
          <span>{business.phoneDisplay}</span>
        </a>
        <a href={business.mapsHref} target="_blank" rel="noreferrer">
          Directions
          <span>Google Maps</span>
        </a>
        <a href={business.instagramHref} target="_blank" rel="noreferrer">
          Instagram
          <span>@ryco_coffee_house</span>
        </a>
        <a href={business.facebookHref} target="_blank" rel="noreferrer">
          Facebook
          <span>RYCO Coffee House</span>
        </a>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero-section page-grid" data-animate>
        <div className="hero-copy">
          <p className="mono-line">30 Killyman St / Moy / BT71 7SJ</p>
          <h1>RYCO</h1>
          <p className="hero-statement">
            Coffee, acai bowls, smoothies, traybakes and toasties from a bright local coffee house in the Moy.
          </p>
          <div className="action-row">
            <Link className="text-action" to="/menu">
              See menu
            </Link>
            <a className="text-action muted" href={business.mapsHref} target="_blank" rel="noreferrer">
              Directions
            </a>
          </div>
        </div>
        <figure className="hero-image-block" tabIndex={0}>
          <img src="/images/ryco-restaurantguru-photo.jpg" alt="RYCO Coffee House blue storefront in Moy" />
          <figcaption>Open Wednesday to Monday</figcaption>
        </figure>
        <aside className="hours-panel" data-testid="opening-hours">
          <div className="panel-title">Opening hours</div>
          <HoursList compact />
        </aside>
      </section>
      <SectionIntro
        number="01"
        title="Cafe rhythm"
        copy="Start with coffee, stay for breakfast, or lift something fresh from the counter for the road."
      />
      <MenuStrip />
      <ImageStatement />
    </>
  );
}

function MenuPage() {
  return (
    <PageFrame
      number="02"
      title="Menu"
      intro="Coffee, bowls, smoothies and counter food for sit-in mornings, quick lunches and takeaway stops in the Moy."
    >
      <MenuPhotoRail items={menuPhotoFeatures} />
      <MenuGrid />
    </PageFrame>
  );
}

function AboutPage() {
  return (
    <PageFrame
      number="03"
      title="About Ryco"
      intro="A bright local coffee house on Killyman Street, serving coffee, breakfast pots, bowls and lunch bites."
    >
      <section className="split-band">
        <div>
          <p className="mono-line">Coffee / Breakfast / Takeaway</p>
          <h2>Designed for the everyday stop-in.</h2>
        </div>
        <div className="copy-stack">
          <p>
            Regulars call in for friendly service, relaxed visits, and a coffee-and-food counter built around acai bowls,
            cortados, lattes, traybakes, smoothies and lunch-friendly toasties.
          </p>
          <p>
            The blue storefront, counter bakes and takeaway-friendly menu make Ryco easy to find and easy to use, whether you are
            sitting in or taking coffee back through the village.
          </p>
        </div>
      </section>
    </PageFrame>
  );
}

function VisitPage() {
  return (
    <PageFrame
      number="04"
      title="Visit"
      intro="Find Ryco on Killyman Street, close to the centre of Moy, open Wednesday to Monday."
    >
      <section className="visit-grid">
        <div className="visit-address">
          <p className="mono-line">Address</p>
          <h2>{business.address}</h2>
          <div className="action-row">
            <a className="text-action" href={business.mapsHref} target="_blank" rel="noreferrer">
              Directions
            </a>
            <a className="text-action muted" href={business.phoneHref} aria-label={`Call ${business.phoneDisplay}`}>
              Call
            </a>
          </div>
        </div>
        <div className="hours-panel large" data-testid="opening-hours">
          <div className="panel-title">Opening hours</div>
          <HoursList />
        </div>
      </section>
    </PageFrame>
  );
}

function GalleryPage() {
  return (
    <PageFrame
      number="05"
      title="Gallery"
      intro="Storefront, coffee, bowls and house favourites from the Ryco counter and Killyman Street."
    >
      <GalleryGrid items={galleryItems} />
    </PageFrame>
  );
}

function ContactPage() {
  return (
    <PageFrame
      number="06"
      title="Contact"
      intro="Call ahead, check the socials, or get directions straight to 30 Killyman Street."
    >
      <section className="contact-grid">
        <div className="contact-primary">
          <p className="mono-line">RYCO Coffee House</p>
          <h2>{business.address}</h2>
          <p>For the latest counter specials and daily updates, use Ryco's social profiles or call the shop directly.</p>
        </div>
        <div className="contact-actions">
          <a href={business.phoneHref} aria-label={`Call ${business.phoneDisplay}`}>
            Call
            <span>{business.phoneDisplay}</span>
          </a>
          <a href={business.mapsHref} target="_blank" rel="noreferrer">
            Directions
            <span>Google Maps</span>
          </a>
          <a href={business.instagramHref} target="_blank" rel="noreferrer">
            Instagram
            <span>@ryco_coffee_house</span>
          </a>
          <a href={business.facebookHref} target="_blank" rel="noreferrer">
            Facebook
            <span>RYCO Coffee House</span>
          </a>
        </div>
      </section>
    </PageFrame>
  );
}

type PageFrameProps = {
  number: string;
  title: string;
  intro: string;
  children: ReactNode;
};

function PageFrame({ number, title, intro, children }: PageFrameProps) {
  return (
    <>
      <section className="page-heading page-grid" data-animate>
        <p className="section-number">{number}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      {children}
    </>
  );
}

function SectionIntro({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <section className="section-intro page-grid" data-animate>
      <p className="section-number">{number}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </section>
  );
}

function MenuStrip() {
  const featured = useMemo(() => menuGroups.slice(0, 4), []);

  return (
    <section className="menu-strip" aria-label="Menu highlights">
      {featured.map((group, index) => (
        <Link className="menu-row" to="/menu" key={group.title} style={{ "--row-index": index } as CSSProperties}>
          <span>{group.title}</span>
          <small>{group.note}</small>
        </Link>
      ))}
    </section>
  );
}

function MenuPhotoRail({ items }: { items: MenuPhotoFeature[] }) {
  return (
    <section className="menu-photo-rail" aria-label="Menu photos">
      {items.map((item, index) => (
        <figure className="menu-photo-item" key={item.src} style={{ "--row-index": index } as CSSProperties}>
          <div className="menu-photo-frame">
            <img src={item.src} alt={item.alt} loading="eager" />
          </div>
          <figcaption>
            <span>{item.label}</span>
            <p>{item.note}</p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

function MenuGrid() {
  return (
    <section className="menu-grid" aria-label="Ryco menu highlights">
      {menuGroups.map((group, index) => (
        <article className="menu-item" key={group.title} style={{ "--row-index": index } as CSSProperties}>
          <p className="mono-line">{String(index + 1).padStart(2, "0")}</p>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{group.note}</p>
        </article>
      ))}
    </section>
  );
}

function ImageStatement() {
  return (
    <section className="image-statement page-grid" data-animate>
      <figure>
        <img src="/images/ryco-restaurantji-photo.jpg" alt="RYCO acai bowl, coffee, and storefront collage" />
      </figure>
      <div>
        <p className="mono-line">Coffee / Acai / Takeaway</p>
        <h2>Morning coffee. Counter food. Village pace.</h2>
        <p>
          Ryco keeps the essentials close: a good cup, something fresh to eat, and a bright stop in the middle of the Moy.
        </p>
      </div>
    </section>
  );
}

function HoursList({ compact = false }: { compact?: boolean }) {
  return (
    <dl className={compact ? "hours-list compact" : "hours-list"}>
      {openingHours.map((entry) => (
        <div key={entry.day} className={entry.time === "Closed" ? "is-closed" : undefined}>
          <dt>{entry.day}</dt>
          <dd>{entry.time}</dd>
        </div>
      ))}
    </dl>
  );
}

function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <section className="gallery-grid">
      {items.map((item, index) => (
        <figure className="gallery-item" key={item.src} style={{ "--row-index": index } as CSSProperties}>
          <img src={item.src} alt={item.alt} loading={index > 1 ? "lazy" : "eager"} />
          <figcaption>{item.label}</figcaption>
        </figure>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer page-grid">
      <div>
        <p>{business.shortName}</p>
        <small>{business.address}</small>
      </div>
      <div className="footer-links">
        <a href={business.instagramHref} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={business.facebookHref} target="_blank" rel="noreferrer">
          Facebook
        </a>
      </div>
    </footer>
  );
}

export default App;
