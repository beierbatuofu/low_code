<template>
	<el-button type="primary" @click="handleAdd" :size="size">{{ $t("global.add") }}</el-button>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import TDButton from "../../core/BaseButton";

	@Component
	export default class TDadd extends TDButton {
		private handleAdd() {
			this.$emit("add");
		}
	}
</script>
