<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('global.isMultiple')" style="margin-right: 10px" />
		<el-switch v-model="value"></el-switch>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import setComputed from "../core/syncData";

	const name = "AttrMultiple";

	const computed = setComputed("multiple");

	export default create({
		name,
		computed,
	});
</script>
