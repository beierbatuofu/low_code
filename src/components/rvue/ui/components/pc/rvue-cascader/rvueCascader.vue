<template>
	<el-cascader
		ref="elCascader"
		v-model="chooseVal"
		:options="options"
		:props="props"
		:placeholder="placeholder"
		:disabled="disabled"
		:clearable="clearable"
		:show-all-leaves="showAllLevels"
		:collapse-tags="collapseTags"
		:separator="separator"
		:filterable="filterable"
		:filter-method="filterMethod"
		:before-filter="beforeFilter"
		:popperClass="popperClass"
		@change="handleChange"
		@expand-change="handleExpandChange"
		@blur="handleBlur"
		@focus="handleFocus"
		@visible-change="handleVisibleChange"
		@remove-tag="handleRemoveTag"
	>
		<slot></slot>
	</el-cascader>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	import { VNode } from "vue";

	export interface TRrvueCascader extends Vue {
		getCheckedNodes: (n: VNode) => any;
	}

	@Component({
		mixins: [Mixins],
		name: "rvueCascader",
	})
	class RvueCascader extends Vue implements TRrvueCascader {
		public static install: (param: Vue) => any;
		public static compName = "rvue-cascader";
		@Model("change", {}) value!: any;
		@Prop({ type: Array }) options!: any[];
		@Prop({ type: Object }) props!: object;
		@Prop({ type: String, default: "请选择" }) placeholder!: string;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) clearable!: boolean;
		@Prop({ type: Boolean, default: false }) showAllLevels!: boolean;
		@Prop({ type: Boolean, default: false }) collapseTags!: boolean;
		@Prop({ type: String, default: "/" }) separator!: string;
		@Prop({ type: Boolean }) filterable!: boolean;
		@Prop({ type: Function, default: (node: any, keyword: any) => {} }) filterMethod!: () => void;
		@Prop({ type: Number, default: 300 }) debounce!: number;
		@Prop({ type: Function, default: (value: any) => {} }) beforeFilter!: () => void;
		@Prop({ type: String }) popperClass!: string;

		public getCheckedNodes(n: VNode) {
			return (<TRrvueCascader>this.$refs.elCascader).getCheckedNodes(n);
		}

		private get chooseVal() {
			return this.value;
		}

		private set chooseVal(n: any) {
			this.$emit("value", n);
		}

		private handleChange(n: any) {
			this.$emit("change", n);
		}
		private handleExpandChange(n: [string | number]) {
			this.$emit("ExpandChange", n);
		}
		private handleBlur(e: Event) {
			this.$emit("blur", e);
		}
		private handleFocus(e: Event) {
			this.$emit("focus", e);
		}
		private handleVisibleChange(e: Event) {
			this.$emit("visible-change", e);
		}
		private handleRemoveTag(n: any) {
			this.$emit("remove-tag", n);
		}
	}
	RvueCascader.install = function (Vue: any) {
		Vue.component(RvueCascader.compName, RvueCascader);
	};
	export default RvueCascader;
</script>
