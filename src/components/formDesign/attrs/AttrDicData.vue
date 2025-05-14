<!--
* @FileDescription: CheckBox组件的[选项内容]属性: 3个选项(默认)
* @Author: BaoShengSheng
* @Date: 2021-03-26
* Copyright © 2021. All rights reserved.
-->
<template>
	<div class="widget-config-group el-form-item" v-if="visible">
		<!--使用draggable组件-->
		<draggable v-model="data.dicData" handle=".mover" animation="300">
			<transition-group>
				<template v-for="item in data.dicData" v-bind="{ value: item.value }">
					<RvueCheckInput @delete="handleDelete" class="el-form-item" :field="item" :placeholder="placeholder" :data="data" :key="item.value">
						<i slot="item" class="mover el-icon-s-operation"></i>
					</RvueCheckInput>
				</template>
			</transition-group>
		</draggable>

		<el-button @click="addHandler" style="margin-bottom: 10px">{{ t("formDesign.addDic") }}</el-button>
		<div><rvue-label :label="t('global.defaultValue')" :tip="t('widgetConfig.attrDefaultValue')" /></div>
		<div class="widget-config-group el-form-item">
			<rvue-select
				v-model="data.defVal"
				style="margin-bottom: 10px"
				:multiple="Array.isArray(this.data.defVal)"
				:filterable="Array.isArray(this.data.defVal)"
				clearable
				:default-first-option="Array.isArray(this.data.defVal)"
			>
				<rvue-option :label="item.label" :value="item.label" v-for="(item, index) in data.dicData" :key="index"></rvue-option>
			</rvue-select>
		</div>
	</div>
</template>

<script>
	import { create } from "../utils/create";
	import draggable from "vuedraggable";

	const name = "AttrCheckBox";

	const methods = {
		addHandler() {
			this.id = this.data.dicData[this.data.dicData.length - 1].value;
			this.id++;
			this.data.dicData.push({ label: `选项`, value: this.id + "" });
		},
		handleDelete(data) {
			if (typeof this.data.defVal == "string") return (this.data.defVal = "");
			this.data.defVal = [];
		},
	};

	const computed = {
		visible() {
			if (this.data.type == "checkbox" || this.data.type == "radio") {
				return this.data.rely.type == "custom";
			}
			if (this.data.type == "select" || this.data.type == "selectMulti") {
				return this.data.rely.type == "custom";
			}
			return true;
		},
	};

	export default create({
		name,
		methods,
		computed,
		components: {
			draggable,
		},
		data() {
			return {
				id: "",
				oldDic: [],
				value: "",
			};
		},
		created() {
			this.data.dicData.length && (this.id = this.data.dicData[this.data.dicData.length - 1].value);
			this.oldDic = JSON.parse(JSON.stringify(this.data.dicData));
		},
	});
</script>

<style scoped lang="scss">
	.mover {
		width: 50px;
		height: 50px;
		@include JustityAndFlexWrap(flex, center, center, null);
		&:hover {
			cursor: move;
		}
	}
</style>
