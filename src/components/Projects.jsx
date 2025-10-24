import AnimatedSection from "./AnimatedSection";
import { projects } from "../data";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Projects({ setActive }) {
	const { ref, inView } = useInView({ threshold: 0.5 });

	useEffect(() => {
		if (inView) setActive("projects");
	}, [inView, setActive]);

	return (
		<section id="projects" className="section">
			<div className="container">
				<h2 className="h2" ref={ref}>
					Projects
				</h2>

				<div className="stack-gap">
					{projects.map((p, i) => (
						<AnimatedSection key={i} delay={i * 0.08}>
							<div className="media">
								<img src="{p.img}" alt={p.imgAlt} className="square" />
								<div>
									<div className="kv">
										<h3 className="h3" style={{ margin: 0 }}>
											{p.title}
										</h3>
										<div
											style={{
												textAlign: "left",
												color: "var(--ink-2)",
											}}>
											({p.year})
										</div>
									</div>
									<span>{p.brief}</span>
									<p>{p.description}</p>
								</div>
							</div>
						</AnimatedSection>
					))}
				</div>
			</div>
		</section>
	);
}
