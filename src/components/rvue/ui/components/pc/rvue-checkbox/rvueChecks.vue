<template>
	<div>
		<template v-if="!readonly">
			<el-checkbox-group
				:class="layoutValue"
				:style="{
					'flex-direction': layoutValue === 'vertical' ? 'column' : 'row',
				}"
				:disabled="disabled"
				v-model="select"
				:max="max"
				:min="min"
				:text-color="textColor"
				:fill="fill"
			>
				<el-checkbox
					:style="{
						display: layoutValue === 'vertical' ? 'table' : 'inline',
					}"
					v-for="(item, index) in setOptions"
					:label="item.label"
					:key="index"
					:true-label="trueLabel"
					:false-label="falseLabel"
					:checked="checked"
					:border="border"
				>
					{{ item.label }}
				</el-checkbox>
			</el-checkbox-group>
		</template>
		<template v-if="readonly">
			<div class="widget-readonly">
				{{ String(select) }}
			</div>
		</template>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
		name: "rvueChecks",
	})
	class RvueChecks extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-checks";

		@Model("change", { type: Array }) value!: any[];

		@Prop({ type: Array, default: () => [] }) options!: any[]; //options选项设置
		@Prop({ type: String, default: "vertical" }) checkLayout!: string; // checkbox 排列方式
		@Prop({ type: String, default: "medium" }) size!: string; // 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效   可选值 medium / small / mini
		@Prop({ type: Boolean, default: false }) border!: boolean; // 是否显示边框
		@Prop({ type: Number, default: 300 }) max!: number; //  可被勾选的 checkbox 的最大数量
		@Prop({ type: Number, default: 0 }) min!: number; //  可被勾选的 checkbox 的最小数量
		@Prop({ type: String, default: "#ffffff" }) textColor!: string; //按钮形式的 Checkbox 激活时的文本颜色
		@Prop({ type: String, default: "#6087FD" }) fill!: string; //按钮形式的 Checkbox 激活时的填充色和边框色

		@Prop({ type: String || Number, default: "" }) trueLabel!: string | Number; //选中时的值
		@Prop({ type: String || Number, default: "" }) falseLabel!: string | Number; //没有选中时的值
		@Prop({ type: Boolean, default: false }) checked!: Boolean; //当前是否勾选

		private get select() {
			return (<any>this).value;
		}

		private set select(n: any) {
			this.$emit("change", n);
		}

		private get setOptions() {
			try {
				return (<any>this).options;
			} catch (err) {
				return [];
			}
		}

		private get layoutValue() {
			return (<any>this).checkLayout;
		}

		private getLayout() {
			return {
				display: this.layoutValue === "vertical" ? "inline" : "block",
				marginBottom: "10px",
			};
		}
	}
	RvueChecks.install = function (Vue: any) {
		Vue.component(RvueChecks.compName, RvueChecks);
	};
	export default RvueChecks;
</script>
<style lang="scss" scoped>
	.el-checkbox {
		white-space: normal;
		margin-right: 20px;
		line-height: 24px;
	}
	::v-deep .el-checkbox__label {
		display: inline-block;
		white-space: pre-line;
		word-wrap: break-word;
		overflow: hidden;
		vertical-align: middle;
		line-height: 18px;
		max-width: 80%;
	}
	::v-deep.el-checkbox__inner {
		background-color: #6087fd !important;
		border-color: #6087fd !important;
	}
</style>
