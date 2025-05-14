<!--
 * @Author: ben
 * @LastEditTime: 2021-06-10 11:20:07
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('global.isEdit')" style="margin-right: 10px" />
		<el-switch v-model="value"></el-switch>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import setComputed from "../core/syncData";

	const name = "AttrEdit";

	const computed = setComputed("edit");

	export default create({
		name,
		computed,
		watch: {
			value: function (n, o) {
				if (n) {
					this.data.visible = n;
				}
			},
		},
	});
</script>
