<!--
 * @Author: ben
 * @LastEditTime: 2022-05-05 16:58:51
-->
<template>
	<DataRelation :data="data" :key="data.fieldId" :parentType="parentType" :parentObj="parentObj" :configList="configList" :options="relationOptions" @updateType="changeType">
		<template v-slot:custom>
			<!-- <div class="widget-config-group el-form-item">
				<rvue-select v-model="value" style="margin-bottom: 10px" :multiple="isArray" :filterable="isArray" clearable :default-first-option="isArray">
					<rvue-option :label="item.label" :value="item.label" v-for="(item, index) in options" :key="index"></rvue-option>
				</rvue-select>
			</div> -->
		</template>
	</DataRelation>
</template>
<script>
	import { create } from "../utils/create";
	import setComputed from "../core/syncData";
	import DataRelation from "../components/dataRelation";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	const name = "AttrdefaultSelect";
	const computed = setComputed("defVal");
	const components = {
		DataRelation,
	};

	export default create({
		name,
		computed,
		components,
		methods: {
			changeType(v) {
				console.log(v);
				v == "custom" && (this.data.dicData = RfieldCore.ins().createField({ type: this.data.type }).config.dicData);
			},
		},
		data() {
			return {
				options: [],
				isArray: Array.isArray(this.data.defVal),
				relationOptions: [],
			};
		},
		watch: {
			"data.dicData": {
				handler: function (n) {
					this.options = n;
				},
				deep: true,
				immediate: true,
			},
			"data.fieldId": {
				handler: function (n) {
					if (this.data.rely.type == "otherFormData") {
						if (!this.data.rely.relation?.formCode || !this.data.rely.relation?.fieldId) {
							this.data.rely.type = "custom";
						}
					}

					this.relationOptions = this.data.type == "select" || this.data.type == "selectMulti" ? ["custom", "otherFormData", "relation"] : ["custom", "relation"];
					if (this.data.type == "checkbox" || this.data.type == "radio") {
						this.relationOptions = ["custom"];
					}
				},
				deep: true,
				immediate: true,
			},
		},
		created() {
			this.options = this.data.dicData || options;
		},
	});
</script>
