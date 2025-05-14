<template>
	<div>
		<rvue-form-box :option="option" v-model="obj" @submit="submit"></rvue-form-box>
	</div>
</template>

<script>
	import Vue from "vue";
	// import Avue from '@smallwei/avue/lib/avue-mobile.min.js';
	// import Vant from '@ui/src/ui/vant/index.js'
	import { getFormSingle } from "@/api/form";
	import { FormModule } from "@/store/modules/form";

	// Vue.use(Avue);

	export default {
		/* get form() {
    return FormModule.form;
  }, */
		name: "MobilePreview",
		data() {
			return {
				option: {},
				obj: {},
			};
		},
		created() {
			let { appCode, id } = this.$route.params;
			getFormSingle(appCode, id).then((res) => {
				const { structure, name, type } = res.data;
				const options = { ...structure };
				options.column = options.column.map((column) => {
					const eventKeys = ["change", "blur", "focus", "click"];
					eventKeys.forEach((event) => {
						if (column[event]) column[event] = new Function("meta", column[event]);
					});
					return column;
				});
				this.option = options ? options : { column: [] };
				FormModule.setForm({
					options: options || { column: [] },
					name,
					type,
				});
			});
		},
		methods: {
			submit() {},
		},
	};
</script>

<style></style>
