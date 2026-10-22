import * as Alchemy from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

const ROOT_ZONE_NAME = "jakemurzy.com";

const zone = Cloudflare.Zone.Zone("JakeMurzyZone", {
	name: ROOT_ZONE_NAME,
}).pipe(adopt(true));

const redirects = (zone: Cloudflare.Zone.Zone) =>
	Cloudflare.Ruleset.Ruleset("JakeMurzyRedirects", {
		zone,
		phase: "http_request_dynamic_redirect",
		name: "default",
		description: "",
		rules: [
			{
				description:
					"Permanently upgrades every HTTP request to the equivalent HTTPS URL.",
				expression: '(http.request.full_uri wildcard r"http://*")',
				action: "redirect",
				actionParameters: {
					fromValue: {
						preserveQueryString: false,
						statusCode: 301,
						targetUrl: {
							expression: `wildcard_replace(http.request.full_uri, r"http://*", r"https://\${1}")`,
						},
					},
				},
			},
			{
				description:
					"Permanently redirects HTTPS requests from www.jakmurzy.com to the canonical jakemurzy.com hostname.",
				expression: '(http.request.full_uri wildcard r"https://www.*")',
				action: "redirect",
				actionParameters: {
					fromValue: {
						preserveQueryString: false,
						statusCode: 301,
						targetUrl: {
							expression: `wildcard_replace(http.request.full_uri, r"https://www.*", r"https://\${1}")`,
						},
					},
				},
			},
		],
	});

const records = (zone: Cloudflare.Zone.Zone) =>
	Effect.gen(function* () {
		yield* Cloudflare.DNS.Record("JakeMurzyWww", {
			zoneId: zone.zoneId,
			name: `www.${ROOT_ZONE_NAME}`,
			type: "A",
			content: "192.0.2.1",
			proxied: true,
		}).pipe(adopt(true));
		yield* Cloudflare.DNS.Record("JakeMurzyMail", {
			zoneId: zone.zoneId,
			name: ROOT_ZONE_NAME,
			type: "MX",
			content: "alt1.aspmx.l.google.com",
			priority: 20,
			ttl: "1",
			proxied: false,
		}).pipe(adopt(true));
		yield* Cloudflare.DNS.Record("JakeMurzyGoogleVerification", {
			zoneId: zone.zoneId,
			name: ROOT_ZONE_NAME,
			type: "TXT",
			content:
				'"google-site-verification=qYZRUCRsxtT8kFiRy7iWNcUly__DMtuPKBVEVw0hhfU"',
			ttl: "1",
			proxied: false,
		}).pipe(adopt(true));
		yield* Cloudflare.DNS.Record("JakeMurzyEthereumNameService", {
			zoneId: zone.zoneId,
			name: ROOT_ZONE_NAME,
			type: "TXT",
			content: '"a=0xEa2E370693B95Dbcf139D1baeda9CB010c9f0CF4"',
			ttl: "1",
			proxied: false,
		}).pipe(adopt(true));
	});

export default Alchemy.Stack(
	"jakemurzy-redirects",
	{ providers: Cloudflare.providers(), state: Cloudflare.state() },
	Effect.gen(function* () {
		const managedZone = yield* zone;
		yield* Cloudflare.Rum.Site("JakeMurzyAnalytics", {
			zoneTag: managedZone.zoneId,
			enabled: true,
			autoInstall: true,
			lite: false,
		}).pipe(adopt(true));
		yield* records(managedZone);
		const ruleset = yield* redirects(managedZone);
		return { rulesetId: ruleset.rulesetId };
	}),
);
