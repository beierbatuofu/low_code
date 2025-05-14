<template>
	<div class="widget-config-group el-form-item">
		<rvue-label
			:label="t('widgetConfig.attrVerification')"
			style="margin-right: 10px"
			:tip="t('widgetConfig.attrVerificationTip')"
		/>
		<br />
		<rvue-label :label="t('global.isRequired')" style="margin-right: 10px" />
		<el-switch v-model="value"></el-switch>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import setComputed from "../core/syncData";

	const name = "AttrRequired";

	const computed = setComputed("required");

	export default create({
		name,
		computed,
	});
</script>
