import RfieldBase from "../../../core/RfieldBase";
import RfStatusSelectDef from "./RfStatusSelectDef";
import RfieldCore from "../../../core/RfieldCore.ts";

export const queryConf = RfStatusSelectDef.ins().QueryConf;
RfieldCore.ins().fieldConsMap[RfStatusSelectDef.type] = class RfStatusSelect extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfStatusSelectDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static getQueryCop(method: string, type: string) {
		return type;
	}

	public static readonly fieldDef = RfStatusSelectDef;
};
