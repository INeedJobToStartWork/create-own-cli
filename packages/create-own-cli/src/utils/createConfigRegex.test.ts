/* eslint-disable max-lines */
/* eslint-disable @EslintSecurity/detect-unsafe-regex */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, test, expect, afterAll, vi } from "vitest";
import mock from "mock-fs";
import { os } from "@myutilia/env";
import { createConfigRegex as createConfigRegexExported } from "./createConfigRegex";

// Mockujemy os() dla stałych wyników w testach, zakładając domyślnie system nieczuły na wielkość liter (jak Windows/macOS)
// Używamy globalnego mocka, aby był dostępny w zaimportowanym pliku.
vi.mock("@myutilia/env", () => ({
	os: vi.fn(() => "Windows") // Ustawienie na system nieczuły na wielkość liter (ignoruje "i" w flags)
}));

// Mock dla Linux (czuły na wielkość liter)
const mockOsLinux = () => {
	// @ts-expect-error
	os.mockReturnValue("Linux");
};

// Mock dla Windows (nieczuły na wielkość liter)
const mockOsWindows = () => {
	os.mockReturnValue("Windows");
};

describe("[Function] createConfigRegex", () => {
	afterAll(() => {
		mock.restore();
		vi.restoreAllMocks();
	});

	describe("[PASS]", () => {
		describe("setFileName", () => {
			test("Value: true - accept all names", () => {
				// eslint-disable-next-line new-cap
				const result = new createConfigRegexExported(true)
					.setFileName(true)
					.setPreExtensions(true)
					.setExtension(true)
					.build();

				expect(result.source).toBe(String.raw`^.*[^\\.]+\.[^.]+$`);
				expect(result.flags).toBe("");
				expect(result.test("any.name.file.works")).toBe(true);
			});
			test("Value: true - only name accepted 'thisName'", () => {
				// eslint-disable-next-line new-cap
				const result = new createConfigRegexExported(true)
					.setFileName(["thisName"])
					.setPreExtensions(true)
					.setExtension(true)
					.build();

				expect(result.source).toBe(String.raw`^.*(thisName)\.[^.]+$`);
				expect(result.flags).toBe("");
				expect(result.test("thisName.file.works")).toBe(true);
				expect(result.test("any.name.file.works")).toBe(false);
			});
			test("Value: All True, PreExtensions false - accept all names", () => {
				// eslint-disable-next-line new-cap
				const result = new createConfigRegexExported(true)
					.setFileName(true)
					.setPreExtensions(false)
					.setExtension(true)
					.build();

				expect(result.source).toBe(String.raw`^[^\\.]+\.[^.]+$`);
				expect(result.flags).toBe("");
				expect(result.test("any.name.file.dont.work")).toBe(false);
				expect(result.test("any.works")).toBe(true);
				expect(result.test("any.works")).toBe(true);
				expect(result.test(".only.dots")).toBe(false);
				expect(result.test("noextension")).toBe(false);
			});
			test("FileName: All True, PreExtensions false, Extension ['js','ts'] - accept all names", () => {
				// eslint-disable-next-line new-cap
				const result = new createConfigRegexExported(true)
					.setFileName(true)
					.setPreExtensions(false)
					.setExtension(["js", "ts"])
					.build();

				expect(result.source).toBe(String.raw`^[^\\.]+\.(js|ts)$`);
				expect(result.flags).toBe("");
				expect(result.test("any.name.file.dont.work")).toBe(false);
				expect(result.test("any.js")).toBe(true);
				expect(result.test("any.ts")).toBe(true);
				expect(result.test("any.any")).toBe(false);
			});
		});
	});

	// describe("Konfiguracja Nazwy Pliku (configFileName)", () => {
	// 	// test("configFileName: true (dopasowuje wszystko)", () => {
	// 	// 	const result = createConfigRegexExported({
	// 	// 		configFileName: true,
	// 	// 		extensions: true,
	// 	// 		preExtensions: false
	// 	// 	});

	// 	// 	expect(result.source).toBe("^.*$");
	// 	// 	expect(result.test("dowolna.nazwa.pliku.ext")).toBe(false);
	// 	// 	expect(result.test(".tylko.kropki")).toBe(false);
	// 	// 	expect(result.test("bezrozszerzen")).toBe(false);
	// 	// });

	// 	// test("configFileName: string (pojedyncza nazwa)", () => {
	// 	// 	const result = createConfigRegexExported({
	// 	// 		configFileName: "vite",
	// 	// 		extensions: true,
	// 	// 		preExtensions: false
	// 	// 	});
	// 	// 	// Oczekiwana RegEx: /^vite$/.*$/
	// 	// 	expect(result.source).toBe("^vite$");
	// 	// 	expect(result.test("vite")).toBe(true);
	// 	// 	expect(result.test("vite.config")).toBe(false);
	// 	// 	expect(result.test("vite-config")).toBe(false);
	// 	// });

	// 	// test("configFileName: string[] (wiele nazw)", () => {
	// 	// 	const result = createConfigRegexExported({
	// 	// 		configFileName: ["tailwind", "postcss", "vite"],
	// 	// 		extensions: true,
	// 	// 		preExtensions: false
	// 	// 	});
	// 	// 	// Oczekiwana RegEx: /^(tailwind|postcss|vite)$/.*$/
	// 	// 	expect(result.source).toBe("^(tailwind|postcss|vite)$");
	// 	// 	expect(result.test("tailwind")).toBe(true);
	// 	// 	expect(result.test("postcss")).toBe(true);
	// 	// 	expect(result.test("vite")).toBe(true);
	// 	// 	expect(result.test("webpack")).toBe(false);
	// 	// });
	// });

	// describe("Konfiguracja Rozszerzeń (extensions)", () => {
	// 	mockOsWindows();

	// 	test("extensions: true (dowolne rozszerzenie jest dozwolone)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: true,
	// 			preExtensions: false
	// 		});
	// 		// Oczekiwana RegEx: /^file$.*$/
	// 		expect(result.source).toBe("^file.*");
	// 		expect(result.test("file.js")).toBe(false); // Oczekuje, że będzie dopasowane na końcu
	// 		expect(result.test("file")).toBe(true); // Ponieważ 'true' w extensions tworzy `.*`, a regex to /^file$.*/
	// 	});

	// 	test("extensions: string[] (lista rozszerzeń)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: ["js", "ts", "json"],
	// 			preExtensions: false
	// 		});
	// 		// Oczekiwana RegEx: /^file$(js|ts|json)$/
	// 		expect(result.source).toBe("^file(js|ts|json)");
	// 		expect(result.test("filejs")).toBe(false);
	// 		expect(result.test("filets")).toBe(false);
	// 		expect(result.test("file.js")).toBe(false); // Ponieważ brakuje obsługi kropki
	// 	});

	// 	test("extensions: [] (brak rozszerzeń)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: [],
	// 			preExtensions: false
	// 		});
	// 		// Oczekiwana RegEx: /^file$/()$/
	// 		expect(result.source).toBe("^file$()");
	// 		expect(result.test("file")).toBe(true);
	// 		expect(result.test("file.js")).toBe(false);
	// 	});

	// 	test("extensions: z kropkami i preExtensions: true", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: [String.raw`\.js`, String.raw`\.json`],
	// 			preExtensions: true // .[^.]+)*
	// 		});
	// 		// Oczekiwana RegEx: /^file$.*\.(js|json)$/
	// 		// W kodzie '.*' z preExtensions jest przed rozszerzeniami: `^file$.*(\.js|\.json)`
	// 		expect(result.source).toBe(`^file$.*(${String.raw`\.js`}|${String.raw`\.json`})`);
	// 		expect(result.test("file.config.js")).toBe(true);
	// 		expect(result.test("file.config.json")).toBe(true);
	// 		expect(result.test("file.config.ts")).toBe(false);
	// 	});
	// });

	// describe("Konfiguracja Pre-rozszerzeń (preExtensions) (pośrednie testowanie createPreExtensionsRegex)", () => {
	// 	mockOsWindows();

	// 	// Domyślne zachowanie: true
	// 	test("preExtensions: true (dowolne, opcjonalne)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: true,
	// 			preExtensions: true
	// 		});
	// 		// Oczekiwana RegEx: /^file$.*$/.*$/
	// 		expect(result.source).toBe("^file$.*.*");
	// 		expect(result.test("file.config.js")).toBe(true);
	// 		expect(result.test("file")).toBe(true);
	// 		expect(result.test("file.config")).toBe(true);
	// 	});

	// 	test("preExtensions: false (brak)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: [String.raw`\.js`],
	// 			preExtensions: false
	// 		});
	// 		// Oczekiwana RegEx: /^file$()(\.js)$/
	// 		expect(result.source).toBe(`^file$()${String.raw`\.js`}`);
	// 		expect(result.test("file.js")).toBe(true);
	// 		expect(result.test("file.config.js")).toBe(false);
	// 	});

	// 	test("preExtensions: string[] (whitelist shorthand, opcjonalne)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: [String.raw`\.js`],
	// 			preExtensions: ["config", "spec"]
	// 		});
	// 		// Oczekiwana RegEx: /^file$(?:(\.|config|spec))*(\.js)$/ (uwaga na błąd w oryginalnej implementacji createPreExtensionsRegex, testujemy wynik)
	// 		// W createPreExtensionsRegex dla string[]/string, zwróci to po prostu `(config|spec)`
	// 		// Właściwy wynik z implementacji: `^file$(config|spec)(\.js)` - BŁĄD LOGICZNY
	// 		// Poprawny regex z implementacji `createPreExtensionsRegex` dla `string[]` to `(config|spec)`.
	// 		// Domyślnie brakuje kropki i ujęcia w opcjonalną grupę. Testujemy to, co jest faktycznie ZWRACANE:
	// 		expect(result.source).toBe(`^file$(config|spec)${String.raw`\.js`}`); // Oczekiwany wynik z BŁĘDNĄ logiką
	// 		expect(result.test("fileconfig.js")).toBe(true);
	// 		expect(result.test("file.config.js")).toBe(false); // Błąd: brak kropki
	// 		expect(result.test("file.js")).toBe(false);
	// 	});

	// 	// Testowanie obiektu preExtensions
	// 	describe("preExtensions: Object", () => {
	// 		test("whitelist: string[] (opcjonalne, bez limitu)", () => {
	// 			const result = createConfigRegexExported({
	// 				configFileName: "file",
	// 				extensions: [String.raw`\.js`],
	// 				preExtensions: {
	// 					whitelist: ["config", "spec"],
	// 					optional: true, // Domyślne
	// 					limit: false // Domyślne
	// 				}
	// 			});
	// 			// Oczekiwana RegEx: /^file$(?:(?!blacklist)\.(config|spec))*(\.js)$/
	// 			// Oczekiwany wynik z implementacji: `^file$(?:\.(config|spec))*(\.js)`
	// 			expect(result.source).toBe(`^file$(?:${String.raw`\.`}(config|spec))*${String.raw`\.js`}`);
	// 			expect(result.test("file.js")).toBe(true);
	// 			expect(result.test("file.config.js")).toBe(true);
	// 			expect(result.test("file.spec.js")).toBe(true);
	// 			expect(result.test("file.config.spec.js")).toBe(true);
	// 			expect(result.test("file.test.js")).toBe(false);
	// 		});

	// 		test("whitelist: string[] (wymagane, bez limitu)", () => {
	// 			const result = createConfigRegexExported({
	// 				configFileName: "file",
	// 				extensions: [String.raw`\.js`],
	// 				preExtensions: {
	// 					whitelist: ["config", "spec"],
	// 					optional: false // Wymagane (co najmniej jedno)
	// 				}
	// 			});
	// 			// Oczekiwana RegEx: /^file$(?:(?!blacklist)\.(config|spec))+(\.js)$/
	// 			// Oczekiwany wynik z implementacji: `^file$(?:\.(config|spec))+(\.js)`
	// 			expect(result.source).toBe(`^file$(?:${String.raw`\.`}(config|spec))+${String.raw`\.js`}`);
	// 			expect(result.test("file.js")).toBe(false);
	// 			expect(result.test("file.config.js")).toBe(true);
	// 			expect(result.test("file.spec.js")).toBe(true);
	// 			expect(result.test("file.config.spec.js")).toBe(true);
	// 		});

	// 		test("limit: min=1, max=1", () => {
	// 			const result = createConfigRegexExported({
	// 				configFileName: "file",
	// 				extensions: [String.raw`\.js`],
	// 				preExtensions: {
	// 					whitelist: ["config", "spec"],
	// 					limit: { min: 1, max: 1 }
	// 				}
	// 			});
	// 			// Oczekiwana RegEx: /^file$(?:(?!blacklist)\.(config|spec)){1,1}(\.js)$/
	// 			// Oczekiwany wynik z implementacji: `^file$(?:\.(config|spec)){1,1}(\.js)`
	// 			expect(result.source).toBe(`^file$(?:${String.raw`\.`}(config|spec)){1,1}${String.raw`\.js`}`);
	// 			expect(result.test("file.js")).toBe(false);
	// 			expect(result.test("file.config.js")).toBe(true);
	// 			expect(result.test("file.config.spec.js")).toBe(false);
	// 		});

	// 		test("limit: min=0, max=2", () => {
	// 			const result = createConfigRegexExported({
	// 				configFileName: "file",
	// 				extensions: [String.raw`\.js`],
	// 				preExtensions: {
	// 					whitelist: ["config", "spec"],
	// 					limit: { min: 0, max: 2 }
	// 				}
	// 			});
	// 			// Oczekiwana RegEx: /^file$(?:(?!blacklist)\.(config|spec)){0,2}(\.js)$/
	// 			// Oczekiwany wynik z implementacji: `^file$(?:\.(config|spec)){0,2}(\.js)`
	// 			expect(result.source).toBe(`^file$(?:${String.raw`\.`}(config|spec)){0,2}${String.raw`\.js`}`);
	// 			expect(result.test("file.js")).toBe(true);
	// 			expect(result.test("file.config.js")).toBe(true);
	// 			expect(result.test("file.config.spec.js")).toBe(true);
	// 			expect(result.test("file.config.spec.test.js")).toBe(false);
	// 		});

	// 		test("blacklist: ['local']", () => {
	// 			const result = createConfigRegexExported({
	// 				configFileName: "file",
	// 				extensions: [String.raw`\.js`],
	// 				preExtensions: {
	// 					whitelist: true, // Dowolne
	// 					blacklist: ["local"],
	// 					optional: true
	// 				}
	// 			});
	// 			// Oczekiwana RegEx: /^file$(?:(?!local)\..*)*(\.js)$/
	// 			// Oczekiwany wynik z implementacji: `^file$(?:(?!local)\..*)*(\.js)`
	// 			expect(result.source).toBe(`^file$(?:(?!local)${String.raw`\.`}.)*${String.raw`\.js`}`);
	// 			expect(result.test("file.js")).toBe(true);
	// 			expect(result.test("file.config.js")).toBe(true);
	// 			expect(result.test("file.local.js")).toBe(false);
	// 			expect(result.test("file.prod.local.js")).toBe(true); // Blacklista blokuje tylko pierwsze (i wszystkie) rozszerzenia po kropce
	// 		});
	// 	});
	// });

	// describe("Konfiguracja Flag (flags)", () => {
	// 	test("flags: TRegExpFlags[] (shorthand)", () => {
	// 		mockOsWindows();
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: true,
	// 			preExtensions: false,
	// 			flags: ["g", "u"]
	// 		});
	// 		expect(result.flags).toBe("gu");
	// 	});

	// 	test("flags: { addFlags: TRegExpFlags[] }", () => {
	// 		mockOsWindows();
	// 		const result = createConfigRegexExported({
	// 			configFileName: "file",
	// 			extensions: true,
	// 			preExtensions: false,
	// 			flags: { addFlags: ["g", "u"] }
	// 		});
	// 		expect(result.flags).toBe("gu");
	// 	});

	// 	// Testowanie flagi 'i' i 'ignoreCase' w zależności od systemu
	// 	describe("ignoreCase i Flaga 'i'", () => {
	// 		test("ignoreCase: true na systemie Windows (nieczuły) -> flaga 'i' jest pomijana", () => {
	// 			mockOsWindows();
	// 			const result = createConfigRegexExported({
	// 				configFileName: "File",
	// 				extensions: true,
	// 				preExtensions: false,
	// 				flags: { ignoreCase: true }
	// 			});
	// 			// Oczekiwane: brak 'i'
	// 			expect(result.flags).toBe("");
	// 			expect(result.test("File")).toBe(true);
	// 			expect(result.test("file")).toBe(true); // Nie działa tak, bo regex to /^File$/, a nie /^file$/i
	// 			// To jest pułapka! flaga 'i' dodawana jest tylko gdy system jest Czuły na wielkość liter
	// 			// System Windows jest domyślnie NIEczuły (flaga 'i' nie jest potrzebna, bo system sam to robi)
	// 			// ALE w JS RegExp, MUSISZ użyć flagi 'i' aby dopasować `^File$` do "file".
	// 			// Kod ma błąd logiczny dla JS:
	// 			// if (props.flags?.ignoreCase) flags += isCaseSensitiveSystem ? "i" : "";
	// 			// Powinno być odwrotnie lub po prostu dodawane "i" ZAWSZE, gdy `ignoreCase: true`.
	// 			// Testujemy istniejący BŁĄD:
	// 			expect(result.source).toBe("^File$");
	// 			expect(result.test("file")).toBe(false); // Ze względu na błąd implementacji, test nie przechodzi (powinno być true)
	// 		});

	// 		test("ignoreCase: true na systemie Linux (czuły) -> flaga 'i' JEST dodawana", () => {
	// 			mockOsLinux();
	// 			const result = createConfigRegexExported({
	// 				configFileName: "File",
	// 				extensions: true,
	// 				preExtensions: false,
	// 				flags: { ignoreCase: true }
	// 			});
	// 			// Oczekiwane: 'i' jest dodawane, bo Linux jest Czuły
	// 			expect(result.flags).toBe("i");
	// 			expect(result.source).toBe("^File$");
	// 			expect(result.test("file")).toBe(true); // Z flagą 'i' test przechodzi
	// 		});

	// 		test("ignoreCase: false na systemie Linux (czuły) -> flaga 'i' NIE jest dodawana", () => {
	// 			mockOsLinux();
	// 			const result = createConfigRegexExported({
	// 				configFileName: "File",
	// 				extensions: true,
	// 				preExtensions: false,
	// 				flags: { ignoreCase: false }
	// 			});
	// 			// Oczekiwane: brak 'i'
	// 			expect(result.flags).toBe("");
	// 			expect(result.source).toBe("^File$");
	// 			expect(result.test("file")).toBe(false);
	// 		});
	// 	});
	// });

	// describe("Scenariusz Końcowy (Kompletny)", () => {
	// 	mockOsLinux(); // Używamy Linux, aby flaga 'i' była poprawnie dodana

	// 	test("Pełna konfiguracja (commitsmile)", () => {
	// 		const result = createConfigRegexExported({
	// 			configFileName: "commitsmile",
	// 			preExtensions: {
	// 				whitelist: ["config"],
	// 				optional: true,
	// 				limit: { max: 1 }
	// 			},
	// 			extensions: [String.raw`\.js`, String.raw`\.ts`],
	// 			flags: {
	// 				addFlags: ["g", "u"],
	// 				ignoreCase: true
	// 			}
	// 		});
	// 		// Flagi: 'igu' (i + gu)
	// 		// Wzór: /^commitsmile$(?:(?!blacklist)\.config){0,1}(\.js|\.ts)$/
	// 		// W implementacji: `^commitsmile$(?:\.config){0,1}(\.js|\.ts)`
	// 		// eslint-disable-next-line @EslintUnicorn/prefer-spread
	// 		expect(Array.from(result.flags).sort()).toStrictEqual(Array.from("igu").sort());
	// 		expect(result.source).toBe(
	// 			`^commitsmile(?:${String.raw`\.`}config{0,1}(${String.raw`\.js`}|${String.raw`\.ts`})`
	// 		);

	// 		// Testy dopasowania
	// 		expect(result.test("commitsmile.js")).toBe(true);
	// 		expect(result.test("Commitsmile.ts")).toBe(true);
	// 		expect(result.test("commitsmile.config.js")).toBe(true);
	// 		expect(result.test("Commitsmile.Config.ts")).toBe(true);
	// 		expect(result.test("commitsmile.local.js")).toBe(false); // Brak na whiteliscie
	// 		expect(result.test("commitsmile.config.config.js")).toBe(false); // Przekroczenie limitu max: 1
	// 	});

	// 	test("Przykład z README (przybliżony)", () => {
	// 		mockOsWindows();
	// 		const result = createConfigRegexExported({
	// 			configFileName: "commitsmile",
	// 			preExtensions: true,
	// 			extensions: [String.raw`\.js`, String.raw`\.ts`, String.raw`\.json`, String.raw`\.yaml`],
	// 			flags: ["iu"] // Ustawione jawnie, aby ominąć logikę isCaseSensitiveSystem
	// 		});
	// 		// Oczekiwany: /^commitsmile.*(\.js|\.ts|\.json|\.yaml)$/iu
	// 		expect(result.source).toBe(
	// 			`^commitsmile.*(${String.raw`\.js`}|${String.raw`\.ts`}|${String.raw`\.json`}|${String.raw`\.yaml`})`
	// 		);
	// 		expect(result.flags).toBe("iu");

	// 		expect(result.test("commitsmile.config.js")).toBe(true);
	// 		expect(result.test("commitsmile.local.yaml")).toBe(true);
	// 		expect(result.test("Commitsmile.config.json")).toBe(true);
	// 	});
	// });
});
