//----------------------
// Types
//----------------------

import type { PACKAGE_MANAGERS } from "@/internals";
import { program } from "commander";

type TCreateTemplateSettings = {
	// /** Application name */
	// name: string;
	// /** Application version */
	// version: string;
};

//----------------------
// Classes
//----------------------

export class CreateTemplate {
	//----
	// Variables
	//----
	private settings: TCreateTemplateSettings;
	//----
	// Constructor
	//----

	constructor(props: TCreateTemplateSettings) {
		this.settings = props;
	}

	//----
	// Methods
	//----

	public build(): this {
		return this;
	}

	public addPackageManagers(
		packageManagers: Array<(typeof PACKAGE_MANAGERS)[keyof typeof PACKAGE_MANAGERS][number] | (string & {})>
	): this {
		//----
		// Add package managers to Options
		//----
		for (const packageManager of packageManagers) {
			program.option(`--use-${packageManager}`, `Use ${packageManager} as package manager`);
		}

		return this;
	}

	//TODO:
	public addGitInit(): this {
		program.option("--git-init", "Initialize git repository", true);
		return this;
	}
}
export default CreateTemplate;
