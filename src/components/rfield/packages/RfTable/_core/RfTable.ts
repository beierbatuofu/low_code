import RfieldBase from "../../../core/RfieldBase";
import RfTableDef from "./RfTableDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfTableDef.type] = class RfTable extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfTableDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfTableDef;
};
