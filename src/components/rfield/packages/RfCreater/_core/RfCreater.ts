import RfieldBase from "../../../core/RfieldBase";
import RfCeaterDef from "./RfCeaterDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfCeaterDef.type] = class RfCeater extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfCeaterDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}
	public static getQueryCop(method: string, type: string) {
		return method == "contain_one" ? "rfield-user" : type;
	}

	public static readonly fieldDef = RfCeaterDef;
};
