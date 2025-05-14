<template>
	<div class="bi-empty-container">
		<img class="img" :src="`${publicPath}img/bi_icon/bi-empty.png`" alt="" />
		<div class="text">当前为空仪表盘，可以通过左上角来创建组件</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";

	@Component({
		components: {},
	})
	export default class BiEmpty extends Vue {}
</script>

<style lang="scss" scoped>
	@import "./_style/biempty.scss";
</style>
