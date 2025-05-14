<template>
	<el-form-item v-if="config.fieldId" :class="{}" :label="!config.titleShow || parentType || (config.tab && parentType == 'table') ? '' : $options.filters.getLang(config)">
		<div class="widget-config-desc" v-html="config.desc"></div>
		<component
			:ref="config.fieldId"
			:index="index"
			:select.sync="selectWidget"
			:widgetForm="widgetForm"
			mode="design"
			:is="`rfield-${config.type}`"
			v-bind="{ name: config.fieldId }"
			:config="config"
			:tableProp="tableProp"
			:columnIndex="columnIndex"
			@selectTableIdx="selectTableIdx"
			@selectTabIdx="selectTabIdx"
			:tab="tab"
			:tabClickMaps="tabClickMaps"
		></component>
	</el-form-item>
</template>
<script>
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	export default {
		name: "widget-form-item",
		props: ["config", "isInTable", "widgetForm", "select", "index", "tableProp", "columnIndex", "inTab", "tab", "tabClickMaps"],

		data() {
			return {
				selectWidget: this.select,
				loading: false,
				whilelist: ["table", "tab"],
			};
		},
		methods: {
			selectTabIdx(parentId, groupIdx, rowIdx, comp) {
				this.$emit("selectBoxIdx", parentId, groupIdx, rowIdx, comp);
			},
			selectTableIdx(tid, groupIdx, rowIdx, comp) {
				this.$emit("selectTableIdx", tid, groupIdx, rowIdx, comp);
			},
		},
		computed: {
			parentType() {
				let parent = RfieldCore.ins().getFieldParent(this.config.fieldId, this.widgetForm.configList);
				// console.log(parent, this.config.fieldId, this.widgetForm.configList);
				return parent && parent.hasOwnProperty("type") ? parent.type : "";
			},
		},
		watch: {
			config: {
				handler: function () {
					let oFiled = RfieldCore.ins().createField(this.config);
					this.$emit("updateFieldConf", oFiled.config);
				},
				immediate: true,
			},
			select(val) {
				this.selectWidget = val;
			},
			selectWidget: {
				handler(val) {
					this.$emit("update:select", val);
				},
				deep: true,
			},
		},
	};
</script>
