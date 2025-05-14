export interface TAppNode {
	id: string;
	data: Record<string, any>;
	type: "node" | "condition" | "branch";
	title: Record<string, any>;
	status: string;
	from?: string;
	to?: string;
	branchData?: TAppNode;
	children?: TAppNode[];
}
export interface TBranch extends TAppNode {
	children: TBranch[];
}

export module FlowDefine {
	let randoms: Set<number> = new Set();

	const setId = (type: string = "") => {
		let r: number = window.crypto.getRandomValues(new Uint32Array(1))[0];
		randoms.add(r);
		while (!randoms.has(r)) {
			r = window.crypto.getRandomValues(new Uint32Array(1))[0];
		}
		return type + "_" + Date.now() + "_" + r;
	};

	export const defFlowData = [
		{
			id: "start",
			title: {
				zh: "开始节点",
				en: "",
			},
			data: {},
			type: "node",
		},
		{
			id: "end",
			title: {
				zh: "结束",
				en: "",
			},
			data: {},
			type: "node",
		},
	];

	export class Branch {
		public static instance: null | Branch = null;
		public static ins() {
			if (!(Branch.instance instanceof Branch)) {
				Branch.instance = new Branch();
			}
			return Branch.instance;
		}

		public newCondition(): TAppNode {
			return {
				id: setId("condition"),
				title: {
					zh: "条件",
					en: "",
				},
				type: "condition",
				status: "",
				data: {},
				children: [],
			};
		}

		public newBranch(): TAppNode {
			return {
				id: setId("branch"),
				title: {
					zh: "",
					en: "",
				},
				data: {},
				type: "branch",
				status: "",
				children: [this.newCondition(), this.newCondition()],
			};
		}
	}

	export class AppNode {
		public static instance: null | AppNode = null;
		public static ins() {
			if (!(AppNode.instance instanceof AppNode)) {
				AppNode.instance = new AppNode();
			}
			return AppNode.instance;
		}
		newNode(): TAppNode {
			return {
				id: setId("node"),
				title: {
					zh: "流程节点",
					en: "",
				},

				data: {},
				type: "node",
				status: "",
			};
		}
	}
}
