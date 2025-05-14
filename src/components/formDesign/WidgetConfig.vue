<template>
	<div>
		<el-form v-if="fieldSort.length > 0" labelPosition="left" size="small">
			<template v-for="(sAttr, index) in fieldSort">
				<component :oldOptions="oldOptions" :key="index" :is="sAttr" :data="config" :configList="configList" :ext="ext" :parent-type="parentType" :parentObj="parentObj" :isInTable="false" />
			</template>
		</el-form>
	</div>
	<!-- <rvue-empty v-else :desc="t('emptyField')" style="margin-top: 100%;text-align:center"></rvue-empty> -->
</template>

<script>
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	export default {
		name: "widget-config",
		props: ["config", "configList", "oldOptions"],
		computed: {
			//fieldDefine
			fieldDef() {
				let { type } = this.config;
				if (!type) return {};

				return RfieldCore.ins().fieldConsMap[type].fieldDef;
			},
			//attrSort
			fieldSort() {
				try {
					return this.fieldDef.ins().FormConf.fieldSort;
				} catch (err) {
					return [];
				}
			},
			ext() {
				return this.fieldDef.ins().ext;
			},
			parentType() {
				//TODO
				let parent = RfieldCore.ins().getFieldParent(this.config.fieldId, this.configList);
				return parent && parent.hasOwnProperty("type") ? parent.type : "";
			},
			parentObj() {
				return RfieldCore.ins().getFieldParent(this.config.fieldId, this.configList);
			},
		},
	};
</script>
