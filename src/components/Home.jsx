import { useEffect, useRef, useCallback } from "react";
import { m as Motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useInView } from "react-intersection-observer";
import TiltedCard from "../bits/TiltedCard";
import VariableProximity from "../bits/ProximityParagraph";

export default function Home({ setActive }) {
	// Track when the Home section is in view for active nav
	const { ref: inViewRef, inView } = useInView({ threshold: 0.6 });
	useEffect(() => {
		if (inView) setActive("home");
	}, [inView, setActive]);

	// Track scrolling progress to fade out arrow + text
	const sectionRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const fadeOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
	const fadeScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);

	// Click scroll
	const goToExperience = useCallback((e) => {
		e.preventDefault();
		const el = document.getElementById("experience");
		if (!el) return;
		const navH =
			parseInt(
				getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
			) || 68;
		const y = el.getBoundingClientRect().top + window.scrollY - (navH + 12);
		window.scrollTo({ top: y, behavior: "smooth" });
	}, []);

	// container reference for variable proximity

	const containerRef = useRef(null);

	return (
		<section
			id="home"
			ref={(node) => {
				sectionRef.current = node;
				inViewRef(node);
			}}
			className="section section--fullscreen home-section"
			style={{ padding: "100px 0", marginTop: "-15px" }}>
			<div className="container">
				<div className="media_home">
					<AnimatedSection delay={0.1}>
						<TiltedCard
							imageSrc="/dennis.webp"
							imageAlt="Portrait of Kyaw Swar Hein"
							containerHeight="250px"
							containerWidth="250px"
							imageHeight="250px"
							imageWidth="250px"
							rotateAmplitude={12}
							scaleOnHover={1.05}
							showMobileWarning={false}
							whileHover={{
								boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
							}}
						/>
					</AnimatedSection>

					<AnimatedSection delay={0.1} className="text_box">
						<h1 className="h1" style={{ fontWeight: "200" }}>
							Hello, I’m{" "}
							<Motion.span
								whileHover={{ letterSpacing: "2px" }}
								transition={{
									type: "spring",
									stiffness: 180,
									damping: 12,
								}}
								style={{
									color: "var(--brand)",
									fontWeight: "600",
								}}>
								Kyaw Swar Hein
							</Motion.span>
							.
						</h1>
						<div
							ref={containerRef}
							style={{
								position: "relative",
								maxWidth: 800,
								marginInline: "auto",
							}}>
							<VariableProximity
								label={
									"A Full-stack developer with a designer's eye. I specialize in turning complex problems into refined, user-centric digital realities. Brutalist minimalism drive my design philosophy."
								}
								className={"variable-proximity-demo"}
								fromFontVariationSettings="'wght' 200, 'opsz' 9"
								toFontVariationSettings="'wght' 800, 'opsz' 40"
								containerRef={containerRef}
								radius={70}
								falloff="gaussian"
							/>
						</div>

						<div
							style={{
								display: "flex",
								gap: 12,
								margin: "12px 0 12px",
								justifyContent: "center",
							}}>
							<Motion.a
								whileTap={{ scale: 0.95 }}
								className="btn"
								href="/Kyaw Swar Hein.pdf"
								download="Kyaw Swar Hein.pdf"
								target="_blank"
								rel="noopener noreferrer">
								Download my Resume
							</Motion.a>
							<Motion.a
								whileTap={{ scale: 0.95 }}
								className="btn btn--ghost"
								href="#contact">
								Contact me
							</Motion.a>
						</div>
					</AnimatedSection>
				</div>

				{/* Text + Arrow together at bottom */}
				<Motion.div
					className="scroll-block"
					style={{ opacity: fadeOpacity, scale: fadeScale }}>
					<p className="scroll-text">
						You can get to know me better below. Let's scroll down!
					</p>
					<Motion.button
						whileTap={{ scale: 0.9 }}
						type="button"
						aria-label="Scroll to next section"
						className="scroll-down"
						onClick={goToExperience}>
						<Motion.svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							initial={{ y: 0 }}
							animate={{ y: [0, 6, 0] }}
							transition={{
								duration: 1.3,
								repeat: Infinity,
								ease: "easeInOut",
							}}>
							<path
								d="M6 9l6 6 6-6"
								stroke="#fff"
								strokeWidth="2.25"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Motion.svg>
					</Motion.button>
				</Motion.div>
			</div>
		</section>
	);
}
