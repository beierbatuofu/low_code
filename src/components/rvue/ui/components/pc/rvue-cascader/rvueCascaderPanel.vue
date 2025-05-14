<template>
	<el-cascader-panel ref="elCascaderPanel" :options="options" :props="props" @change="handleChange" @expand-change="handleExpandChange" v-model="chooseVal">
		<slot></slot>
	</el-cascader-panel>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { VNode } from "vue";
	export interface TRrvueCascader extends Vue {
		getCheckedNodes: (n: VNode) => any;
		clearCheckedNodes: () => any;
	}
	@Component({})
	class RvueCascaderPanel extends Vue implements TRrvueCascader {
		public static install: (param: Vue) => any;
		public static compName = "rvue-cascader-panel";
		@Prop({ type: Array }) options!: any[];
		@Prop({ type: Object }) props!: object;
		@Model("change", { type: [String, Number] }) value!: string | number;

		private get chooseVal() {
			return this.value;
		}

		private set chooseVal(n: any) {
			this.$emit("value", n);
		}

		public getCheckedNodes(n: VNode) {
			return (<TRrvueCascader>this.$refs.elCascaderPanel).getCheckedNodes(n);
		}

		public clearCheckedNodes() {
			return (<TRrvueCascader>this.$refs.elCascaderPanel).clearCheckedNodes();
		}

		private handleChange(n: VNode) {
			this.$emit("change", n);
		}
		private handleExpandChange(n: [string | number]) {
			this.$emit("expand-change", n);
		}
	}
	RvueCascaderPanel.install = function (Vue: any) {
		Vue.component(RvueCascaderPanel.compName, RvueCascaderPanel);
	};
	export default RvueCascaderPanel;
</script>
