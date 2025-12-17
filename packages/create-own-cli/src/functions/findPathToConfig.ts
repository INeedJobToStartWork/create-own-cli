import type { TBrandFilePath } from "@/types";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import dirPathsToDepth from "./dirPathsToDepth";

//----------------------
// Types
//----------------------

/** @dontexport */
type TParams = {
	/** Name of the configuration file. */
	// configFileName: RegExp | string;
	configFileName: RegExp;
	/** Maximum depth to search for config file. @default 0*/
	maxDepth?: number;
	/** Root path to start searching for the configuration file. */
	startPath: string;
};

//----------------------
// Functions
//----------------------

/**
 * Find config file
 *
 * @param configPath Path to config
 * @returns Path to config if found
 * @dontexport
 */
export function findPathToConfig({ configFileName, maxDepth = 0, startPath }: TParams): TBrandFilePath | undefined {
	//----
	// Check if Path or File exist
	//----
	if (!existsSync(startPath)) return void 0;
	if (path.parse(startPath).ext !== "") return startPath as TBrandFilePath;

	//----
	// Search for config file in directory or directories
	//----
	const dirs = dirPathsToDepth(startPath, maxDepth);

	for (const dirPath of dirs) {
		const files = readdirSync(dirPath);
		for (const file of files) {
			if (configFileName.test(file)) return path.join(startPath, file) as TBrandFilePath;
		}
	}

	return void 0;
}

export default findPathToConfig;
