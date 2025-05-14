<!--
 * @Author: ben
 * @LastEditTime: 2022-02-18 15:04:21
-->
<template>
	<div class="widget-config-group" :style="{ marginBottom: !this.hasAttrEdit() ? '18px' : '0px' }">
		<rvue-label :label="t('widgetConfig.attrFieldVerification')" style="margin-right: 10px" :tip="t('widgetConfig.attrValid')" />
		<br />
		<rvue-label :label="t('global.isVisable')" style="margin-right: 10px" />
		<el-switch v-model="value"></el-switch>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import setComputed from "../core/syncData";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	const name = "AttrVisible";

	const computed = setComputed("visible");

	export default create({
		methods: {
			hasAttrEdit() {
				let attrs = RfieldCore.ins().createField({ type: this.data.type }).rfDef.FormConf.fieldSort || [];
				return attrs.includes("AttrEdit");
			},
		},
		name,
		computed,
		watch: {
			value: function (n, o) {
				if (!n) {
					this.data.edit = n;
				}
			},
		},
	});
</script>
