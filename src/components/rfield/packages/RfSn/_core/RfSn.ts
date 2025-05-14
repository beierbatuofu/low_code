import RfieldBase from "../../../core/RfieldBase";
import RfSnDef from "./RfSnDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfSnDef.type] = class RfSn extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfSnDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfSnDef;
};
