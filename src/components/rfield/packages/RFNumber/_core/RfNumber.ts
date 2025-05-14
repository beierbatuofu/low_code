import RfieldBase from "../../../core/RfieldBase";
import RfNumberDef from "./RfNumberDef.ts";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfNumberDef.type] = class RfNumber extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfNumberDef.ins());
	}
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfNumberDef;
};
