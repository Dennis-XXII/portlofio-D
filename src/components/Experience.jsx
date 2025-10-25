import AnimatedSection from "./AnimatedSection";
import { experiences } from "../data";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import "../exp.css";
import StorytellingCard from "../bits/StoryCard";

export default function Experience({ setActive }) {
	const { ref: startRef, inView: startInView } = useInView({
		threshold: 0.3,
	});
	const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

	useEffect(() => {
		if (startInView) setActive("experience");
		if (endInView) setActive("experience"); // switch to next section when bottom enters
	}, [startInView, endInView, setActive]);

	return (
		<section id="experience" className="section">
			<div className="container">
				<StorytellingCard
					title="Experiences"
					subtitle="Over the years"
					align="left"
					theme="dark"
				/>
				<p ref={startRef}></p>

				<div className="stack-gap">
					{experiences.map((exp, i) => (
						<AnimatedSection key={i} delay={i * 0.08}>
							<div className="experience-card">
								<div className="experience-image-wrapper">
									<img
										src={exp.image}
										alt={exp.imgAlt}
										className="experience-img"
									/>
									<div className="experience-overlay"></div>
								</div>
								<div className="experience-content">
									<div className="experience-header">
										<div>
											<h3 className="h3">{exp.role}</h3>
											<span className="experience-title">{exp.title}</span>
										</div>
										<span className="experience-years">{exp.years}</span>
									</div>
									<p className="experience-description">{exp.description}</p>
								</div>
							</div>
						</AnimatedSection>
					))}
				</div>
			</div>
			<p ref={endRef}></p>
		</section>
	);
}
