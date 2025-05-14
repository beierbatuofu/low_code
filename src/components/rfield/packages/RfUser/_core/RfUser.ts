import RfieldBase from "../../../core/RfieldBase";
import RfUserDef from "./RfUserDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfUserDef.type] = class RfUser extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfUserDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfUserDef;
};
