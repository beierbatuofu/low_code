<template>
	<div class="container">{{ title }}</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	@Component({})
	export default class CTdata extends Vue {
		@Prop({ type: String, default: "" }) title!: string;
	}
</script>
<style lang="scss" scoped></style>
