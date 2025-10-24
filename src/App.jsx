import { useState, useCallback } from "react";
import "./index.css";
import "./App.css";

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";

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
				<div className="container">
					<p>
						Built by a loved one using React + Framer Motion &nbsp;|&nbsp; ©
						Khin Thiri Myat {new Date().getFullYear()}
					</p>
				</div>
			</footer>
		</>
	);
}
