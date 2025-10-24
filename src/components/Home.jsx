import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useInView } from "react-intersection-observer";

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
				getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
			) || 68;
		const y = el.getBoundingClientRect().top + window.scrollY - (navH + 12);
		window.scrollTo({ top: y, behavior: "smooth" });
	}, []);

	return (
		<section
			id="home"
			ref={(node) => {
				sectionRef.current = node;
				inViewRef(node);
			}}
			className="section section--fullscreen home-section"
			style={{ padding: "100px 0" }}>
			<div className="container">
				<div className="media_home">
					<AnimatedSection delay={0.1}>
						<motion.div
							className="circle-img"
							whileHover={{ scale: 1.05 }}
							transition={{
								type: "spring",
								stiffness: 180,
								damping: 12,
							}}>
							<img src="/me.jpeg" alt="profile picture" />
						</motion.div>
					</AnimatedSection>

					<AnimatedSection delay={0.1} className="text_box">
						<h1 className="h1" style={{ fontWeight: "200" }}>
							Hello, I’m{" "}
							<motion.span
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
								Khin Thiri Myat
							</motion.span>
							.
						</h1>
						<p>
							I am an aspiring Business Student who is seeking job
							opportunities.
						</p>

						<div
							style={{
								display: "flex",
								gap: 12,
								margin: "12px 0 12px",
								justifyContent: "center",
							}}>
							<motion.a
								whileTap={{ scale: 0.95 }}
								className="btn"
								href="/my resume.pdf"
								download="Khin_Thiri_Myat_Resume.pdf"
								target="_blank"
								rel="noopener noreferrer">
								Download my CV
							</motion.a>
							<motion.a
								whileTap={{ scale: 0.95 }}
								className="btn btn--ghost"
								href="#contact">
								Contact me
							</motion.a>
						</div>

						<div
							style={{
								display: "flex",
								gap: 28,
								marginTop: 12,
								alignItems: "center",
								justifyContent: "center",
							}}>
							<motion.a
								whileTap={{ scale: 0.95 }}
								className="link"
								href="https://www.linkedin.com/in/khin-thiri-myat-73b53923a/"
								target="_blank">
								LinkedIn
							</motion.a>
							<motion.a
								whileTap={{ scale: 0.95 }}
								className="link"
								href="https://www.facebook.com/harmony.carol.5"
								target="_blank">
								Facebook
							</motion.a>
						</div>
					</AnimatedSection>
				</div>

				{/* Text + Arrow together at bottom */}
				<motion.div
					className="scroll-block"
					style={{ opacity: fadeOpacity, scale: fadeScale }}>
					<p className="scroll-text">
						This is just the tip of my iceberg. Let's scroll down!
					</p>
					<motion.button
						whileTap={{ scale: 0.9 }}
						type="button"
						aria-label="Scroll to next section"
						className="scroll-down"
						onClick={goToExperience}>
						<motion.svg
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
						</motion.svg>
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
