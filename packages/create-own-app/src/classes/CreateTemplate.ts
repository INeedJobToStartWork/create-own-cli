//----------------------
// Types
//----------------------

import { program } from "commander";

type TCreateTemplateSettings = {
	/** Application name */
	name: string;
	/** Application version */
	version: string;
};

//----------------------
// Classes
//----------------------

export class CreateTemplate {
	//----
	// Variables
	//----
	//----
	// Constructor
	//----

	constructor(props: TCreateTemplateSettings) {
		program.version(props.version);
	}

	//----
	// Methods
	//----

	public init();
}
export default CreateTemplate;
