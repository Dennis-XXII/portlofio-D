import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import "./StoryCard.css";

/**
 * StorytellingCard - A bold, impactful card for narrative moments
 *
 * @param {string} title - Large, bold headline text
 * @param {string} subtitle - Supporting text (optional)
 * @param {string} align - Text alignment: "left" | "center" | "right" (default: "center")
 * @param {string} theme - Visual theme: "dark" | "light" | "gradient" | "accent" (default: "light")
 * @param {number} delay - Animation delay in seconds (default: 0)
 * @param {React.ReactNode} children - Additional content below text (optional)
 */
export default function StorytellingCard({
	title,
	subtitle,
	align = "center",
	theme = "light",
	delay = 0,
	children,
}) {
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.3,
	});

	// Animation variants for the container
	const containerVariants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				delay: delay,
				ease: [0.25, 0.4, 0.25, 1],
				staggerChildren: 0.15,
				delayChildren: delay + 0.2,
			},
		},
	};

	// Title animation with word-by-word reveal
	const titleVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.25, 0.4, 0.25, 1],
			},
		},
	};

	// Subtitle fade-in with slight blur effect
	const subtitleVariants = {
		hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			y: 0,
			transition: {
				duration: 0.8,
				ease: [0.25, 0.4, 0.25, 1],
			},
		},
	};

	// Underline animation
	const underlineVariants = {
		hidden: { scaleX: 0 },
		visible: {
			scaleX: 1,
			transition: {
				duration: 0.8,
				ease: [0.25, 0.4, 0.25, 1],
			},
		},
	};

	const themeClasses = {
		light: "story-card--light",
		dark: "story-card--dark",
		gradient: "story-card--gradient",
		accent: "story-card--accent",
	};

	const alignClasses = {
		left: "story-card--left",
		center: "story-card--center",
		right: "story-card--right",
	};

	return (
		<motion.div
			ref={ref}
			className={`story-card ${themeClasses[theme]} ${alignClasses[align]}`}
			variants={containerVariants}
			initial="hidden"
			animate={inView ? "visible" : "hidden"}>
			<div className="story-card__content">
				<motion.h2 className="story-card__title" variants={titleVariants}>
					{title.split(" ").map((word, i) => (
						<motion.span
							key={i}
							className="story-card__word"
							variants={titleVariants}>
							{word}{" "}
						</motion.span>
					))}
				</motion.h2>

				<motion.div
					className="story-card__underline"
					variants={underlineVariants}
				/>

				{subtitle && (
					<motion.p
						className="story-card__subtitle"
						variants={subtitleVariants}>
						{subtitle}
					</motion.p>
				)}

				{children && (
					<motion.div className="story-card__extra" variants={subtitleVariants}>
						{children}
					</motion.div>
				)}
			</div>
		</motion.div>
	);
}

// Example usage in your sections:
/*
import StorytellingCard from "./StorytellingCard";

// In your component:
<StorytellingCard 
    title="Building the Future" 
    subtitle="One line of code at a time"
    align="center"
    theme="gradient"
    delay={0.2}
/>

<StorytellingCard 
    title="Every Project Tells a Story" 
    subtitle="And here's mine"
    align="left"
    theme="dark"
/>

<StorytellingCard 
    title="Innovation Meets Design" 
    theme="accent"
    align="right"
>
    <button className="btn">Explore More</button>
</StorytellingCard>
*/
