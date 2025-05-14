<template>
	<el-color-picker v-model="value" :predefine="predefine" :disabled="disabled" :show-alpha="showAlpha" @change="handleChange" @active-change="activeChange"></el-color-picker>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
		name: "rvueColorPicker",
	})
	class RvueColorPicker extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-color-picker";
		@Model("change", { type: String }) color!: String;
		@Prop({ type: Array, default: () => [] }) predefine!: any[];
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) showAlpha!: boolean;
		private get value() {
			return (<any>this).color;
		}

		private set value(n: any) {
			this.$emit("change", n);
		}

		private handleChange(n: any) {
			this.$emit("handlechange", n);
		}

		private activeChange(n: any) {
			this.$emit("activeChange", n);
		}
	}
	RvueColorPicker.install = function (Vue: any) {
		Vue.component(RvueColorPicker.compName, RvueColorPicker);
	};
	export default RvueColorPicker;
</script>
<style lang="scss"></style>
