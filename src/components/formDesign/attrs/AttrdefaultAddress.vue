<!--
 * @Author: ben
 * @LastEditTime: 2022-05-05 16:51:59
-->
<template>
	<DataRelation :data="data" :parentType="parentType" :options="['custom', 'relation']" :parentObj="parentObj" :configList="configList">
		<template v-slot:custom>
			<rvue-address style="width: 100%; margin-bottom: 10px" v-model="city"></rvue-address>
			<rvue-input type="textarea" v-model="data.defVal.detail" :placeholder="$t('global.placeholderAddress')"></rvue-input>
		</template>
	</DataRelation>
</template>
<script>
	import { create } from "../utils/create";
	import DataRelation from "../components/dataRelation";

	const name = "AttrDefaultAddress";

	const components = {
		DataRelation,
	};

	const computed = {
		city: {
			get() {
				return [this.data.defVal.province, this.data.defVal.city, this.data.defVal.district].filter((s) => !!s);
			},
			set(a) {
				this.data.defVal.province = a[0] ?? "";
				this.data.defVal.city = a[1] ?? "";
				this.data.defVal.district = a[2] ?? "";
			},
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
<style lang="scss" scoped>
	::v-deep {
		textarea {
			padding: 5px 30px !important;
			min-height: 60px !important;
		}
	}
</style>
