import AnimatedSection from "./AnimatedSection";
import {
	skills,
	softSkills,
	languages,
	education,
	achievements,
	certifications,
} from "../data";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { hobbies } from "../data.js";
import StorytellingCard from "../bits/StoryCard.jsx";

export default function About({ setActive }) {
	//start and end refs for inView detection
	const { ref: startRef, inView: startInView } = useInView({
		threshold: 0.3,
	});
	const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

	const [hoveredCaption, setHoveredCaption] = useState("");

	const trackRef = useRef(null);

	const pauseTrack = () => {
		if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
	};
	const resumeTrack = () => {
		if (trackRef.current) trackRef.current.style.animationPlayState = "running";
	};

	useEffect(() => {
		if (startInView) setActive("about");
		if (endInView) setActive("about"); // switch to next section when bottom enters
	}, [startInView, endInView, setActive]);

	return (
		<section id="about" className="section">
			<div className="container">
				{/* subtle heading */}
				<StorytellingCard
					title="About me"
					subtitle="& my background"
					align="left"
					theme="dark"
				/>
				<p ref={startRef} />

				{/* Education */}
				<h2 className="h2">Education</h2>
				{education.map((edu, i) => (
					<AnimatedSection key={i} delay={i * 0.08}>
						<div className="kv">
							<div>
								<p className="headerP">
									{edu.degree} – {edu.institution}
								</p>
								<p style={{ maxWidth: "900px" }}>Remark: {edu.remarks}</p>
							</div>
							<div>{edu.years}</div>
						</div>
					</AnimatedSection>
				))}

				{/* achievements
				<h2 className="h2" style={{ marginTop: "100px" }}>
					Achievements
				</h2>
				{achievements.map((ach, i) => (
					<AnimatedSection key={i} delay={i * 0.08}>
						<div className="kv">
							<div>
								<p className="headerP">
									{ach.title} - {ach.provider}
								</p>
								<p style={{ maxWidth: "900px" }}>{ach.description}</p>
							</div>
							<div>{ach.year}</div>
						</div>
					</AnimatedSection>
				))}  */}

				{/* Certifications
				<h2 className="h2" style={{ marginTop: "100px" }}>
					Certifications
				</h2>
				{certifications.map((cert, i) => (
					<AnimatedSection key={i} delay={i * 0.08}>
						<div className="kv">
							<div>
								<p className="headerP">
									{cert.title} - {cert.provider}
								</p>
								<p style={{ maxWidth: "900px" }}>{cert.description}</p>
							</div>
							<div>{cert.year}</div>
						</div>
					</AnimatedSection>
				))}  */}

				{/* Skills + Languages */}
				<div className="grid-3" style={{ marginTop: 100 }}>
					<AnimatedSection>
						<h2 className="h2">Hard Skills</h2>
						<ul className="ul">
							{skills.map((s, i) => (
								<li key={i}>{s}</li>
							))}
						</ul>
					</AnimatedSection>

					<AnimatedSection delay={0.06}>
						<h2 className="h2">Soft Skills</h2>
						<ul className="ul">
							{softSkills.map((s, i) => (
								<li key={i}>{s}</li>
							))}
						</ul>
					</AnimatedSection>

					<AnimatedSection delay={0.06}>
						<h2 className="h2">Languages</h2>
						<ul className="ul">
							{languages.map((l, i) => (
								<li key={i}>{l}</li>
							))}
						</ul>
					</AnimatedSection>
				</div>

				{/* <AnimatedSection delay={0.12}>
					<h3 className="h3" style={{ marginTop: 100 }}>
						Hobbies
					</h3>

					<div
						className="carousel-outer"
						onMouseEnter={pauseTrack}
						onMouseLeave={resumeTrack}
						onTouchStart={pauseTrack}
						onTouchEnd={resumeTrack}>
						<div className="carousel-viewport">
							<div className="carousel-track" ref={trackRef}>
								{[...hobbies, ...hobbies].map((hobby, i) => (
									<motion.div
										key={i}
										className="carousel-item"
										whileHover={{ scale: 1.005 }}
										transition={{
											type: "tween",
											stiffness: 400,
											damping: 15,
										}}
										onMouseEnter={() => setHoveredCaption(hobby.desc)}
										onMouseLeave={() => setHoveredCaption("")}>
										<motion.img
											src={hobby.img}
											alt={hobby.caption}
											className="carousel-img"
											whileHover={{
												aspectRatio: "3/3.5",
											}}
											transition={{
												type: "tween",
												stiffness: 250,
												damping: 15,
											}}
										/>
										<p className="carousel-caption">{hobby.caption}</p>
									</motion.div>
								))}
							</div>
						</div>

						<div className="carousel-description-bar">
							{hoveredCaption && <p>{hoveredCaption}</p>}
						</div>
					</div>
				</AnimatedSection> */}
				<p ref={endRef} />
			</div>
		</section>
	);
}
