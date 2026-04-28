"use client";

import { useState, useCallback, lazy, Suspense, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import Home from "../components/Home";
import { LazyMotion, domMax, m as Motion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";

const Experience = lazy(() => import("../components/Experience"));
const Projects = lazy(() => import("../components/Projects"));
const About = lazy(() => import("../components/About"));
const Contact = lazy(() => import("../components/Contact"));

function SectionFallback({ id }) {
	return (
		<section id={id} className="section" aria-busy="true" aria-live="polite">
			<div className="container" style={{ minHeight: 120 }} />
		</section>
	);
}

export default function Page() {
	const [active, setActive] = useState("home");
	const lenisRef = useRef(null);

	// Initialize Lenis
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			direction: "vertical",
			gestureDirection: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			smoothTouch: false,
			touchMultiplier: 2,
			infinite: false,
		});

		lenisRef.current = lenis;
		window.lenis = lenis;

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Sync with GSAP
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			lenis.destroy();
			gsap.ticker.remove(raf);
		};
	}, []);

	// Pass setter down so each section can mark itself active when in view
	const setActiveMemo = useCallback((id) => setActive(id), []);

	// Warm section chunks in idle time so navigation still feels instant.
	useEffect(() => {
		const preloadSections = () => {
			import("../components/Experience");
			import("../components/Projects");
			import("../components/About");
			import("../components/Contact");
		};

		if ("requestIdleCallback" in window) {
			const idleId = window.requestIdleCallback(preloadSections);
			return () => window.cancelIdleCallback(idleId);
		}

		const timer = window.setTimeout(preloadSections, 1200);
		return () => window.clearTimeout(timer);
	}, []);

	return (
		<LazyMotion features={domMax}>
			<NavBar active={active} />

			{/* Order: Home > Experience > Projects > About > Contact */}
			<Home setActive={setActiveMemo} />
			<Suspense fallback={<SectionFallback id="experience" />}>
				<Experience setActive={setActiveMemo} />
			</Suspense>
			<Suspense fallback={<SectionFallback id="projects" />}>
				<Projects setActive={setActiveMemo} />
			</Suspense>
			<Suspense fallback={<SectionFallback id="about" />}>
				<About setActive={setActiveMemo} />
			</Suspense>
			<Suspense fallback={<SectionFallback id="contact" />}>
				<Contact setActive={setActiveMemo} />
			</Suspense>
			<footer className="footer" style={{ textAlign: "center" }}>
				<Motion.div className="container">
					<p>
						Designed & Built with great care using React.js & Motion
						&nbsp;|&nbsp; © Kyaw Swar Hein {new Date().getFullYear()}
					</p>
				</Motion.div>
			</footer>
		</LazyMotion>
	);
}
