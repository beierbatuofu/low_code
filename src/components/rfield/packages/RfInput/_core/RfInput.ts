import RfieldBase from "../../../core/RfieldBase";
import RfInputDef from "./RfInputDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfInputDef.type] = class RfInput extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfInputDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfInputDef;
};
