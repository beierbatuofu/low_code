import RfieldBase from "../../../core/RfieldBase";
import RfTextareaDef from "./RfTextareaDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfTextareaDef.type] = class RfTextarea extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfTextareaDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfTextareaDef;
};
