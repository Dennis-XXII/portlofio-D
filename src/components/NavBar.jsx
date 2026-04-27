// new - import useState, useEffect and framer-motion
import { useState, useEffect, useCallback } from "react";
import { m as Motion, AnimatePresence, LayoutGroup } from "framer-motion";

const LINKS = [
	{ id: "home", label: "Home" },
	{ id: "experience", label: "Experiences" },
	{ id: "projects", label: "Projects" },
	{ id: "about", label: "About" },
	{ id: "contact", label: "Contact" },
];

// new - A simple hamburger icon component
const HamburgerIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round">
		<line x1="3" y1="12" x2="21" y2="12"></line>
		<line x1="3" y1="6" x2="21" y2="6"></line>
		<line x1="3" y1="18" x2="21" y2="18"></line>
	</svg>
);

// new - A simple close icon component
const CloseIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round">
		<line x1="18" y1="6" x2="6" y2="18"></line>
		<line x1="6" y1="6" x2="18" y2="18"></line>
	</svg>
);

export default function NavBar({ active }) {
	const [isOpen, setIsOpen] = useState(false); // new - State to control the mobile menu

	const handleClick = useCallback(
		(id) => (e) => {
			e.preventDefault();
			setIsOpen(false); // new - Close menu on link click
			const el = document.getElementById(id);
			if (!el) return;

			const navH =
				parseInt(
					getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
				) || 68;
			const y = el.getBoundingClientRect().top + window.scrollY - (navH + 12);
			window.scrollTo({ top: y, behavior: "smooth" });
		},
		[]
	);

	// new - Lock body scroll when the menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		// Cleanup function to reset scroll on component unmount
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	// new - Variants for the drawer animation
	const drawerVariants = {
		hidden: { x: "100%" },
		visible: { x: "0%", transition: { type: "tween", duration: 0.3 } },
		exit: { x: "100%", transition: { type: "tween", duration: 0.2 } },
	};

	// new - Variants for the overlay
	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.3 } },
		exit: { opacity: 0, transition: { duration: 0.2 } },
	};

	return (
		<>
			<nav className="nav">
				<div className="nav_box">
					<div className="brand">
						<h2>Kyaw Swar Hein</h2>
						<span className="badge">
							<span className="badge__dot" />
							Open for work!
						</span>
					</div>

					{/* Desktop navigation */}
					<LayoutGroup id="desktop-nav-pill">
						<div className="nav__links" role="tablist" aria-label="Sections">
							{LINKS.map((link) => {
								const isActive = active === link.id;
								return (
									<a
										key={link.id}
										href={`#${link.id}`}
										onClick={handleClick(link.id)}
										className={`nav__btn ${isActive ? "is-active" : ""}`}
										role="tab"
										aria-selected={isActive}
										aria-controls={link.id}>
										{isActive && (
											<Motion.span
												layoutId="nav-active-pill"
												className="nav__pill"
												transition={{
													type: "spring",
													stiffness: 500,
													damping: 40,
												}}
											/>
										)}
										<span className="nav__label">{link.label}</span>
									</a>
								);
							})}
						</div>
					</LayoutGroup>

					{/* new - Hamburger Button for mobile */}
					<Motion.button
						className="hamburger-btn"
						onClick={() => setIsOpen(true)}
						aria-label="Open menu">
						<HamburgerIcon />
					</Motion.button>
				</div>
			</nav>

			{/* new - Mobile Menu Drawer with Framer Motion */}
			<AnimatePresence>
				{isOpen && (
					<>
						<Motion.div
							className="overlay"
							onClick={() => setIsOpen(false)}
							initial="hidden"
							animate="visible"
							exit="exit"
							variants={overlayVariants}
						/>
						<Motion.div
							className="mobile-nav"
							initial="hidden"
							animate="visible"
							exit="exit"
							variants={drawerVariants}>
							<div className="mobile-nav__header">
								<button
									className="mobile-nav__close-btn"
									onClick={() => setIsOpen(false)}
									aria-label="Close menu">
									<CloseIcon />
								</button>
							</div>
							<div
								className="mobile-nav__links"
								role="menu"
								aria-label="Mobile navigation">
								{LINKS.map((link) => {
									const isActive = active === link.id;
									return (
										<a
											key={link.id}
											href={`#${link.id}`}
											onClick={handleClick(link.id)}
											className={`mobile-nav__link ${
												isActive ? "is-active" : ""
											}`}
											role="menuitem"
											aria-current={isActive ? "page" : undefined}
											aria-selected={isActive}>
											{/* optional left indicator bar */}
											<span className="mobile-nav__dot" aria-hidden="true" />
											<span className="mobile-nav__label">{link.label}</span>
										</a>
									);
								})}
							</div>
						</Motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
