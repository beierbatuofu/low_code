<script lang="tsx">
	import { Component, Watch, Vue, Prop, Inject } from "vue-property-decorator";
	import menu from "./menu";
	import FlowCore, { TNodeType } from "../../_core/FlowCore";

	@Component({
		components: {
			"node-menu": menu,
		},
	})
	export default class Node extends Vue {
		@Prop({ type: Object, default: () => ({}) }) item!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) data!: Record<string, any>[];
		@Prop({ type: Object, default: () => {} }) parentData!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) branchData!: Record<string, any>;
		@Inject() flowConf!: TJson;

		private handleDelNode($event: Event) {
			let id = this.item.id;
			let lang = localStorage.getItem("lang") || "zh";
			let idx = this.data.findIndex((item: Record<string, any>) => item.id == id);
			this.$Rconfirm(`是否删除该${this.item.title[lang]}节点?`, "", {
				distinguishCancelAndClose: true,
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			})
				.then(() => {
					//del
					// node.from  node.to
					// prev.to =  next.from
					if (idx > -1) {
						//	let connect = FlowCore.ins().connect(this.data[idx - 1], this.data[idx + 1], this.data[idx]);

						this.data.splice(idx, 1);
					}
				})
				.catch(() => {});
			$event.stopPropagation();
		}

		private handleCopy($event: Event) {
			this.flowConf.copyNode = JSON.parse(JSON.stringify(this.item));
			$event.stopPropagation();
		}

		private handleSelect($event: Event) {
			this.$emit("select", this.item);
			$event.stopPropagation();
		}
		private handelNewNode(conf: Record<string, any>) {
			this.$emit("newNode", conf);
		}
		private isError() {
			if (this.item.id === "start") return false;
			if (this.item.data?.dynamic && this.item.data?.dynamic.length > 0) return false;
			if (this.item.data?.assigneeList && this.item.data?.assigneeList.length > 0) return false;
			return true;
		}

		protected render() {
			let labelBg = this.item.id == "start" ? "node-label start" : "node-label";
			let lang = localStorage.getItem("lang") || "zh";
			let scoped = this.$scopedSlots.node || function (params: any) {};
			let nodeClass = !this.isError() ? "node-content" : "node-content error";

			if (this.item.id !== "start" && this.flowConf.preview) {
				labelBg += ` status_${this.item.status || "not"}`;
			}

			return (
				<div class="node-group">
					<div class="node-wrap">
						<div class={nodeClass} node-id={this.item.id} on-click={this.handleSelect}>
							<div class={labelBg}>
								{this.item.id == "start" ? <i class="el-icon-video-play"></i> : <i class="el-icon-user"></i>}
								<rvue-tooltip
									class="item"
									props={{
										"hide-after": 0,
										effect: "dark",
										placement: "top",
										content: this.item.title[lang] || this.item.title["zh"],
									}}
								>
									<div>{this.item.title[lang] || this.item.title["zh"]}</div>
								</rvue-tooltip>
							</div>
							<div>{this.item.id !== "start" && scoped(this.item)}</div>

							{this.item.id == "start" || this.flowConf.readonly ? (
								<div></div>
							) : (
								<div class="node-menu">
									<span class="el-icon-delete" on-click={this.handleDelNode}></span>
									<span class="el-icon-document-copy" on-click={this.handleCopy}></span>
								</div>
							)}
						</div>
						<div class="line status">
							{this.flowConf.readonly ? (
								<div></div>
							) : (
								<node-menu
									props={{ data: this.data, item: this.item, parentData: this.parentData, branchData: this.branchData }}
									on={{
										newNode: this.handelNewNode,
									}}
								></node-menu>
							)}
						</div>
					</div>
				</div>
			);
		}
	}
</script>

<style lang="scss" scoped>
	.node {
		&-group {
			display: flex;
			font-size: 14px;
			justify-content: center;
			width: 100%;
		}

		&-content {
			width: 180px;
			background: #fff;
			border-radius: 4px;
			overflow: hidden;
			outline: 2px solid transparent;
			box-sizing: border-box;
		}
		&-label {
			height: 40px;

			color: #fff;
			padding: 0 14px;
			font-size: 16px;
			display: flex;
			align-items: center;
			position: relative;
			background: #fb9337;
			user-select: none;
			i {
				display: block;
			}
			.el-icon-user {
				font-size: 20px;
			}
			.el-icon-video-play {
				font-size: 24px;
			}
			div {
				position: absolute;
				top: 0;
				left: 38px;
				line-height: 40px;
				right: 38px;
				// flex: 1;
				text-align: center;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
			}
		}
		&-menu {
			height: 25px;
			display: flex;

			align-items: center;
			justify-content: flex-end;
			padding: 0 5px;
			& > span {
				display: block;
				color: #999;
				margin: 0 5px;
				cursor: pointer;
				&:hover {
					color: #666;
				}
			}
		}
	}

	.start {
		background: #268bfb;
	}
	.error {
		outline: 2px solid #f56c6c;
	}
</style>
