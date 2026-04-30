// new - import useState, useEffect and framer-motion
import { useState, useEffect } from "react";
import { m as Motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experiences" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// A simple hamburger icon component
const HamburgerIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='3' y1='12' x2='21' y2='12'></line>
    <line x1='3' y1='6' x2='21' y2='6'></line>
    <line x1='3' y1='18' x2='21' y2='18'></line>
  </svg>
);

// A simple close icon component
const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </svg>
);

export default function NavBar({ active }) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Variants for the drawer animation
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: "0%", transition: { type: "tween", duration: 0.3 } },
    exit: { x: "100%", transition: { type: "tween", duration: 0.2 } },
  };

  // Variants for the overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const handleLinkClick = (e, id) => {
    // Only smooth scroll if we are on the home page and lenis is available
    if (window.location.pathname === "/" && window.lenis) {
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.lenis.scrollTo(el, { offset: 110 });
        setIsOpen(false);
        // Update hash without jumping
        history.pushState(null, null, id === "home" ? "/" : `/#${id}`);
      }
    }
  };

  return (
    <>
      <nav className='nav'>
        <div className='nav_box'>
          <div className='brand'>
            <h2>Kyaw Swar Hein</h2>
            <span className='badge'>
              <span className='badge__dot' />
              Open for work!
            </span>
          </div>

          {/* Desktop navigation */}
          <LayoutGroup id='desktop-nav-pill'>
            <div className='nav__links' role='tablist' aria-label='Sections'>
              {LINKS.map((link) => {
                const isActive = active === link.id;
                const href = link.id === "home" ? "/" : `/#${link.id}`;

                return (
                  <Link
                    key={link.id}
                    href={href}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`nav__btn ${isActive ? "is-active" : ""}`}
                    role='tab'
                    aria-selected={isActive}
                    aria-controls={link.id}
                  >
                    {isActive && (
                      <Motion.span
                        layoutId='nav-active-pill'
                        className='nav__pill'
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                        }}
                      />
                    )}
                    <span className='nav__label'>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>

          <Motion.button
            className='hamburger-btn'
            onClick={() => setIsOpen(true)}
            aria-label='Open menu'
          >
            <HamburgerIcon />
          </Motion.button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <Motion.div
              className='overlay'
              onClick={() => setIsOpen(false)}
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={overlayVariants}
            />
            <Motion.div
              className='mobile-nav'
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={drawerVariants}
            >
              <div className='mobile-nav__header'>
                <button
                  className='mobile-nav__close-btn'
                  onClick={() => setIsOpen(false)}
                  aria-label='Close menu'
                >
                  <CloseIcon />
                </button>
              </div>
              <div
                className='mobile-nav__links'
                role='menu'
                aria-label='Mobile navigation'
              >
                {LINKS.map((link) => {
                  const isActive = active === link.id;
                  const href = link.id === "home" ? "/" : `/#${link.id}`;

                  return (
                    <Link
                      key={link.id}
                      href={href}
                      onClick={(e) => {
                        handleLinkClick(e, link.id);
                        setIsOpen(false);
                      }}
                      className={`mobile-nav__link ${
                        isActive ? "is-active" : ""
                      }`}
                      role='menuitem'
                      aria-current={isActive ? "page" : undefined}
                      aria-selected={isActive}
                    >
                      <span className='mobile-nav__dot' aria-hidden='true' />
                      <span className='mobile-nav__label'>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
