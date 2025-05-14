<template>
	<div class="ct-container">
		<div class="choose-btn"><i class="el-icon-plus"></i>{{ formConfig.code && $route.params.type == "costum" ? "数据源:dataset1" : $t("chartDesign.plzDataSource") }}</div>
		<div class="target-form" @click="visible = true">{{ formName || "请选择" }}</div>
		<CTdatadialog :data="data" :visible.sync="visible" :formConfig="formConfig" :formTitle.sync="formTitle" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	import CTdatadialog from "./CTdata/CTdatadialog.vue";

	@Component({
		components: {
			CTdatadialog,
		},
	})
	export default class CTdata extends BaseAttr {
		private visible: Boolean = false;
		private formTitle: String = "";

		private get formName() {
			if (this.formTitle) return this.formTitle;
			try {
				return this.formConfig.formName["zh"];
			} catch (err) {
				return "";
			}
		}
	}
</script>
<style lang="scss" scoped>
	.target-form {
		padding: 10px;
		@include JustityAndFlexWrap(flex, center, center, null);
		border: 1px solid #eee;
		background: #ffffff;
	}
	.choose-btn,
	.target-form {
		cursor: pointer;
		margin-bottom: 10px;
		color: #525d6d;
		font-weight: 600;
	}
</style>
