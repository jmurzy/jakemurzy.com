import { useEffect, useState } from "react";
import * as localStorage from "../lib/localStorage";

type Visits = Record<string, string>;

export function useVisits() {
	const [visits, setVisits] = useState<Visits>({});

	useEffect(() => {
		const storedVisits = localStorage.getItem<Visits>("visits") ?? {};
		const now = new Date();
		const [today] = now.toISOString().split("T");
		const updatedVisits = {
			...storedVisits,
			[today]: now.toISOString(),
		};

		localStorage.setItem("visits", updatedVisits);
		setVisits(updatedVisits);
	}, []);

	return visits;
}
