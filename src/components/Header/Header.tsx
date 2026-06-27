"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

const NAV_ITEMS = [
  { label: "Gallery", href: "/" },
  { label: "Albums", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://instagram.com", icon: "📷" },
  { label: "Email", href: "mailto:hello@example.com", icon: "✉" },
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

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobile}>
          <span className={styles.logoMain}>Lyriq</span>
          <span className={styles.logoSub}>Photography</span>
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
