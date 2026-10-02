import { createFileRoute } from "@tanstack/react-router";

import LandingPage from "../components/LandingPage";
import { buildSeoHead, siteDescription, siteTitle } from "@/lib/metadata";

export const Route = createFileRoute("/")({
	head: () => buildSeoHead({ title: siteTitle, description: siteDescription, path: "/" }),
	component: App,
});

function App() {
	return <LandingPage />;
}
