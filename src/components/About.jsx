import AnimatedSection from "./AnimatedSection";
import {
	skills,
	softSkills,
	languages,
	education,
} from "../data";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import StorytellingCard from "../bits/StoryCard.jsx";

export default function About({ setActive }) {
	//start and end refs for inView detection
	const { ref: startRef, inView: startInView } = useInView({
		threshold: 0.3,
	});
	const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

	const [activeTab, setActiveTab] = useState("hard");

	const tabs = [
		{ id: "hard", label: "Tech Skills", data: skills },
		{ id: "soft", label: "Soft Skills", data: softSkills },
		{ id: "languages", label: "Languages", data: languages },
	];

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
							<p className="headerP">{edu.degree}</p>
							<p className="infoP">
								{edu.institution} ( {edu.years} )
							</p>
							<p style={{ maxWidth: "70%" }}>
								<b>Remark: </b>
								{edu.remarks}
							</p>
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
				<div>
					{/* Tab Buttons */}
					<div className="skills-tabs">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
								onClick={() => setActiveTab(tab.id)}
								aria-label={`Show ${tab.label}`}>
								{tab.label}
							</button>
						))}
					</div>

					{/* Tab Content */}
					<AnimatedSection key={activeTab}>
						<div className="tab-content">
							<h2 className="h2">
								{tabs.find((t) => t.id === activeTab).label}
							</h2>
							<ul className="ul">
								{tabs
									.find((t) => t.id === activeTab)
									.data.map((item, i) => (
										<li key={i}>{item}</li>
									))}
							</ul>
						</div>
					</AnimatedSection>
				</div>

				<p ref={endRef} />
			</div>
		</section>
	);
}
