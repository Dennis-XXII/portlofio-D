import { useState, forwardRef, useMemo, useRef, useEffect } from "react";
import { m as Motion } from "framer-motion";
import "./ProximityParagraph.css";

function useAnimationFrame(callback, enabled = true) {
	useEffect(() => {
		if (!enabled) return;

		let frameId;
		const loop = () => {
			callback();
			frameId = requestAnimationFrame(loop);
		};
		frameId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frameId);
	}, [callback, enabled]);
}

function useMousePositionRef(targetRef, enabled = true) {
	const positionRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		if (!enabled) return;

		const target = targetRef?.current;
		if (!target) return;

		const updatePosition = (x, y) => {
			const rect = target.getBoundingClientRect();
			positionRef.current = { x: x - rect.left, y: y - rect.top };
		};

		const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
		const handleTouchMove = (ev) => {
			const touch = ev.touches[0];
			updatePosition(touch.clientX, touch.clientY);
		};

		target.addEventListener("mousemove", handleMouseMove);
		target.addEventListener("touchmove", handleTouchMove, { passive: true });
		return () => {
			target.removeEventListener("mousemove", handleMouseMove);
			target.removeEventListener("touchmove", handleTouchMove);
		};
	}, [targetRef, enabled]);

	return positionRef;
}

const VariableProximity = forwardRef((props, ref) => {
	const {
		label,
		fromFontVariationSettings,
		toFontVariationSettings,
		containerRef,
		radius = 50,
		falloff = "linear",
		className = "",
		onClick,
		style,
		disableOnMobile = true,
		mobileBreakpoint = 768,
		...restProps
	} = props;
	const localContainerRef = useRef(null);
	const activeContainerRef = containerRef ?? localContainerRef;

	//check for mobile and disable if needed
	const [isMobile, setIsMobile] = useState(false);
	const [isPointerInside, setIsPointerInside] = useState(false);

	useEffect(() => {
		if (!disableOnMobile) return;

		const checkMobile = () => {
			setIsMobile(window.innerWidth <= mobileBreakpoint);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [disableOnMobile, mobileBreakpoint]);

	const letterRefs = useRef([]);
	const mousePositionRef = useMousePositionRef(activeContainerRef, !isMobile);
	const lastPositionRef = useRef({ x: null, y: null });
	const shouldAnimate = !isMobile && isPointerInside;

	const parsedSettings = useMemo(() => {
		const parseSettings = (settingsStr) =>
			new Map(
				settingsStr
					.split(",")
					.map((s) => s.trim())
					.map((s) => {
						const [name, value] = s.split(" ");
						return [name.replace(/['"]/g, ""), parseFloat(value)];
					}),
			);

		const fromSettings = parseSettings(fromFontVariationSettings);
		const toSettings = parseSettings(toFontVariationSettings);

		return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
			axis,
			fromValue,
			toValue: toSettings.get(axis) ?? fromValue,
		}));
	}, [fromFontVariationSettings, toFontVariationSettings]);

	const calculateDistance = (x1, y1, x2, y2) =>
		Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

	const calculateFalloff = (distance) => {
		const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
		switch (falloff) {
			case "exponential":
				return norm ** 2;
			case "gaussian":
				return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
			case "linear":
			default:
				return norm;
		}
	};

	useEffect(() => {
		if (isMobile) return;
		const target = activeContainerRef?.current;
		if (!target) return;

		const handleEnter = () => setIsPointerInside(true);
		const handleLeave = () => {
			setIsPointerInside(false);
			lastPositionRef.current = { x: null, y: null };
		};

		target.addEventListener("mouseenter", handleEnter);
		target.addEventListener("mouseleave", handleLeave);
		target.addEventListener("touchstart", handleEnter, { passive: true });
		target.addEventListener("touchend", handleLeave);
		target.addEventListener("touchcancel", handleLeave);

		return () => {
			target.removeEventListener("mouseenter", handleEnter);
			target.removeEventListener("mouseleave", handleLeave);
			target.removeEventListener("touchstart", handleEnter);
			target.removeEventListener("touchend", handleLeave);
			target.removeEventListener("touchcancel", handleLeave);
		};
	}, [activeContainerRef, isMobile]);

	useEffect(() => {
		if (shouldAnimate) return;
		letterRefs.current.forEach((letterRef) => {
			if (!letterRef) return;
			letterRef.style.fontVariationSettings = fromFontVariationSettings;
		});
	}, [shouldAnimate, fromFontVariationSettings]);

	useAnimationFrame(() => {
		const target = activeContainerRef?.current;
		if (!target) return;
		const containerRect = target.getBoundingClientRect();
		const { x, y } = mousePositionRef.current;
		if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
			return;
		}
		lastPositionRef.current = { x, y };

		letterRefs.current.forEach((letterRef) => {
			if (!letterRef) return;

			const rect = letterRef.getBoundingClientRect();
			const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
			const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

			const distance = calculateDistance(
				mousePositionRef.current.x,
				mousePositionRef.current.y,
				letterCenterX,
				letterCenterY,
			);

			if (distance >= radius) {
				letterRef.style.fontVariationSettings = fromFontVariationSettings;
				return;
			}

			const falloffValue = calculateFalloff(distance);
			const newSettings = parsedSettings
				.map(({ axis, fromValue, toValue }) => {
					const interpolatedValue =
						fromValue + (toValue - fromValue) * falloffValue;
					return `'${axis}' ${interpolatedValue}`;
				})
				.join(", ");

			letterRef.style.fontVariationSettings = newSettings;
		});
	}, shouldAnimate);

	const words = label.split(" ");
	let letterIndex = 0;

	const setRefs = (node) => {
		localContainerRef.current = node;
		if (typeof ref === "function") {
			ref(node);
			return;
		}
		if (ref) {
			ref.current = node;
		}
	};

	return (
		<span
			ref={setRefs}
			className={`${className} variable-proximity`}
			onClick={onClick}
			style={{ display: "inline", ...style }}
			{...restProps}>
			{words.map((word, wordIndex) => (
				<span
					key={wordIndex}
					style={{ display: "inline-block", whiteSpace: "nowrap" }}>
					{word.split("").map((letter) => {
						const currentLetterIndex = letterIndex++;
						return (
							<Motion.span
								key={currentLetterIndex}
								ref={(el) => {
									letterRefs.current[currentLetterIndex] = el;
								}}
								style={{
									display: "inline-block",
									fontVariationSettings: fromFontVariationSettings,
								}}
								aria-hidden="true">
								{letter}
							</Motion.span>
						);
					})}
					{wordIndex < words.length - 1 && (
						<span style={{ display: "inline-block" }}>&nbsp;</span>
					)}
				</span>
			))}
			<span className="sr-only">{label}</span>
		</span>
	);
});

VariableProximity.displayName = "VariableProximity";
export default VariableProximity;
