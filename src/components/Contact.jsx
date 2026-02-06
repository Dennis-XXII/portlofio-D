import AnimatedSection from "./AnimatedSection";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { motion } from "motion/react";

export default function Contact({ setActive }) {
	const { ref: startRef, inView: startInView } = useInView({
		threshold: 0.3,
	});
	const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

	useEffect(() => {
		if (startInView) setActive("contact");
		if (endInView) setActive("contact"); // switch to next section when bottom enters
	}, [startInView, endInView, setActive]);

	return (
		<section id="contact" className="section section--fullscreen">
			<p ref={startRef} />
			<div className="container">
				<AnimatedSection>
					<h2 className="h2" style={{ textAlign: "center" }}>
						Find me on
					</h2>
					<div className="icons" style={{ marginTop: 22 }}>
						<motion.a
							whileHover={{ scale: 1.1 }}
							transition={{
								type: "spring",
								stiffness: 180,
								damping: 12,
							}}
							className="icon-link"
							href="https://www.linkedin.com/in/kyawswar-hein22/"
							target="_blank">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="72"
								height="72"
								viewBox="0 0 24 24"
								fill="var(--brand)">
								<path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
							</svg>
							<span
								href="https://www.linkedin.com/in/kyawswar-hein22/"
								target="_blank"
								style={{ color: "var(--brand)", textDecoration: "none" }}>
								LinkedIn
							</span>
						</motion.a>
						<motion.a
							whileHover={{ scale: 1.1 }}
							transition={{
								type: "spring",
								stiffness: 180,
								damping: 12,
							}}
							className="icon-link"
							href="https://github.com/Dennis-XXII">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="72"
								height="72"
								viewBox="0 0 432 432">
								<path
									fill="#000000"
									d="M43 3h341q18 0 30.5 12.5T427 45v342q0 17-12.5 29.5T384 429H274q-7-1-7-21v-58q0-27-15-40q44-5 70.5-27t26.5-78q0-33-22-57q11-26-2-57q-18-6-58 22q-26-7-54-7t-53 7q-18-12-32.5-17.5T107 91h-6q-12 31-2 57q-22 24-22 57q0 55 27 77.5t70 27.5q-11 10-13 29q-42 18-62-18q-12-20-33-22q-2 0-4.5.5T56 303t8 9q15 7 24 31q1 2 2 4.5t6.5 9.5t13 10.5T130 374t30-2v36q0 20-8 21H43q-18 0-30.5-12.5T0 387V45q0-17 12.5-29.5T43 3z"
								/>
							</svg>
							<span
								href="https://github.com/Dennis-XXII"
								target="_blank"
								style={{ color: "var(--brand)", textDecoration: "none" }}>
								Git Hub
							</span>
						</motion.a>
					</div>
					<p
						style={{
							textAlign: "center",
							marginTop: 32,
							color: "var(--ink-2)",
						}}>
						Email:{" "}
						<a
							href="mailto:dennis.kyawswarhein@gmail.com"
							style={{ color: "var(--brand)" }}>
							dennis.kyawswarhein@gmail.com
						</a>
					</p>
					<p
						style={{
							textAlign: "center",
							marginTop: 20,
							color: "var(--ink-2)",
						}}>
						Mobile:{" "}
						<span style={{ color: "var(--brand)" }}>(+66) 094-647-8655</span>
					</p>
					<p
						style={{
							textAlign: "center",
							marginTop: 20,
							color: "var(--ink-2)",
						}}>
						Pathum Thani, Thailand, 12000
					</p>
				</AnimatedSection>
			</div>
			<p ref={endRef} />
		</section>
	);
}
