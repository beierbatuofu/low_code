import demo from "./demo.ts";
import fn from "./fn";

const isClass = (_class: any) => {
	if (_class.toString().slice(0, 5) == "class") return true;
	if (Object.getOwnPropertyNames(_class.prototype).length >= 2) return true;
	return false;
};

/**
 * @description: 继承class prototype,方法挂载prototype上
 * @param {string} modules 类和方法名
 * @return {*}
 */
function Extends(modules: string[] = []): any {
	let property: TJson = {};
	modules.forEach((key: string) => {
		if (Extends.modules.hasOwnProperty(key)) {
			let Target = (<any>Extends).modules[key];
			let proto: TJson = isClass(Target)
				? Object.getPrototypeOf(new Target())
				: {
						[key]: Target,
				  };
			Reflect.ownKeys(proto).forEach((k) => (property[<string>k] = proto[<string>k]));
		}
	});

	return (target: any) => {
		Reflect.ownKeys(property).forEach((key) => key !== "constructor" && (target.prototype[<string>key] = property[<string>key]));
	};
}

//TODO
Extends.modules = {
	demo,
	fn,
};

export default Extends;
