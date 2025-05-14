import RfieldBase from "../../../core/RfieldBase";
import RfUserRadioDef from "./RfUserRadioDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfUserRadioDef.type] = class RfUserRadio extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfUserRadioDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfUserRadioDef;
};
