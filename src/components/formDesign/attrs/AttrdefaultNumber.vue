<!--
 * @Author: ben
 * @LastEditTime: 2022-05-18 20:26:12
-->
<template>
	<div>
		<DataRelation :parentType="parentType" :parentObj="parentObj" :data="data" :configList="configList" @updateType="handleChangeType">
			<template v-slot:custom>
				<rvue-input-number v-model="inputNum" :controls="false" :min="NumMin" :max="NumMax" :precision="precision"></rvue-input-number>
			</template>
		</DataRelation>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import DataRelation from "../components/dataRelation";

	const name = "AttrDefaultNum";

	const components = {
		DataRelation,
	};

	const computed = {
		precision() {
			return this.data.decimalDigitsNum;
		},
		inputNum: {
			get() {
				return this.data.defVal;
			},
			set(v) {
				this.$set(this.data, "defVal", v);
			},
		},
		NumMin: {
			get() {
				return this.data.numRange.min;
			},
			set(n) {
				this.data.numRange.min = n || Number("9".repeat(15) + "8") * -1;
			},
		},
		NumMax: {
			get() {
				return this.data.numRange.max || Number("9".repeat(15) + "8");
			},
			set(n) {
				this.data.numRange.max = n;
			},
		},
	};

	export default create({
		name,
		components,
		computed,
		methods: {
			handleChangeType(n) {
				this.data.defVal = "undefined";
			},
		},
	});
</script>
