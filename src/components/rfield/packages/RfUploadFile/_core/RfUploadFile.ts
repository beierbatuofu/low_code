import RfieldBase from "../../../core/RfieldBase";
import RfUploadFileDef from "./RfUploadFileDef";
import RfieldCore from "../../../core/RfieldCore.ts";

RfieldCore.ins().fieldConsMap[RfUploadFileDef.type] = class RfUploadFile extends RfieldBase {
	public constructor(conf: TJson, formType: TFormType) {
		super(conf, formType, RfUploadFileDef.ins());
	}

	//querStyle
	public getValue(value: any, querStyle: string = "default") {
		if (querStyle == "default") return value;
		return value;
	}

	public static readonly fieldDef = RfUploadFileDef;
};
