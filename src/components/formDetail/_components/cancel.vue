<template>
	<rvue-button :debounce="false" type="primary" icon="el-icon-delete" @click="handleClick"> {{ $t("global.cancel") }}</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component } from "vue-property-decorator";
	import FormDetailCore from "../_core/FormDetailCore";

	@Component
	export default class DetailCancel extends Vue {
		static readonly compName = "dbtn-cancel";

		private handleClick() {
			this.$emit("return");
		}
	}
</script>
