import RfieldBase from "../../../core/RfieldBase";
import RfSelectMultiDef from "./RfSelectMultiDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfSelectMultiDef.type] = class RfSelectMulti extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfSelectMultiDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfSelectMultiDef;
};
