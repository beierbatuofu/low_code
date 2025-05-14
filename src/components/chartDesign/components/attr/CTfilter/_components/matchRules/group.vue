<script lang="tsx">
	import { Component, Watch, Vue, Prop, Provide } from "vue-property-decorator";
	import Row from "./row.vue";
	import RuleCore from "./RuleCore";

	@Component({
		components: {
			"match-rules-row": Row,
		},
	})
	export default class Group extends Vue {
		@Prop({ type: Array, default: () => [] }) options!: Record<string, any>[];
		@Prop({ type: Array, default: () => [] }) rules!: Record<string, any>[];
		@Prop({ type: Array, default: () => [] }) group!: Record<string, any>[];

		private handleClick() {
			this.group.push(RuleCore.ins().createRowData());
		}

		protected render() {
			return (
				<div class="group-wrap">
					{this.group.map((row: Record<string, any>, idx: number) => (
						<match-rules-row
							on={{
								del: () => {
									//if (this.rules.length < 2 && this.group.length < 2) return;
									this.group.splice(idx, 1);
									this.$emit("del");
								},
							}}
							props={{
								row: row,
								options: this.options,
								group: this.group,
							}}
						></match-rules-row>
					))}
					<rvue-button
						class="and-btn"
						on={{
							click: this.handleClick,
						}}
					>
						<i class="el-icon-circle-plus"></i>
						{this.$t("linkDataDialog.andCondition")}
					</rvue-button>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.group {
		&-wrap {
			background: rgba(43, 52, 65, 0.05);
			border-radius: 2px;
			padding: 10px 20px;
			margin-bottom: 10px;
		}
	}
	.and-btn {
		margin-top: 10px;
		color: #999;
		border: 1px #999 dotted;
		cursor: pointer;
		.el-icon-circle-plus {
			margin-right: 2px;
		}
	}
	:v-deep {
		.rvue-form-group {
			min-height: 36px !important;
		}
	}
</style>
