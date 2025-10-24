import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

/**
 * Reusable animated wrapper.
 * It only animates the first time the block enters the viewport.
 */
export default function AnimatedSection({
	as = "div",
	children,
	delay = 0,
	className = "",
}) {
	const controls = useAnimation();
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

	useEffect(() => {
		if (inView) controls.start("visible");
	}, [inView, controls]);

	const variants = {
		hidden: { opacity: 0, y: 26 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut", delay },
		},
	};

	const Tag = as;

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={variants}
			className={className}>
			<Tag>{children}</Tag>
		</motion.div>
	);
}
