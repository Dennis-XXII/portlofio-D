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

				<div className="stack-gap">
					{isLoading ? (
						// Skeletons
						[1, 2, 3].map((n) => (
							<div key={n} className="experience-card skeleton" style={{ height: "180px" }}>
								<div className="experience-image-wrapper" />
								<div className="experience-content" />
							</div>
						))
					) : (
						data?.map((exp, i) => (
							<AnimatedSection key={exp.id || i} delay={i * 0.08}>
								<div className="experience-card">
									<div className="experience-image-wrapper">
										<img
											src={exp.image}
											alt={exp.imgAlt || ""}
											className="experience-img"
											loading="lazy"
											decoding="async"
											width="640"
											height="640"
											sizes="(max-width: 768px) 120px, 200px"
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
										{exp.link && (
											<a
												className="experience-link"
												href={exp.link}
												target="_blank"
												rel="noopener noreferrer">
												Check out my works here!
											</a>
										)}
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
