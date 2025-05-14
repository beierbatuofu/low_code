import RfieldBase from "../../../core/RfieldBase";
import RfCheckboxDef from "./RfCheckboxDef";
import RfieldCore from "../../../core/RfieldCore.ts";

class RfCheckbox extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfCheckboxDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}
	public static readonly fieldDef = RfCheckboxDef;
}

RfieldCore.ins().fieldConsMap[RfCheckboxDef.type] = RfCheckbox;
