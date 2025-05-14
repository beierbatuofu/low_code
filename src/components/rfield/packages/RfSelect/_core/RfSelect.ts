import RfieldBase from "../../../core/RfieldBase";
import RfSelectDef from "./RfSelectDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfSelectDef.type] = class RfSelect extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfSelectDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfSelectDef;
};
