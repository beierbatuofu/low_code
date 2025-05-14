<!--- 下拉单选框 --->
<template>
	<div class="rvue-form-group">
		<rvue-select
			style="width: 100%"
			:disabled="disabled"
			v-model="selectValue"
			:multiple="multiple"
			:readonly="readonly"
			:collapse-tags="collapseTags"
			:reserve-keyword="reserveKeyword"
			:multiple-limit="multipleLimit"
			:autocomplete="autocomplete"
			:filterable="filterable"
			:allow-create="allowCreate"
			:popper-class="popperClass"
			:popper-append-to-body="popperAppendToBody"
			:placeholder="placeholder"
			:clearable="true"
		>
			<rvue-option v-for="item in setOptions" :key="item.value" :value="isStatus(item)" :label="item.label">
				{{ item.label }}
			</rvue-option>
		</rvue-select>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	import rvueSelect from "./rvueSelect.vue";
	import rvueOption from "./rvueOption.vue";

	@Component({
		mixins: [Mixins],
		name: "rvueSelect",
		components: {
			"rvue-select": rvueSelect,
			"rvue-option": rvueOption,
		},
	})
	class rvueSelectGroup extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-select-group";
		@Model("change", { type: [String, Number] }) value!: string;
		@Prop({ type: Array, default: () => [] }) options!: any[]; //options选项设置
		@Prop({ type: Boolean, default: false }) multiple!: Boolean; //是否多选
		@Prop({ type: Boolean, default: false }) clearable!: Boolean; //是否可以清空选项
		@Prop({ type: Boolean, default: false }) collapseTags!: Boolean; //多选时是否将选中值按文字的形式展示
		@Prop({ type: Boolean, default: false }) reserveKeyword!: Boolean; //多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
		@Prop({ type: Number, default: 0 }) multipleLimit!: number; //  多选时用户最多可以选择的项目数，为 0 则不限制
		@Prop({ type: String, default: "" }) autocomplete!: string; //select input 的 autocomplete 属性
		@Prop({ type: Boolean, default: false }) filterable!: Boolean; //是否可搜索
		@Prop({ type: Boolean, default: false }) allowCreate!: Boolean; //是否允许用户创建新条目，需配合 filterable 使用
		@Prop({ type: String, default: "sel-options" }) popperClass!: string; //select input 的 autocomplete 属性
		@Prop({ type: Boolean, default: true }) popperAppendToBody!: Boolean; //是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
		@Prop({ type: String, default: "label" }) props!: string; //select input 的 autocomplete 属性
		@Prop({ type: String, default: "请选择" }) placeholder!: string; //select input 的 autocomplete 属性
		@Prop({ type: Object, default: () => {} }) config!: any; //cofig配置

		private get selectValue() {
			return (<any>this).value;
		}

		private set selectValue(n: string) {
			this.$emit("change", n);
		}

		private get setOptions() {
			return (<any>this).options;
		}
		// private get disabled(){

		// }

		private isStatus(item: any) {
			if ((<any>this).config?.type == "process_status" || (<any>this).config?.type == "uploadFile" || (<any>this).config?.type == "chart") {
				return item.value;
			} else {
				return item.label;
			}
		}
	}
	rvueSelectGroup.install = function (Vue: any) {
		Vue.component(rvueSelectGroup.compName, rvueSelectGroup);
	};

	export default rvueSelectGroup;
</script>
<style lang="scss" scoped>
	// ::v-deep .el-select {
	// 	overflow: hidden !important;
	// }
</style>
