<template>
	<el-button type="primary" @click="handleDel">{{ $t("global.deletion") }}1231</el-button>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import TDButton from "./TDButton";

	export default class TDdel extends TDButton {
		private handleDel() {
			this.$emit("add");
		}
	}
</script>
