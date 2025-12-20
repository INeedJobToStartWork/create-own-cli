//----------------------
// Types
//----------------------

type TPackageJsonSettings = {
	// /** Application name */
	// name: string;
	// /** Application version */
	// version: string;
};

//----------------------
// Classes
//----------------------

export class PackageJson {
	//----
	// Variables
	//----

	private packagejson: object = {};
	private settings: TPackageJsonSettings;
	//----
	// Constructor
	//----

	constructor(props: TPackageJsonSettings) {
		this.settings = props;
	}

	//----
	// Methods
	//----

	public build(): this {
		return this;
	}

	public addPackage(): this {
		return this;
	}
}
export default PackageJson;
