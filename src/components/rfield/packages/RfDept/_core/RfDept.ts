import RfieldBase from "../../../core/RfieldBase";
import RfDeptDef from "./RfDeptDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfDeptDef.type] = class RfDept extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfDeptDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfDeptDef;
};
