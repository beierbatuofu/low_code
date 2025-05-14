<template>
	<div>
		<rvue-form-box :option="option" v-model="obj" @submit="submit" />
	</div>
</template>

<script>
	import Vue from "vue";
	// import Vant from '@ui/src/ui/vant/index.js'

	export default {
		props: {
			option: {
				value: {
					type: Object,
					default: () => {
						return {};
					},
				},
			},
		},
		name: "MobileAvueForm",
		data() {
			return {
				obj: {},
			};
		},
		created() {},
		methods: {
			submit() {},
		},
	};
</script>

<style></style>
