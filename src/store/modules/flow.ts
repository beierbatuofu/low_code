import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import { getFields, getAutoNodeAppList, getAutoNodeFieldList } from "@/api/flow";
import { getFormSingle } from "@/api/form";
import store from "@/store";

export interface FlowState {
	tools: Array<{ [key: string]: any }>;
	fields: Array<any>;
	targetNode: any;
	flowForm: any[];
	processAttr: { [key: string]: any };
	conditionData: any[];
	appList: any[];
	appField: any[];
}

let setNodeType: any = (function setNodeType() {
	let nodeType: any = {};
	nodeType[(nodeType["node"] = 1)] = "node";
	nodeType[(nodeType["autoNode"] = 9)] = "auto";
	return nodeType;
})();

const FlowToolsData = [
	{
		group: "流程图",
		children: [
			{
				name: "流程节点",
				icon: "el-icon-edit-outline",

				data: {
					text: "流程节点",
					textOffsetX: -20,
					textOffsetY: 0,
					rect: {
						width: 160,
						height: 40,
					},
					iconFamily: "element-icons",
					icon: "",
					iconSize: 16,
					iconColor: "#6087FD",
					imageAlign: "center",
					name: "rectangle",
					fillStyle: "#E3F6FF",
					data: {
						nodeType: setNodeType.node,
					},
				},
			},
			{
				name: "自动化节点",
				icon: "el-icon-aim",

				data: {
					text: "自动化节点",
					textOffsetX: -20,
					textOffsetY: 0,
					rect: {
						width: 160,
						height: 40,
					},
					iconFamily: "element-icons",
					icon: "",
					iconSize: 16,
					iconColor: "#6087FD",
					imageAlign: "center",
					name: "rectangle",
					fillStyle: "#fffce3",
					data: {
						nodeType: setNodeType.autoNode,
					},
					type: setNodeType.autoNode,
				},
			},
		],
	},
];

@Module({ dynamic: true, store, name: "flow" })
class Flow extends VuexModule implements FlowState {
	public tools = FlowToolsData;
	public fields = [];
	public targetNode = {};
	public flowForm = [];
	public processAttr = {};
	public nodeType = setNodeType;
	public conditionData = [];
	public appList = [];
	public appField = [];

	@Mutation
	public SET_APPFIELD(arr: any) {
		this.appField = arr;
	}

	@Mutation
	private SET_FIELDS(arr: any) {
		this.fields = arr.filter((item: Record<string, any>) => !["tab"].includes(item.type));
	}

	@Mutation SET_APPLIST(arr: any) {
		this.appList = arr;
	}

	@Mutation
	private SET_FLOWFORM(arr: any) {
		this.flowForm = arr;
		this.conditionData = JSON.parse(JSON.stringify(arr));
	}

	@Mutation
	private SET_TARGETNODE(node: any) {
		this.targetNode = node;
	}

	@Mutation
	public setProcessAttr(data: any) {
		let attr = this.processAttr;
		this.processAttr = {
			...attr,
			...data,
		};
	}

	@Action
	public async setAppField(data: any) {
		try {
			let res = await getAutoNodeFieldList(data);
			this.SET_APPFIELD(res.data);
		} catch (err) {}
	}

	@Action
	public async setTargetAppList(data: { formCode: string; operationType: string | number }) {
		try {
			let res = await getAutoNodeAppList(data);
			this.SET_APPLIST(res.data);
		} catch (err) {}
	}

	@Action
	public setFlowForm(arr: any) {
		this.SET_FLOWFORM(arr);
	}

	@Action
	public setTargetNode(node: any) {
		this.SET_TARGETNODE(node);
	}

	@Action
	public setFields(data: any) {
		// let { appCode, formCode } = data;
		// getFormSingle(appCode, formCode).then((resp: TResponse) => {
		// 	if (resp.code == 0) this.SET_FIELDS(resp.data.structure?.configList || []);
		// });
	}
}

export const FlowModule = getModule(Flow);
