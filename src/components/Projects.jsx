import AnimatedSection from "./AnimatedSection";
import { projects } from "../data";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import "../exp.css";
import StorytellingCard from "../bits/StoryCard";

export default function Projects({ setActive }) {
	const { ref, inView } = useInView({ threshold: 0.5 });

	useEffect(() => {
		if (inView) setActive("projects");
	}, [inView, setActive]);

	return (
		<section id="projects" className="section">
			<div className="container">
				<StorytellingCard
					title="Every Project Tells a Story"
					subtitle="And here are mine"
					align="right"
					theme="dark"
					ref={ref}
				/>

				<div className="stack-gap">
					{projects.map((p, i) => (
						<AnimatedSection key={i} delay={i * 0.08}>
							<div className="experience-card">
								<div className="experience-image-wrapper">
									<img
										src={p.image}
										alt={p.imgAlt}
										className="experience-img"
									/>
									<div className="experience-overlay"></div>
								</div>
								<div className="experience-content">
									<div className="experience-header">
										<div>
											<h3 className="h3">{p.title}</h3>
											<span className="experience-title">{p.brief}</span>
										</div>
										<span className="experience-years">{p.year}</span>
									</div>
									<p className="experience-description">{p.description}</p>
								</div>
							</div>
						</AnimatedSection>
					))}
				</div>
			</div>
		</section>
	);
}
