/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, test, expect, afterAll } from "vitest";
import { dirPathsToDepth } from "./dirPathsToDepth";
import mock from "mock-fs";
import path from "node:path";

//----------------------
// Mocking
//----------------------

mock({
	"path/to/fake/dir": {
		"some-file.txt": "file content here",
		"not-empty-dir": {
			"empty-dir": {
				/** empty directory */
			},
			"empty-dir2": {
				/** empty directory */
			}
		}
	},
	"path/to/some.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]),
	"some/other/path": {
		/** another empty directory */
	}
});

//----------------------
// Tests
//----------------------

describe("[Function] dirPathsToDepth", () => {
	afterAll(() => {
		mock.restore();
	});
	describe("[PASS]", () => {
		test("should return only the start path if maxDepth is 0", () => {
			const startPath = "path/to/fake/dir";
			const result = dirPathsToDepth(startPath, 0);
			expect(result).toEqual([startPath]);
		});
		test("should return dir paths to Depth 1", () => {
			const startPath = "path/to/fake/dir";
			const result = dirPathsToDepth(startPath, 1);
			expect(result).toEqual([startPath, path.normalize("path/to/fake/dir/not-empty-dir")]);
		});
		test("should return dir paths to Depth 2", () => {
			const startPath = "path/to/fake/dir";
			const result = dirPathsToDepth(startPath, 2);
			expect(result).toEqual([
				startPath,
				path.normalize("path/to/fake/dir/not-empty-dir"),
				path.normalize("path/to/fake/dir/not-empty-dir/empty-dir"),
				path.normalize("path/to/fake/dir/not-empty-dir/empty-dir2")
			]);
		});
	});
	describe("[ERROR]", () => {
		test.skip("Empty Test", () => {});
	});
});
