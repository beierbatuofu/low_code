<template>
	<el-avatar class="elAvatar" :shape="shape" :size="size" :src="src"></el-avatar>
</template>

<script lang="ts">
	import { Vue, Component, Model, Prop, Watch, Emit } from "vue-property-decorator";
	@Component
	export default class headPhoto extends Vue {
		@Prop({ type: String, default: "circle" }) private shape!: "";
		@Prop({ type: Number, default: 30 }) private size!: "";
		@Prop({ type: String, default: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" }) private src!: "";
	}
</script>

<style lang="scss">
	.elAvatar {
		text-align: center;
		img {
			vertical-align: top !important;
			width: 100% !important;
		}
	}
</style>
