//----------------------
// Types
//----------------------

import { program } from "commander";

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
	//----
	// Constructor
	//----

	constructor(props: TCreateOwnAppSettings) {
		program.version(props.version);
	}

	//----
	// Methods
	//----

	public init();
}
export default CreateOwnApp;
