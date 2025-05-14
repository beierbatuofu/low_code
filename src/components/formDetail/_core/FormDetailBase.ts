import RefieldCore from "@/components/rfield/core/RfieldCore.ts";

enum Tbtns {
	"doPass" = "pass",
	"doOver" = "end",
	"doBack" = "back",
}

export default abstract class FormDetailDefine {
	public flowInfo = class FlowInfo {
		public data: TJson = {};
		public static instance: FlowInfo | null = null;
		public static ins(): FlowInfo {
			if (!FlowInfo.instance) {
				FlowInfo.instance = new FlowInfo();
			}
			return FlowInfo.instance;
		}
		public setData(res: TJson): FlowInfo {
			this.data = {};
			if (res.data) {
				this.data = res.data.processInfo;
			}

			return this;
		}
	};

	public formConf = class FormConf {
		public static instance: FormConf | null = null;
		public data: TJson = {};
		public static ins() {
			if (!FormConf.instance) {
				FormConf.instance = new FormConf();
			}
			return FormConf.instance;
		}

		private setTablePerm(nodePerm: Record<string, any>, conf: Record<string, any>, nodeId: string) {
			let { isView, isEdit } = nodePerm;
			if (nodeId == "end") {
				isView = true;
				isEdit = true;
			}
			conf.children.forEach((item: Record<string, any>) => {
				item.edit = isEdit;
				item.visible = isView;
			});
		}

		private setPerm(configList: Record<string, any>[], permission: Record<string, any>[], nodeId: string) {
			configList.forEach((fConf: TJson) => {
				let curNodePerm = permission.find((perm: TJson) => perm.fieldId == fConf.fieldId) || {};

				if (fConf.type == "tab") {
					fConf.children.forEach((ite: Record<string, any>) => {
						this.setPerm(ite.configList, permission, nodeId);
					});
				}

				if (fConf.type == "table" && Object.keys(curNodePerm).length) {
					this.setTablePerm(curNodePerm, fConf, nodeId);
				}

				if (curNodePerm.hasOwnProperty("fieldId")) {
					fConf.edit = curNodePerm.isEdit;
					fConf.visible = curNodePerm.isView;
				}
				if (nodeId == "end") {
					fConf.edit = true;
					fConf.visible = true;
				}
			});
		}

		public setData(res: TJson, flowInfo: Record<string, any>): FormConf {
			this.data = {};
			let { multiLanguage: formTitle } = res.data.form;
			let { configList, jscode } = res.data.form.dstructure;
			let nodeId = flowInfo.data?.processInfo?.currentNodeId;
			let formData: TJson = {};

			let defNodeData: TJson =
				flowInfo.data?.processInfo?.currentNodeStructure && typeof flowInfo.data.processInfo.currentNodeStructure == "string"
					? JSON.parse(flowInfo.data.processInfo.currentNodeStructure).data
					: {};

			let permission = defNodeData?.permission || [];

			this.setPerm(configList, permission, nodeId);
			configList.forEach((fConf: TJson) => {
				let curNodePerm = permission.find((perm: TJson) => perm.fieldId == fConf.fieldId) || {};
				if (curNodePerm.hasOwnProperty("fieldId")) {
					fConf.edit = curNodePerm.isEdit;
					fConf.visible = curNodePerm.isView;
				}
				if (nodeId == "end") {
					fConf.edit = true;
					fConf.visible = true;
				}
			});

			Object.keys(res.data.formData).forEach((fieldId: string) => {
				if (!RefieldCore.sysfieldIds.includes(fieldId)) {
					try {
						let object = JSON.parse(res.data.formData[fieldId]);
						if (typeof object == "object") {
							formData[fieldId] = JSON.parse(res.data.formData[fieldId]);
						}
					} catch (err) {}
					formData[fieldId] = res.data.formData[fieldId];
				}
			});

			let taskId = res.data.taskId;

			this.data = {
				resFormData: res.data.formData,
				configList,
				formData,
				taskId,
				process_instance_id: res.data.formData?.process_instance_id,
				formTitle,
				jscode,
				permission: res.data.permission,
				doCreator: res.data.doCreator,
				structure: res.data.form.structure,
			};

			return this;
		}
	};

	public flowLog = class FlowLog {
		public static instance: FlowLog | null = null;
		public data: TJson[] = [];
		public static ins() {
			if (!FlowLog.instance) {
				FlowLog.instance = new FlowLog();
			}
			return FlowLog.instance;
		}

		public setData(res: TJson) {
			this.data = [];
			if (res.data) {
				this.data = res.data.logs || [];
			}

			return this;
		}
	};

	public flowChart = class FlowChart {
		public static instance: FlowChart | null = null;
		public static ins() {
			if (!FlowChart.instance) {
				FlowChart.instance = new FlowChart();
			}
			return FlowChart.instance;
		}
		public data: Record<string, any>[] = [];
		public setData(res: TJson) {
			this.data = [];
			if (res.data) {
				this.data = res.data.routeInfo || [];
			}

			return this;
		}
	};

	public commonFormBtns = class CommonFormBnts {
		public uiBtns: string[] = [];
		public oUiBtns: string[] = [];
		public is_Start: boolean = false;
		public is_userAuthority: boolean = false;

		public getBtns(permission: string[], doCreator: boolean) {
			//doCreator
			this.uiBtns = [];
			this.oUiBtns = [];
			if (doCreator) this.uiBtns = ["edit", "del"];
			return this;
		}

		public edit() {
			this.oUiBtns = ["edit", "del"];
			this.uiBtns = ["submit", "cancel"];
			return this;
		}

		public static instance: null | CommonFormBnts = null;
		public static ins() {
			if (!CommonFormBnts.instance) {
				CommonFormBnts.instance = new CommonFormBnts();
			}
			return CommonFormBnts.instance;
		}
	};

	public flowFormBtns = class FlowFormBtns {
		public uiBtns: string[] = [];
		public oUiBtns: string[] = [];
		public is_Start: boolean = false;
		public is_userAuthority: boolean = false;

		public getBtns(permission: string[] | null, doCreator: boolean) {
			this.uiBtns = [];
			this.oUiBtns = [];
			permission && permission.forEach((key) => this.uiBtns.push(Tbtns[<keyof typeof Tbtns>key]));

			// this.uiBtns = ["pass", "ts", "end", "back"];
			// if (this.is_Start) this.uiBtns = ["submit", "ts", "end"];
			// if (!this.is_userAuthority) this.uiBtns = [];

			return this;
		}
		public static instance: null | FlowFormBtns = null;
		public static ins() {
			if (!FlowFormBtns.instance) {
				FlowFormBtns.instance = new FlowFormBtns();
			}
			return FlowFormBtns.instance;
		}
	};
}
