//----------------------
// Types
//----------------------

import { program } from "commander";
import CreateTemplate from "./CreateTemplate";

type TCreateOwnAppSettings = {
	/** Application name */
	name: string;
	/** Application version */
	version: string;
};

//----------------------
// Classes
//----------------------

export class CreateOwnApp {
	//----
	// Variables
	//----
	private settings: TCreateOwnAppSettings;
	//----
	// Constructor
	//----

	constructor(props: TCreateOwnAppSettings) {
		this.settings = props;
		program.version(props.version);
	}

	//----
	// Methods
	//----

	public init(): this {
		const test = program
			.description("Create a new application")
			.option("-n, --name <VALUE>", "Application name")
			.action(name => {
				console.log(name);
			});
		const template = new CreateTemplate({}).addPackageManagers(["npm", "yarn", "pnpm", "dwa"]);
		return this;
	}
	/** Start the application */
	public start() {
		program.parse(process.argv);
	}
}
export default CreateOwnApp;
