import type { TBrandFilePath } from "@/types";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

//----------------------
// Functions
//----------------------

/**
 * Get all directories paths to depth limit
 *
 * @param startPath Starting directory
 * @param maxDepth Maximum depth (0 = only startPath)
 * @returns Array of paths found all dirs
 */
export function dirPathsToDepth(startPath: string, maxDepth: number): TBrandFilePath[] {
	const result: TBrandFilePath[] = [];

	function walk(currentPath: string, depth: number) {
		result.push(currentPath as TBrandFilePath);
		if (depth >= maxDepth) return;

		const entries = readdirSync(currentPath);
		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry);

			if (statSync(fullPath).isDirectory()) walk(fullPath, depth + 1);
		}
	}

	walk(startPath, 0);
	return result;
}

export default dirPathsToDepth;
