import { useState, useCallback } from "react";
import "./index.css";
import "./App.css";

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import { motion } from "framer-motion";

export default function App() {
	const [active, setActive] = useState("home");

	// Pass setter down so each section can mark itself active when in view
	const setActiveMemo = useCallback((id) => setActive(id), []);

	return (
		<>
			<NavBar active={active} />

			{/* Order: Home > Experience > Projects > About > Contact */}
			<Home setActive={setActiveMemo} />
			<Experience setActive={setActiveMemo} />
			<Projects setActive={setActiveMemo} />
			<About setActive={setActiveMemo} />
			<Contact setActive={setActiveMemo} />
			<footer className="footer" style={{ textAlign: "center" }}>
				<motion.div className="container">
					<p>
						Designed & Built with great care using React.js + Framer Motion
						&nbsp;|&nbsp; © Kyaw Swar Hein {new Date().getFullYear()}
					</p>
				</motion.div>
			</footer>
		</>
	);
}
