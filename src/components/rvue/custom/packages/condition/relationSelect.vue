<!--
 * @Author: ben
 * @LastEditTime: 2022-03-07 17:31:15
-->
<template>
	<div>
		<rvue-select :multiple="multiple" v-model="value" :filterable="filterable" :placeholder="placeholder" @change="handleChange">
			<rvue-option style="width: 350px" v-for="(item, index) in resetOptions" :key="index" :value="item.fieldIdAsName || item.code || item.fieldId" :label="getName(item)">{{
				getName(item)
			}}</rvue-option>
		</rvue-select>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, PropSync } from "vue-property-decorator";
	const types = [
		["input", "select", "process_status", "radio", "textarea"],
		["number"],
		["datetime", "create_time", "update_time"],
		["userRadio", "creater"],
		["user"],
		["dept"],
		["deptRadio"],
		["selectMulti", "checkbox"],
	];

	@Component
	export default class RelationSelect extends Vue {
		@Prop({ type: Boolean, default: true }) filterable!: boolean;
		@Prop({ type: String, default: "" }) placeholder!: string;
		@Prop({ type: Object, default: () => ({}) }) filterData!: TJson;
		@Prop({ type: Array, default: () => [] }) options!: any[];

		@Prop({ type: Boolean, default: false }) multiple!: boolean;
		@PropSync("val", { type: [Array, String], default: () => [] }) syncVal!: any;

		private value: any = [];

		private handleChange(e: any) {
			this.$emit("change", e);
		}

		private get resetOptions() {
			let options = this.options;
			let { type } = this.filterData;
			if (!type) return options;

			let result: any = types.find((arr) => arr.includes(type));
			return options.filter((item) => result.includes(item.type));
		}

		@Watch("options")
		onChnageOptions() {
			let curItem: any = this.resetOptions.find((item: any): any => {
				return item.fieldId == this.value || item.code == this.value;
			});
			if (!curItem || this.resetOptions.length == 0) {
				this.value = "";
			}
		}

		protected created() {
			this.value = String(this.syncVal) || "";
			let sOptions = JSON.stringify(this.resetOptions);
			let reg = new RegExp(this.value);
			if (this.value && !reg.test(sOptions) && sOptions != "[]") {
				this.syncVal = "";
			}
		}

		private getName(item: any) {
			let lang: any = localStorage.getItem("lang");

			if (item.hasOwnProperty("title")) {
				return item.title[lang];
			}

			return item.name;
		}
	}
</script>
<style lang="scss">
	.code-error {
		.el-input__inner {
			border-color: red;
		}
	}
</style>
