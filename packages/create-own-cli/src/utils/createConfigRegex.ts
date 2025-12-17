//----------------------
// Types
//----------------------

import type { TRegExpFlags } from "@/types";
import { os } from "@myutilia/env";

// /** @dontexport */
// type TProps = {
// 	/** Name of the configuration file. */
// 	configFileName: string[] | string | true;
// 	/** Allowed extensions of the configuration file. */
// 	extensions: string | true | [];
// 	/**
// 	 *  Flags to add to the regular expression.
// 	 *
// 	 *  if set to `TRegExpFlags[]`, it will be shorthand to `addFlags` option.
// 	 *
// 	 */
// 	flags?:
// 		| TRegExpFlags[]
// 		| {
// 				/** Additional flags to add to the regular expression.
// 				 *
// 				 *	- "g" for global
// 				 *	- "i" for ignoreCase (Recommended to use `ignoreCase` option to support Linux)
// 				 *	- "m" for multiline
// 				 *	- "u" for unicode
// 				 *	- "y" for sticky
// 				 * @default undefined
// 				 */
// 				addFlags?: TRegExpFlags[];
// 				/** Whether the regular expression should be case-insensitive (Support Linux). @default true */
// 				ignoreCase?: boolean;
// 		  };

// 	/** Pre-extensions of the configuration file.
// 	 *
// 	 * If set to `true`, any pre-extensions are allowed without limits and they are optional.
// 	 *
// 	 * If set to `false`, no pre-extensions are allowed.
// 	 *
// 	 * If set to `string[]` - it's shorthand for `{ whitelist: preExtensions }`
// 	 *
// 	 * If set to an object, the following properties are available:
// 	 * - `blacklist`: An array of pre-extensions that are not allowed.
// 	 * - `limit`: Whether to limit the number of pre-extensions.
// 	 * - `optional`: Whether the pre-extensions are optional.
// 	 * - `whitelist`: An array of pre-extensions that are allowed.
// 	 *
// 	 *  @default true */
// 	preExtensions?: Parameters<typeof createPreExtensionsRegex>[0];
// };

//----------------------
// Functions
//----------------------

export class createConfigRegex {
	//----------------------
	// Variables
	//----------------------
	private pattern: string;
	private fileNamePattern = "";
	private extensionPattern = "";
	private flags = "";

	//----------------------
	// Constructor
	//----------------------

	constructor(start = true) {
		this.pattern = start ? "^" : "";
	}

	//----------------------
	// Methods
	//----------------------

	public setFileName(configFileName: string[] | string | true): this {
		// ❗ FIX: ".+" → NIE może łapać kropek i slashy
		if (configFileName === true) this.fileNamePattern = String.raw`[^\\.]+`;
		else if (Array.isArray(configFileName)) {
			// this.fileNamePattern = `(${configFileName.join("|")})`;
			this.fileNamePattern = `(?:${configFileName.join("|")})`;
		} else this.fileNamePattern = configFileName;

		return this;
	}

	public setPreExtensions(preExtensions: Parameters<typeof createPreExtensionsRegex>[0]): this {
		this.pattern += createPreExtensionsRegex(preExtensions);
		return this;
	}

	public setExtension(extension: string[] | string | true): this {
		// ❗ FIX: "\.+" było logicznie błędne
		if (extension === true) this.extensionPattern = String.raw`\.[^.]+`;
		else if (Array.isArray(extension)) {
			this.extensionPattern = String.raw`\.(${extension.join("|")})`;
		} else if (extension) this.extensionPattern = String.raw`\.${extension}`;

		return this;
	}

	public setFlags(
		props:
			| TRegExpFlags[]
			| {
					/** Additional flags to add to the regular expression.
					 *
					 *	- "g" for global
					 *	- "i" for ignoreCase (Recommended to use `ignoreCase` option to support Linux)
					 *	- "m" for multiline
					 *	- "u" for unicode
					 *	- "y" for sticky
					 * @default undefined
					 */
					addFlags?: TRegExpFlags[];
					/** Whether the regular expression should be case-insensitive (Support Linux). @default true */
					ignoreCase?: boolean;
			  }
	): this {
		if (Array.isArray(props)) this.flags = props.join("");
		else if (typeof props === "string") this.flags = props;
		else {
			if (props.ignoreCase) this.flags += isCaseSensitiveSystem ? "" : "i";
			if (props.addFlags) this.flags += props.addFlags.join("");
		}
		return this;
	}

	/** Build the regular expression. */
	public build(): RegExp {
		// ❗ FIX: NIE mutujemy stanu przez wywołanie setterów
		const fileName = this.fileNamePattern || String.raw`[^/\\.]+`;
		const extension = this.extensionPattern || String.raw`\.[^.]+`;

		const finalPattern = `${this.pattern}${fileName}${extension}$`;

		// eslint-disable-next-line @EslintSecurity/detect-non-literal-regexp
		return new RegExp(finalPattern, [...this.flags].sort().join(""));
	}
}

//----------------------
// Helpers
//----------------------

/** @dontexport */
const isCaseSensitiveSystem = (
	["Linux", "linux", "aix", "freebsd", "netbsd", "openbsd", "sunos", "haiku", "mac"] as Array<ReturnType<typeof os>>
).includes(os());

/** @dontexport */
const createPreExtensionsRegex = (
	props?:
		| string[]
		| boolean
		| string
		| {
				/** Blacklisted pre-extensions of the configuration file. */
				blacklist?: string[];
				/** Whether to limit the number of pre-extensions. @default false*/
				limit?:
					| false
					| {
							/** Maximum number of pre-extensions. @default undefined*/
							max?: number | undefined;
							/** Minimum number of pre-extensions. @default 0*/
							min?: number;
					  };
				/** Whether the pre-extensions are optional. @default true*/
				optional?: boolean;
				/** Allowed pre-extensions of the configuration file. */
				whitelist: string[] | string | true;
		  }
): string => {
	let result = "";

	//----
	// Whitelist & Blacklist handling
	//----

	if (typeof props === "boolean" || props === void 0) return props ? ".*" : "";

	const whitelistHandler = (whitelist: string[] | string | true) => {
		if (whitelist === true) return "[^.]+";
		if (Array.isArray(whitelist)) return `(${whitelist.join("|")})`;
		return whitelist;
	};

	// Shorthand for whitelist
	if (Array.isArray(props) || typeof props === "string") {
		return String.raw`(?:\.${whitelistHandler(props)})*`;
	}

	const { blacklist, limit = false, optional = true, whitelist } = props;

	if (blacklist) result += `(?!${blacklist.join("|")})`;
	result += String.raw`\.` + whitelistHandler(whitelist);

	//----
	// Limit handling and optional
	//----

	if (limit && typeof limit === "object") {
		const min = limit.min ?? 0;
		const max = typeof limit.max === "number" ? limit.max : "";
		result = `(?:${result}){${min},${max}}`;
	} else if (optional) {
		result = `(?:${result})*`;
	} else {
		result = `(?:${result})+`;
	}

	return result;
};
