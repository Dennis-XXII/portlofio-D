"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";
import NavBar from "../components/NavBar";
import Home from "../components/Home";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import About from "../components/About";
import Contact from "../components/Contact";
import { LazyMotion, domMax, m as Motion } from "framer-motion";
import Lenis from "lenis";

import { usePortfolio } from "../components/PortfolioContext";

const SECTIONS = ["home", "experience", "projects", "about", "contact"];

export default function Page() {
  const [active, setActive] = useState("home");
  const isProgrammaticScroll = useRef(false);
  const lenisRef = useRef(null);
  const { fetchInitialData } = usePortfolio();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const scrollY = window.scrollY;
      
      if (scrollY < 120) {
        setActive("home");
        return;
      }

      const viewportCenter = scrollY + window.innerHeight / 2;
      let detectedSection = "home";

      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          const bottom = top + rect.height;

          if (viewportCenter >= top && viewportCenter <= bottom) {
            detectedSection = id;
            break;
          }
        }
      }

      setActive(detectedSection);
    };

    lenis.on("scroll", handleScroll);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initial hash jump logic
    const jumpToHash = (immediate = true) => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = hash.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        isProgrammaticScroll.current = true;
        lenis.scrollTo(el, {
          immediate,
          offset: -68,
        });
        
        // If the target is a project card, set active to 'projects'
        if (SECTIONS.includes(targetId)) {
          setActive(targetId);
        } else {
          const parentSection = el.closest('section');
          if (parentSection && SECTIONS.includes(parentSection.id)) {
            setActive(parentSection.id);
          }
        }
        
        // Keep programmatic scroll true for a while to survive layout shifts
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 1000);
      }
    };

    // Run once on mount
    if (window.location.hash) {
      // Small delay to ensure initial render
      setTimeout(() => jumpToHash(true), 50);
      // Second attempt after a longer delay to account for data fetching/layout shifts
      setTimeout(() => jumpToHash(true), 600);
    }

    // Handle layout shifts (e.g. data loading in sections)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <LazyMotion features={domMax}>
      <NavBar active={active} />

      <Home />
      <Experience />
      <Projects />
      <About />
      <Contact />
      
      <footer className='footer' style={{ textAlign: "center" }}>
        <Motion.div className='container'>
          <p>
            Designed & Built with great care using NEXT.js & Motion
            &nbsp;|&nbsp; © Kyaw Swar Hein {new Date().getFullYear()}
          </p>
        </Motion.div>
      </footer>
    </LazyMotion>
  );
}
