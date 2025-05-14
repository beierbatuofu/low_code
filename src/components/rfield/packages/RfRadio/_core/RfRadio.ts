import RfieldBase from "../../../core/RfieldBase";
import RfRadioDef from "./RfRadioDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfRadioDef.type] = class RfRadio extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfRadioDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfRadioDef;
};
