<template>
	<div class="data-set">
		<div style="margin: 20px 50px; font-size: 22px">数据集</div>
		<div class="container">
			<Menu @datasetDeploy="datasetDeploy" ref="menu" :listColor.sync="listColor"></Menu>
			<DSContent :basicConfig="basicConfig" :listColor.sync="listColor"></DSContent>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive } from "vue-property-decorator";
	import Menu from "./menu.vue";
	import DSContent from "./contents/DSContent.vue";

	@Component({
		components: {
			Menu,
			DSContent,
		},
	})
	export default class DataSet extends Vue {
		@Provide("parent") parent = this;
		private basicConfig: any = {}; //配置参数
		private listColor = "";

		private handleadd(appCode: string) {
			(<any>this).$refs.menu.getDataSet(appCode);
		}

		private datasetDeploy(val: any) {
			this.basicConfig = val;
		}
	}
</script>

<style lang="scss" scoped>
	.data-set {
		height: calc(100vh - 45px);
		overflow: hidden;
		background-color: rgb(231, 234, 239);

		box-sizing: border-box;
		header {
			height: 50px;
			line-height: 50px;
			font-size: 26px;
			color: black;
			padding-left: 20px;
			font-weight: 700;
		}
		.container {
			display: flex;
			padding-right: 50px;
			height: calc(100vh - 40px);
		}
	}
</style>
