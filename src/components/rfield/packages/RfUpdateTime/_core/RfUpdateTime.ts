import RfieldBase from "../../../core/RfieldBase";
import RfUpdateTimeDef from "./RfUpdateTimeDef";
// import Datetime from "../../RfDatetime/_core/Datetime";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfUpdateTimeDef.type] = class RfDatetime extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfUpdateTimeDef.ins());
	}

	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
		// return (<TJson>Datetime)[value];
	}

	public static readonly fieldDef = RfUpdateTimeDef;
};
