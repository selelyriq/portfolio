"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

const NAV_ITEMS = [
  { label: "Gallery", href: "/gallery" },
  { label: "Albums", href: "/projects" },
  { label: "About", href: "/about" },
];

const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://www.instagram.com/lyriqsele/", icon: "📷" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleMobile() {
    setMobileOpen((prev) => !prev);
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    closeMobile();
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={handleLogoClick}>
          <span className={styles.logoMain}>𝐿𝓎𝓇𝒾𝓆 𝒮𝑒𝓁𝑒</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation">
          <ul className={styles.nav}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    styles.navLink +
                    (isActive(href) ? " " + styles.navLinkActive : "")
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop social */}
        <span className={styles.divider} aria-hidden="true" />
        <ul className={styles.social} aria-label="Social links">
          {SOCIAL_ITEMS.map(({ label, href, icon }) => (
            <li key={label}>
              <a
                href={href}
                className={styles.socialLink}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {icon}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className={
            styles.menuToggle +
            (mobileOpen ? " " + styles.menuToggleOpen : "")
          }
          onClick={toggleMobile}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={
          styles.mobileMenu +
          (mobileOpen ? " " + styles.mobileMenuOpen : "")
        }
        aria-hidden={!mobileOpen}
      >
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={
              styles.mobileNavLink +
              (isActive(href) ? " " + styles.mobileNavLinkActive : "")
            }
            onClick={closeMobile}
          >
            {label}
          </Link>
        ))}
        <div className={styles.mobileSocialRow}>
          {SOCIAL_ITEMS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              className={styles.mobileSocialLink}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={closeMobile}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
