<script lang="tsx">
	import { Component, Watch, Vue, Prop, Inject } from "vue-property-decorator";
	import FlowCore, { TNodeType } from "../../_core/FlowCore";
	import { TAppNode } from "../../_core/FlowDefine";

	@Component
	export default class Menu extends Vue {
		@Prop({ type: Array, default: () => [] }) data!: TAppNode[];
		@Prop({ type: Object, default: () => ({}) }) item!: Record<string, any>;
		@Prop({ type: Object, default: () => {} }) branchData!: TAppNode;
		@Inject() flowConf!: Record<string, any>;

		private handleCommand(command: TNodeType) {
			let curId = this.item.id || "";
			if (!curId) return console.warn("node id is undefined");
			let curIndex = this.data.findIndex((item: Record<string, any>) => item.id == curId);
			let FlowCoreIns = FlowCore.ins();
			let newNode = FlowCoreIns.add(command, this.flowConf.copyNode, this.branchData);
			this.data.splice(curIndex + 1, 0, newNode);
			console.log(this.branchData, "branchData");
			if (command == "node") {
				this.$emit("newNode", newNode);
			}
		}

		protected render() {
			return (
				<rvue-dropdown
					class="add-box"
					on-command={this.handleCommand}
					props={{
						trigger: "click",
					}}
				>
					<div class="add">
						<i class="el-icon-plus"></i>
					</div>
					<rvue-dropdown-menu slot="dropdown">
						<rvue-dropdown-item command="node" icon="el-icon-s-custom">
							{this.$t("newflow.approvalNode")}
						</rvue-dropdown-item>

						<rvue-dropdown-item command="branch" icon="el-icon-share">
							{this.$t("newflow.appBranch")}
						</rvue-dropdown-item>

						<rvue-dropdown-item
							props={{
								disabled: !Object.keys(this.flowConf.copyNode).length,
							}}
							command="paste"
							icon="el-icon-document-copy"
						>
							{this.$t("newflow.copyNode")}
						</rvue-dropdown-item>
					</rvue-dropdown-menu>
				</rvue-dropdown>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.add {
		&-box {
			width: 30px;
			height: 30px;
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		width: 30px;
		height: 30px;
		border-radius: 15px;
		background: #fff !important;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);

		text-align: center;
		line-height: 30px;
	}
</style>
