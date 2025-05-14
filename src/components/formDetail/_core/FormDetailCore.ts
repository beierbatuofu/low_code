import { getFormDetailData, postProcessInstance } from "@/api/flowcenter";

import FormDetailBase from "./FormDetailBase";

export default class FormDetailCore extends FormDetailBase {
	public static instance: FormDetailCore | null = null;
	public resMap: TJson = {};
	public formType: string = "C";
	public btnMap: TJson = {};

	public static ins() {
		if (!FormDetailCore.instance) {
			FormDetailCore.instance = new FormDetailCore();
		}
		return FormDetailCore.instance;
	}

	public getData(formCode: string = "", dataId: number = 0): Promise<Record<string, any>> {
		return new Promise((resolve, rejcet) => {
			getFormDetailData(formCode, dataId).then(async (resp: Record<string, any>) => {
				let formConfResp = resp;
				let processInstanceId = resp.data.formData.process_instance_id;
				let flowResp = await postProcessInstance({
					processInstanceId,
					dataId: String(dataId),
					formCode,
				});

				this.formType = (<Record<string, any>>formConfResp).data.form.type;
				this.resMap["formType"] = this.formType;
				this.resMap["flowResp"] = this.flowInfo.ins().setData(flowResp).data;
				this.resMap["formConfResp"] = this.formConf.ins().setData(<Record<string, any>>formConfResp, flowResp).data;
				this.resMap["flowlogResp"] = this.flowLog.ins().setData(flowResp).data;
				this.resMap["chartResp"] = this.flowChart.ins().setData(flowResp).data;
				resolve(this.resMap);
			});
		});
	}

	constructor() {
		super();
		this.btnMap["F"] = this.flowFormBtns.ins();
		this.btnMap["C"] = this.commonFormBtns.ins();
	}
}
