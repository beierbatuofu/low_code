<!--
 * @Author: ben
 * @LastEditTime: 2021-10-13 11:06:13
-->
<template>
	<DataRelation :data="data" :parentType="parentType" :parentObj="parentObj" :configList="configList" 
  >
		<template v-slot:custom>
			<rvue-input v-model="input" :type="type" :placeholder="$t('global.placeholder')" :rows="2"></rvue-input>
		</template>
	</DataRelation>
</template>
<script>
	import { create } from "../utils/create";
	import DataRelation from "../components/dataRelation";

	const name = "AttrDefaultValue";

	const components = {
		DataRelation,
	};

	const computed = {
		input: {
			get() {
				return this.data.defVal;
			},
			set(val) {
				this.data.defVal = val;
			},
		},
		type() {
			let { type } = this.data;
			if (type == "textarea") return type;
			return "text";
		},
	};

	export default create({
		name,

		components,
		computed,
		data() {
			return {
				visible: false,
			};
		},
	});
</script>
