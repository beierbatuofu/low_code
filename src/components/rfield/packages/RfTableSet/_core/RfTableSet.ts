import RfieldBase from "../../../core/RfieldBase";
import RfTableSetDef from "./RfTableSetDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfTableSetDef.type] = class RfSelect extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfTableSetDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfTableSetDef;
};
