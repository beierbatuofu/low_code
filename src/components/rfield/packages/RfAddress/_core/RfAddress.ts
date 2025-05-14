import RfieldBase from "../../../core/RfieldBase";
import RfAddressDef from "./RfAddressDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfAddressDef.type] = class RfAddress extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfAddressDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfAddressDef;
};
