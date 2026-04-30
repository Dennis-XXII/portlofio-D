import AnimatedSection from "./AnimatedSection";
import "../exp.css";
import StorytellingCard from "../bits/StoryCard";
import { usePortfolio } from "./PortfolioContext";

export default function Experience({ initialData }) {
	const { experiences, loading } = usePortfolio();
	
	// Priority: Hydrated Context > SSR Props > Loading State
	const data = experiences || initialData;
	const isLoading = loading.initial && !data;

	return (
		<section id="experience" className="section" style={{ minHeight: "400px" }}>
			<div className="container">
				<StorytellingCard
					title="Experiences"
					subtitle="Over the years"
					align="left"
					theme="dark"
				/>

				<div className="experience-timeline">
					{isLoading ? (
						// Skeletons
						[1, 2, 3].map((n) => (
							<div key={n} className="timeline-item skeleton" style={{ height: "180px" }}>
								<div className="timeline-dot" />
								<div className="timeline-card" />
							</div>
						))
					) : (
						data?.map((exp, i) => (
							<AnimatedSection key={exp.id || i} delay={i * 0.08}>
								<div className="timeline-item">
									<div className="timeline-year">{exp.years.split(" - ")[0]}</div>
									
									<div className="timeline-card">
										<div className="timeline-logo-wrapper">
											<img
												src={exp.image}
												alt={exp.imgAlt || ""}
												className="timeline-logo"
												loading="lazy"
												decoding="async"
											/>
										</div>
										
										<div className="timeline-content">
											<div className="timeline-header">
												<div className="timeline-role-group">
													<h3 className="timeline-role">{exp.role}</h3>
													<span className="timeline-company">{exp.title}</span>
												</div>
												{/* We can keep the full years badge if desired, or just use the timeline-year */}
											</div>
											
											<p className="timeline-description">{exp.description}</p>
											
											{exp.link && (
												<a
													className="timeline-link"
													href={exp.link}
													target="_blank"
													rel="noopener noreferrer">
													View work &rarr;
												</a>
											)}
										</div>
									</div>
								</div>
							</AnimatedSection>
						))
					)}
				</div>
			</div>
		</section>
	);
}
