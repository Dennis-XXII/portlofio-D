import AnimatedSection from "./AnimatedSection";
import { projects } from "../data";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import "../projects.css";
import StorytellingCard from "../bits/StoryCard";

export default function Projects({ setActive }) {
	const { ref: startRef, inView: startInView } = useInView({
		threshold: 0.3,
	});
	const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

	useEffect(() => {
		if (startInView) setActive("projects");
		if (endInView) setActive("projects"); // switch to next section when bottom enters
	}, [startInView, endInView, setActive]);

	const [currentIndex, setCurrentIndex] = useState(0);

	const handleDotClick = (index) => {
		setCurrentIndex(index);
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % projects.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
	};

	return (
		<section id="projects" className="section">
			<div className="container">
				<p ref={startRef} />
				<StorytellingCard
					title="Every project tells a story"
					subtitle="And here are mine"
					align="left"
					theme="dark"
				/>

				<div className="stack-gap">
					<AnimatedSection key={currentIndex} delay={currentIndex * 0.08}>
						<div className="projects-card">
							<div className="projects-image-wrapper">
								<img
									src={projects[currentIndex].image}
									alt={projects[currentIndex].imgAlt}
									className="projects-img"
								/>
								<div className="projects-overlay"></div>
							</div>
							<div className="projects-content">
								<div className="projects-header">
									<div>
										<h3 className="h3">{projects[currentIndex].title}</h3>
										<span className="projects-title">
											{projects[currentIndex].brief}
										</span>
									</div>
									<span className="projects-years">
										{projects[currentIndex].year}
									</span>
								</div>
								<p className="projects-description">
									{projects[currentIndex].description}
								</p>
								<div className="projects-footer">
									{projects[currentIndex].link && (
										<a
											className="projects-link"
											href={projects[currentIndex].link}
											target="_blank"
											rel="noopener noreferrer">
											Visit Website
										</a>
									)}
									{projects[currentIndex].repo && (
										<a
											className="projects-link"
											href={projects[currentIndex].repo}
											target="_blank"
											rel="noopener noreferrer">
											Visit Repository
										</a>
									)}
								</div>
							</div>
						</div>
					</AnimatedSection>
					<AnimatedSection delay={0.1}>
						<div className="projects-navigation">
							<button onClick={handlePrev} aria-label="Previous Project">
								&#8592; Prev
							</button>
							<div className="projects-dots">
								{projects.map((_, index) => (
									<span
										key={index}
										className={`dot ${index === currentIndex ? "active" : ""}`}
										onClick={() => handleDotClick(index)}
										aria-label={`Go to project ${index + 1}`}></span>
								))}
							</div>
							<button onClick={handleNext} aria-label="Next Project">
								Next &#8594;
							</button>
						</div>
					</AnimatedSection>
				</div>
				<p ref={endRef} />
			</div>
		</section>
	);
}
