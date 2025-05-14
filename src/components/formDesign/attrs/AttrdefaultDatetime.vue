<!--
 * @Author: ben
 * @LastEditTime: 2021-08-02 13:07:42
-->
<template>
	<DataRelation :parentType="parentType" :parentObj="parentObj" :data="data" :configList="configList" :options="aSelect">
		<template v-slot:custom>
			<AttrDefaultTime :data="data" />
		</template>
	</DataRelation>
</template>
<script>
	import { create } from "../utils/create";
	import DataRelation from "../components/dataRelation";

	const name = "AttrDefaultDate";

	const aSelect = ["now", "custom", "relation", "formula"];

	const components = {
		DataRelation,
	};

	export default create({
		name,
		components,
		data() {
			return {
				aSelect: aSelect,
			};
		},
	});
</script>
