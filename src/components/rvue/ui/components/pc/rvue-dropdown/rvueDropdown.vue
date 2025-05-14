<template>
	<el-dropdown
		:hide-timeout="hideTimeout"
		:show-timeout="showTimeout"
		:hide-on-click="hideOnClick"
		:type="type"
		:split-button="splitButton"
		:trigger="trigger"
		:placement="placement"
		:tabindex="tabindex"
		:disabled="disabled"
		@visible-change="handleVisible"
		@command="handleCommand"
		@click="handleClick"
	>
		<slot></slot>
		<template slot="dropdown">
			<slot name="dropdown"></slot>
		</template>
	</el-dropdown>
</template>

<script lang="ts">
	import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	@Component({
		mixins: [Mixins],
		name: "rvueDropDown",
	})
	class RvueDropDown extends Vue {
		@Prop({ type: String, default: "click" }) trigger!: "hover" | "click";
		@Prop({ type: String, default: () => "bottom-start" }) placement!: string;
		@Prop({ type: String }) size!: "medium" | "small" | "mini";
		@Prop({ type: Boolean, default: false }) splitButton!: boolean;
		@Prop({ type: Boolean, default: true }) hideOnClick!: boolean;
		@Prop({ type: Number, default: 250 }) showTimeout!: number;
		@Prop({ type: Number, default: 250 }) hideTimeout!: number;
		@Prop({ type: Number, default: 0 }) tabindex!: number;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: String }) type!: string;

		public static install: (param: Vue) => any;
		public static compName = "rvue-dropdown";

		private handleVisible() {
			this.$emit("visible-change");
		}

		private handleCommand(command: any) {
			this.$emit("command", command);
		}

		private handleClick() {
			this.$emit("click");
		}
	}
	RvueDropDown.install = function (Vue: any) {
		Vue.component(RvueDropDown.compName, RvueDropDown);
	};
	export default RvueDropDown;
</script>
<style lang="scss" scoped></style>
