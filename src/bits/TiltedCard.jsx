import { useRef, useState } from "react";
import { m as Motion, useMotionValue, useSpring } from "framer-motion";
import "./TiltedCard.css";

const springValues = {
	damping: 20,
	stiffness: 100,
	mass: 2,
};

export default function TiltedCard({
	imageSrc,
	captionText = null,
	containerHeight = "300px",
	containerWidth = "100%",
	imageHeight = "300px",
	imageWidth = "300px",
	imageAlt = "Tilted card image",
	scaleOnHover = 1.2,
	rotateAmplitude = 16,
	showMobileWarning = true,
	showTooltip = true,
	overlayContent = null,
	displayOverlayContent = false,
}) {
	const ref = useRef(null);

	const x = useMotionValue();
	const y = useMotionValue();
	const rotateX = useSpring(useMotionValue(0), springValues);
	const rotateY = useSpring(useMotionValue(0), springValues);
	const scale = useSpring(1, springValues);
	const opacity = useSpring(0);
	const rotateFigcaption = useSpring(0, {
		stiffness: 350,
		damping: 30,
		mass: 1,
	});

	const [lastY, setLastY] = useState(0);

	function handleMouse(e) {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		const offsetX = e.clientX - rect.left - rect.width / 2;
		const offsetY = e.clientY - rect.top - rect.height / 2;

		const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
		const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

		rotateX.set(rotationX);
		rotateY.set(rotationY);

		x.set(e.clientX - rect.left);
		y.set(e.clientY - rect.top);

		const velocityY = offsetY - lastY;
		rotateFigcaption.set(-velocityY * 0.6);
		setLastY(offsetY);
	}

	function handleMouseEnter() {
		scale.set(scaleOnHover);
		opacity.set(1);
	}

	function handleMouseLeave() {
		opacity.set(0);
		scale.set(1);
		rotateX.set(0);
		rotateY.set(0);
		rotateFigcaption.set(0);
	}

	const parsedWidth = Number.parseInt(String(imageWidth), 10);
	const parsedHeight = Number.parseInt(String(imageHeight), 10);

	return (
		<figure
			ref={ref}
			className="tilted-card-figure"
			style={{
				height: containerHeight,
				width: containerWidth,
			}}
			onMouseMove={handleMouse}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			{showMobileWarning && (
				<div className="tilted-card-mobile-alert">
					This effect is not optimized for mobile. Check on desktop.
				</div>
			)}

			<Motion.div
				className="tilted-card-inner"
				style={{
					width: imageWidth,
					height: imageHeight,
					rotateX,
					rotateY,
					scale,
				}}>
				<Motion.img
					src={imageSrc}
					alt={imageAlt}
					className="tilted-card-img"
					loading="eager"
					decoding="async"
					fetchPriority="high"
					width={Number.isFinite(parsedWidth) ? parsedWidth : undefined}
					height={Number.isFinite(parsedHeight) ? parsedHeight : undefined}
					style={{
						width: imageWidth,
						height: imageHeight,
					}}
				/>

				{displayOverlayContent && overlayContent && (
					<Motion.div className="tilted-card-overlay">
						{overlayContent}
					</Motion.div>
				)}
			</Motion.div>

			{showTooltip && (
				<Motion.figcaption
					className="tilted-card-caption"
					style={{
						x,
						y,
						opacity,
						rotate: rotateFigcaption,
					}}>
					{captionText}
				</Motion.figcaption>
			)}
		</figure>
	);
}
