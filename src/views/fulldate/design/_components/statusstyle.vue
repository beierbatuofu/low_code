<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";

	@Component
	export default class StatusStyle extends Vue {
		@Prop({ type: Object, default: () => ({}) }) conf!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) data!: TFullDateData;

		private get dicData() {
			console.log(this.conf, "this.conf");
			return this.conf.dicData || [];
		}

		private styleOptions = [
			{ label: "red", value: "red" },
			{ label: "blue", value: "blue" },
			{ label: "green", value: "green" },
			{ label: "orange", value: "orange" },
			{ label: "gray", value: "gray" },
		];

		private handleCommand(v: string, idx: number, opt: Record<"value" | "label", string>) {
			this.$set(this.data.status.styles, opt.label, v);
		}

		private picker(idx: number, opt: Record<"value" | "label", string>) {
			return (
				<el-dropdown
					on={{
						command: (v: string) => this.handleCommand(v, idx, opt),
					}}
					trigger="click"
					placement="bottom-start"
				>
					<div class="picker">
						<i class={`el-icon-arrow-down el-icon--right fulldata-${this.data.status.styles[opt.label] || "blue"}`}></i>
					</div>
					<el-dropdown-menu slot="dropdown">
						{this.styleOptions.map((op: Record<"value" | "label", string>) => (
							<el-dropdown-item props={{ command: op.value }}>
								<div class={`fulldata-${op.value} item`}></div>
							</el-dropdown-item>
						))}
					</el-dropdown-menu>
				</el-dropdown>
			);
		}

		protected render() {
			return (
				<div class="wrap">
					{this.dicData.map((opt: Record<"value" | "label", string>, idx: number) => (
						<div class="option">
							<div class="p">{this.picker(idx, opt)}</div>
							<span class="t">{opt.label}</span>
						</div>
					))}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-dropdown-menu__item {
			padding: 0 10px;
		}
	}
	.item {
		height: 25px;
		width: 25px;
	}
	.wrap {
		height: 150px;
		overflow: auto;
	}
	.picker {
		width: 25px;
		height: 25px;
		border: 1px solid #dcdfe6;
		display: flex;
		align-items: center;
		justify-content: center;
		i {
			display: block;
			margin: 0;
			width: 18px;
			height: 18px;
			text-align: center;
			line-height: 18px;
			font-size: 12px;
		}
	}
	.option {
		display: flex;
		align-items: center;

		margin-top: 15px;
		.p {
			margin-right: 10px;
		}
		.t {
			color: #666;
		}
	}
	.fulldata {
		&-blue {
			background: #409eff;
			border-color: #409eff;
			color: #fff;
		}
		&-green {
			background: #67c23a;
			border-color: #67c23a;
			color: #fff;
		}
		&-orange {
			background: #e6a23c;
			border-color: #e6a23c;
			color: #fff;
		}
		&-red {
			background: #f56c6c;
			border-color: #f56c6c;
			color: #fff;
		}
		&-gray {
			background: #909399;
			border-color: #909399;
			color: #fff;
		}
	}
</style>
