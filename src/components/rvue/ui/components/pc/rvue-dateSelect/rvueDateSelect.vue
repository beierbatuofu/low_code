<!--
 * @Author: ben
 * @LastEditTime: 2022-05-19 09:37:34
-->
<template>
	<div>
		<template v-if="!readonly">
			<el-select
				style="width: 100%"
				v-model="selectValue"
				:clearable="clearable"
				:multiple="multiple"
				:placeholder="placeholder"
				:disabled="disabled"
				:multiple-limit="multipleLimit"
				:autocomplete="autocomplete"
				:name="name"
				:filterable="filterable"
				:allow-create="allowCreate"
				:remote="remote"
			>
				<el-option v-for="item in options" :key="item.value" :label="t(item.label)" :value="item.value" :disabled="disabled"> </el-option>
			</el-select>
		</template>
		<template v-if="readonly">
			<div class="widget-readonly">
				{{ selectValue }}
			</div>
		</template>
	</div>
	<!--  -->
</template>
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	import options from "./_core/options.ts";
	import toDatetime from "./_core/toDatetime";

	@Component({
		mixins: [Mixins],
		name: "rvueDateSelect",
	})
	class rvueDateSelect extends Vue {
		@Model("change", { type: [String, Array], default: "" }) value!: string;
		@Prop({ type: Array, default: () => options }) options!: any[];
		@Prop({ type: Boolean, default: false }) multiple!: boolean;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) clearable!: boolean;
		@Prop({ type: Number, default: 0 }) multipleLimit!: number;
		@Prop({ type: String, default: "off" }) autocomplete!: string;
		@Prop({ type: String, default: "请选择" }) placeholder!: string;
		@Prop({ type: String, default: "" }) name!: string;
		@Prop({ type: Boolean, default: false }) filterable!: boolean;
		@Prop({ type: Boolean, default: false }) allowCreate!: boolean;
		@Prop({ type: Boolean, default: false }) remote!: boolean;

		public static install: (param: Vue) => any;
		public static compName = "rvue-date-select";

		private get selectValue() {
			return this.value;
		}

		private set selectValue(n: string) {
			this.$emit("change", n);
			this.$emit("changeSelectValue", toDatetime.dispath(n));
		}
	}

	rvueDateSelect.install = function (Vue: any) {
		Vue.component(rvueDateSelect.compName, rvueDateSelect);
	};

	export default rvueDateSelect;
</script>
