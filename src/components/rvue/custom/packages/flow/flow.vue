<script lang="tsx">
	import { Component, Watch, Vue, Prop, Provide } from "vue-property-decorator";
	import branch from "./_packages/branch/branch.vue";
	import { FlowDefine } from "./_core/FlowDefine";
	import { refreshJump } from "@/utils/global";

	@Component({
		components: {
			"flow-branch": branch,
		},
	})
	export default class Flow extends Vue {
		@Prop({ type: Array, default: () => [] }) defaultData!: Record<string, any>[];
		@Prop({ type: Boolean, default: false }) readonly!: boolean;
		@Prop({ type: Boolean, default: false }) preview!: boolean;

		@Provide("flowConf") flowConf: Record<string, any> = {
			copyNode: {},
			readonly: false,
			preview: this.preview,
		};
		public static compName = "rvue-flow";
		public static install: (param: Vue) => any;

		private define = FlowDefine.defFlowData;
		private scale = 100;
		private list: Record<string, any> = [];
		private handleAdd() {
			if (this.scale >= 200) {
				return (this.scale = 200);
			}
			this.scale += 10;
		}

		private handleMin() {
			if (this.scale <= 10) {
				return (this.scale = 10);
			}
			this.scale -= 10;
		}

		// public setReadOnly(readonly: boolean) {
		// 	this.flowConf.readonly = readonly;
		// }

		private handleSelect(nodeConf: Record<string, any>) {
			//if (this.readonly) return;
			this.$emit("select", nodeConf);
		}

		private handelNewNode(conf: Record<string, any>) {
			this.$emit("addNode", conf);
		}

		protected render() {
			let props = { data: this.list };
			let style = {
				transform: `scale(${this.scale / 100})`,
			};

			return (
				<div class="flow-wrap" id="flow">
					<div class="flow-top">
						<div class="scale">
							<div class="el-icon-plus" on-click={this.handleAdd}></div>
							<div class="num">{((this.scale / 100) * 100).toFixed(0)}%</div>
							<div class="el-icon-minus" on-click={this.handleMin}></div>
						</div>
					</div>

					<flow-branch
						scopedSlots={{
							cond: (scope: Record<string, any>) => {
								let conds: any = this.$scopedSlots.cond
									? this.$scopedSlots.cond({
											data: scope.data,
									  })
									: [];
								return conds.map((item: Record<string, any>) => item);
							},
							node: (scope: Record<string, any>) => {
								let nodes: any = this.$scopedSlots.node
									? this.$scopedSlots.node({
											data: scope.data,
									  })
									: [];
								return nodes.map((item: Record<string, any>) => item);
							},
						}}
						style={style}
						class="flow-box"
						props={props}
						on-select={this.handleSelect}
						on-newNode={this.handelNewNode}
					></flow-branch>
				</div>
			);
		}


		private mounted() {
			window.onbeforeunload = null;
			window.onpopstate = null;
		}
		@Watch("defaultData", { immediate: true })
		private watchDefaultData() {
			this.list = JSON.parse(JSON.stringify(this.defaultData.length ? this.defaultData : FlowDefine.defFlowData));
		}

		@Watch("list", { immediate: true, deep: true })
		private watchList() {
			this.$emit("change", this.list);
			if(this.list.length>this.defaultData.length){
				let fullPath = this.$route.fullPath;
				let supPath = fullPath.substr(0, fullPath.lastIndexOf("appd/"));
				let jumpPath=supPath+'appd/'+this.$route.params.appCode+'/p/'
				refreshJump(fullPath, this, jumpPath);
			}
		}

		@Watch("readonly", { immediate: true })
		private watchReadonly() {
			this.flowConf.readonly = this.readonly;
		}
	}
</script>
<style lang="scss" scoped>
	.flow {
		&-top {
			position: fixed;
			z-index: 99;
			bottom: 20px;
			right: 20px;
			display: flex;
			font-size: 14px;
			color: #acb3bd;
			user-select: none;
			.scale {
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}
			.el-icon-plus,
			.el-icon-minus {
				height: 32px;
				width: 32px;
				background: #fff;
				text-align: center;
				line-height: 32px;
				font-size: 16px;
				border-radius: 4px;
				cursor: pointer;
				box-shadow: 1px 1px 5px 0px rgba(182, 182, 182, 0.6);
				transition: all 0.3s;
				&:hover {
					box-shadow: 0px 0px 2px 0px rgb(182, 182, 182, 0.6);
				}
			}
			.num {
				font-size: 16px;
				width: 62px;
				text-align: center;
			}
		}
		&-wrap {
			min-height: 100%;
			position: relative;
			background: #eff4f7
				url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACtJREFUeNpi3Lhx438GBgZGPz8/BlyACaSAgQBg/P//PyE1YJOGryKAAAMALGMHDEL/HL4AAAAASUVORK5CYII=);
		}
		&-box {
			width: 100%;
			transition: transform 0.3s;
			position: relative;
			display: flex;
			align-items: center;
			min-width: min-content;
			font-size: 14px;
			flex-direction: column;

			min-height: 100%;
			padding: 80px 10px 20px;
			transform-origin: top left;
		}
	}
	::v-deep {
		.line {
			height: 120px;

			position: relative;

			&::before {
				content: "";
				background: #919191;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 50%;
				width: 1px;
				transform: translateX(-1px);
				z-index: 1;
			}
			// &::after {
			// 	content: "";
			// 	border: 8px solid #919191;
			// 	border-left: 5px solid transparent;
			// 	border-right: 5px solid transparent;
			// 	border-bottom: 0;
			// 	position: absolute;
			// 	height: 0;
			// 	width: 0;
			// 	overflow: hidden;
			// 	font-size: 0;
			// 	bottom: 0;
			// 	left: 50%;
			// 	transform: translateX(-50%);
			// 	z-index: 2;
			// }
		}

		.add {
			width: 30px;
			height: 30px;
			border-radius: 15px;
			background: #fff !important;
			box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -70%);
			text-align: center;
			line-height: 30px;
			.el-icon-plus {
				color: #4c81ff;
				cursor: pointer;
			}
			&:focus:active {
				background: #fff !important;
			}
		}
	}
</style>
