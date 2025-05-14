import RfieldBase from "../../../core/RfieldBase";
import RfTabDef from "./RfTabDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfTabDef.type] = class RfTab extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfTabDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfTabDef;
};
