<!--
 * @Author: ben
 * @LastEditTime: 2021-06-11 11:17:20
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('global.noSameVal')" class="margin-right-10" />
		<el-switch v-model="value"></el-switch>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import setComputed from "../core/syncData";

	export default create({
		name: "AttrNoSameVal",
		computed: setComputed("noSameVal"),
	});
</script>
