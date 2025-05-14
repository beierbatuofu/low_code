<template>
	<rvue-button :debounce="false" type="primary" icon="el-icon-edit" @click="handleClick">
		{{ $t("global.edit") }}
	</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component, Inject, PropSync, Prop } from "vue-property-decorator";
	import FormDetailCore from "../_core/FormDetailCore";

	@Component
	export default class DetailEdit extends Vue {
		static readonly compName = "dbtn-edit";
		@PropSync("btns", { type: Array, default: () => [] }) syncBtns!: string[];
		@Prop({ type: Object, default: () => ({}) }) formRef!: { resetAllReadonly: () => void };
		@Inject() readonly conf!: TJson;

		private handleClick() {
			this.syncBtns = FormDetailCore.ins().btnMap["C"].edit().uiBtns;
			this.$emit("edit");
		}
	}
</script>
