import * as Alchemy from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

const ROOT_ZONE_NAME = "jakemurzy.com";

const zone = Cloudflare.Zone.Zone("JakeMurzyZone", {
	name: ROOT_ZONE_NAME,
}).pipe(adopt(true));

const webWorker = Effect.gen(function* () {
	return yield* Cloudflare.Website.Vite("JakeMurzyWeb", {
		name: "jakemurzy-com",
		rootDir: ".",
		compatibility: {
			date: "2025-09-02",
			flags: ["nodejs_compat"],
		},
		workersDev: false,
		dev: {
			port: 3000,
			strictPort: true,
		},
		env: {
			HARDCOVER_API_TOKEN: Config.Redacted("HARDCOVER_API_TOKEN"),
			JULIA_WEBSITE: Config.String("JULIA_WEBSITE"),
		},
		domain: {
			name: ROOT_ZONE_NAME,
			zoneName: ROOT_ZONE_NAME,
		},
	}).pipe(adopt(true));
});

export type WebWorkerEnv = Cloudflare.InferEnv<typeof webWorker>;

export default Alchemy.Stack(
	"jakemurzy",
	{ providers: Cloudflare.providers(), state: Cloudflare.state() },
	Effect.gen(function* () {
		yield* zone;
		const worker = yield* webWorker;
		return { url: worker.url };
	}),
);
