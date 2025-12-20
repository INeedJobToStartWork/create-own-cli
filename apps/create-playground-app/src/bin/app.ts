// // eslint-disable-next-line @EslintImports/no-unassigned-import
// import "@/cli";

// import { program } from "commander";

// program.parse(process.argv);

import { CreateOwnApp } from "@packages/create-own-app";

const app = new CreateOwnApp({
	name: "create-playground-app",
	version: "1.0.0"
})
	.init()
	.start();
