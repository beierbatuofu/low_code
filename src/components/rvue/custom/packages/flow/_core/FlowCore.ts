import FlowBase from "./FlowBase";
import { FlowDefine, TAppNode } from "./FlowDefine";

export type TNodeType = "node" | "branch" | "paste";

export default class FlowCore extends FlowBase {
	public static define = FlowDefine;
	public static instance: FlowCore | null = null;
	public static ins() {
		if (!(FlowCore.instance instanceof FlowCore)) {
			FlowCore.instance = new FlowCore();
		}
		return FlowCore.instance;
	}

	public add(nodeType: TNodeType, copyNode: Record<string, any> = {}, branchData: TAppNode): TAppNode {
		let data = {};
		switch (nodeType) {
			case "node":
				data = FlowCore.define.AppNode.ins().newNode();
				break;
			case "paste":
				let { id } = FlowCore.define.AppNode.ins().newNode();
				data = JSON.parse(
					JSON.stringify({
						...copyNode,
						id,
					})
				);
				break;
			case "branch":
				data = FlowCore.define.Branch.ins().newBranch();
			default:
				break;
		}

		return <TAppNode>data;
	}
}
