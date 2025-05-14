<!--
 * @Author: ben
 * @LastEditTime: 2021-12-24 14:32:54
-->
<template>
	<div>
		<el-input v-if="Object.keys(column).length == 0"></el-input>
		<component
			v-else
			:isInTable="false"
			@input="handleUpdate"
			:form="form"
			:prop="prop"
			@change="handleUpdate"
			@update="handleUpdate"
			:is="getComponent(column.type, column.component)"
			:config="column"
		>
		</component>
	</div>
</template>
<script lang="ts">
	import { config } from "chai";
	import { Vue, Component, Watch, Prop, Model, PropSync } from "vue-property-decorator";

	@Component
	export default class RelationInput extends Vue {
		@Prop({ type: String, default: "" }) placeholder!: string;
		@Prop({ type: [Array], default: () => [] }) val!: any;
		@Prop({ type: Object, default: () => ({}) }) filterData!: TJson;
		@Prop({ type: Array, default: () => [] }) dic!: any[];

		private value: any = "";
		private form: TJson = {};
		private prop = "";
		private key = 1;

		private getComponent(type: any, component: any) {
			if (!type) return;
			if (component) return component;

			return `rfield-${type}`;
		}

		private converType(type: string, value: any) {
			switch (type) {
				case "String":
					return String(value);
				case "Number":
					return Number(value);
				case "Array":
					return Array.isArray(value) ? value : [];
			}
			return value;
		}

		private get column() {
			try {
				let { targetFieldCode } = this.filterData;
				let config: any = (<any>this).$utils.deepClone(this.dic.find((conf) => conf.prop == targetFieldCode) || {});
				let sType = Object.prototype.toString.call(config.value?.custom || config.defVal).slice(8, -1);
				this.prop = targetFieldCode;
				config.defVal = this.converType(sType, this.val);
				return config;
			} catch (err) {
				return {};
			}
		}

		private handleUpdate(context: any, value: any) {
			//this.$emit("input", Array.isArray(value) ? value : [value]);
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
