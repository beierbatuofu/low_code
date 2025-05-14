<!--
 * @Author: ben
 * @LastEditTime: 2021-10-14 13:53:46
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label required :tip="t('widgetConfig.attrTitleTip')" :label="t('global.title')" />
		<RvueLangInput :key="data.fieldId" class="el-form-item" :field="data.title" :placeholder="placeholder" :titleShow="titleShow" @change="handleChange" />
		<div class="checkBOx">
			<el-checkbox @change="checkTitleShow" v-model="titleShow">{{ t("global.showTitle") }}</el-checkbox>
		</div>
	</div>
</template>
<script>
	import { create } from "../utils/create";

	const name = "AttrTitle";

	export default create({
		name,
		data() {
			return {
				maxLength: "100%",
				titleShow: this.data.titleShow,
			};
		},
		methods: {
			checkTitleShow() {
				this.$set(this.data, "titleShow", this.titleShow);
			},
			handleChange(form) {
				this.data.title = this.$utils.deepClone(form);
			},
		},
	});
</script>

<style lang="scss" scoped>
	.checkBOx {
		padding: 8px 0;
	}
</style>
