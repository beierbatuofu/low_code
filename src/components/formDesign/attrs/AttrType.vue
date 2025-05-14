<!--
 * @Author: ben
 * @LastEditTime: 2021-08-10 17:14:54
-->
<template>
	<div class="widget-config-group">
		<rvue-label :label="t('global.type')" :tip="t('widgetConfig.attrTypeTip')" />
		<rvue-select v-model="selectValue" style="width: 100%" @change="handleChangeType" disabled> </rvue-select>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import WidgetConfDef from "../commons/WidgetConfDef";
	const fields = WidgetConfDef.widgetList;

	const name = "AttrType";

	const methods = {
		async handleChangeType(type) {
			// if (type) {
			//     const config = await this.getConfigByType(type);
			//     config.prop = this.data.prop;
			//     for (let key in config) {
			//         if (
			//             config &&
			//             Object.prototype.hasOwnProperty.call(config, key) &&
			//             !["icon", "label", "span"].includes(key)
			//         ) {
			//             const val = config[key];
			//             this.$set(this.data, key, val);
			//         }
			//     }
			// }
		},
	};

	const computed = {
		selectValue: {
			get() {
				return this.t("global." + this.data.type);
			},
			set(n) {
				this.data.type = n;
			},
		},
	};

	export default create({
		name,
		computed,
		methods,
		data() {
			return {
				fields: fields,
			};
		},
	});
</script>
