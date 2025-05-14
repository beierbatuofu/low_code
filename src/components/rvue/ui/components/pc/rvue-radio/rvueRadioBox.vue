<!--
 * @Author: ben
 * @LastEditTime: 2022-01-11 16:22:35
-->
<template>
	<div>
		<template v-if="!readonly">
			<rvue-radio-group
				:disabled="disabled"
				:class="layoutValue"
				v-model="select"
				:text-color="textColor"
				:fill="fill"
				:size="size"
				:style="{
					display: 'flex',
					'flex-direction': layoutValue === 'vertical' ? 'column' : 'row',
				}"
			>
				<rvue-radio
					v-for="(item, index) in setOptions"
					:label="item.label"
					:border="border"
					:disabled="disabled"
					:style="{
						display: layoutValue === 'vertical' ? 'table' : 'inline',
						marginBottom: '10px',
					}"
					:key="index"
				>
					{{ item.label }}
				</rvue-radio>
			</rvue-radio-group>
		</template>
		<template v-if="readonly">
			<div class="widget-readonly">
				{{ select }}
			</div>
		</template>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	import rvueRadio from "./rvueRadio.vue";
	import rvueRadioGroup from "./rvueRadioGroup.vue";

	@Component({
		mixins: [Mixins],
		name: "rvueRadio",
		components: {
			"rvue-radio": rvueRadio,
			"rvue-radio-group": rvueRadioGroup,
		},
	})
	class rvueRadioBox extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-radio-box";
		@Model("change", { type: String }) value!: string;
		@Prop({ type: Array, default: () => [] }) options!: any[]; //options选项设置
		@Prop({ type: String, default: "vertical" }) checkLayout!: string; // select 排列方式
		@Prop({ type: String, default: "medium" }) size!: string; // 多选框组尺寸，仅对按钮形式的 radio 或带有边框的 radio 有效   可选值 medium / small / mini
		@Prop({ type: Boolean, default: false }) border!: boolean; // 是否显示边框
		@Prop({ type: String, default: "#ffffff" }) textColor!: string; //按钮形式的 radio 激活时的文本颜色
		@Prop({ type: String, default: "#6087FD" }) fill!: string; //按钮形式的 radio 激活时的填充色和边框色
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		private handleChange(...args: any[]) {
			console.log(...args);
		}

		private get select() {
			return (<any>this).value;
		}

		private set select(n: any) {
			this.$emit("change", n);
		}

		private get setOptions() {
			return (<any>this).options;
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
	rvueRadioBox.install = function (Vue: any) {
		Vue.component(rvueRadioBox.compName, rvueRadioBox);
	};

	export default rvueRadioBox;
</script>
<style lang="scss">
	.form-designer .el-radio-group {
		@include JustityAndFlexWrap(flex, null, null, wrap);
	}
	.el-radio-group{
		flex-wrap: wrap !important;
	}
</style>
