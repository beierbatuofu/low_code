import RfieldBase from "../../../core/RfieldBase";
import RfDatetimeDef from "./RfDatetimeDef";
import Datetime from "./Datetime";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfDatetimeDef.type] = class RfDatetime extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfDatetimeDef.ins());
	}

	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return (<TJson>Datetime)[value];
	}

	public static readonly fieldDef = RfDatetimeDef;
};
