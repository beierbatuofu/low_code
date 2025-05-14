import RfieldBase from "../../../core/RfieldBase";
import RfSeparatorDef from "./RfSeparatorDef";
import RfieldCore from "../../../core/RfieldCore.ts";

class RfSeparator extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfSeparatorDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfSeparatorDef;
}

RfieldCore.ins().fieldConsMap[RfSeparatorDef.type] = RfSeparator;
