import RfieldBase from "../../../core/RfieldBase";
import RfDeptRadioDef from "./RfDeptRadioDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfDeptRadioDef.type] = class RfDepRadio extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfDeptRadioDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfDeptRadioDef;
};
