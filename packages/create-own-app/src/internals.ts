//----------------------
// CONSTANTS
//----------------------

// type TRemoveReadOnly<T> = {
// 	-readonly [P in keyof T]: T[P];
// };

export type TPackageManagers = (typeof PACKAGE_MANAGERS)[keyof typeof PACKAGE_MANAGERS] & (string & {});

/** Package managers */
export const PACKAGE_MANAGERS = {
	basic: ["npm", "pnpm", "yarn", "bun"],
	extended: ["deno"]
} as const;
/** Node version managers */
export const NODE_VERSION_MANAGERS = ["nvm", "nvm-windows", "fnm", "n", "volta", "nodenv", "mise", "asdf"] as const;
/** Monorepo managers */
export const MONOREPO_MANAGERS = ["nx", "turborepo", "lerna", "yarn-workspaces", "pnpm-workspaces", "rush"] as const;

export type TMonorepoManagers = (typeof MONOREPO_MANAGERS)[number];
