<template>
	<div style="width: 100%">
		<div class="filterContainer" :class="getClassName">
			<filter-value ref="filterValue" :id="id" :data="data" :item="item" :filterForm="filterForm"></filter-value>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	import FilterValue from "./_filterComponent/_configComponent/defaultValue.vue";
	import { ChartModule } from "@/store/modules/chart";
	@Component({
		components: { FilterValue },
	})
	export default class BiFilter extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) item!: any;
		@Prop({ type: Object, default: () => {} }) filterForm!: any;

		private get id() {
			return this.item ? this.item.code : "";
		}

		//仪表盘删除调用
		private deleteHandler(filterCode: string) {
			ChartModule.DELETE_List(filterCode);
		}
		private get getClassName() {
			return /(dashboard_design|bi_form)/gi.test(this.$route.path) ? "preview-content" : "design-content";
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
	}
	.center {
		justify-content: center;
	}

	.marginb30 {
		margin-bottom: 30px;
	}
	.design-content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: calc(100vh - 110px);
	}
	.filterContainer {
		.name {
			margin-right: 30px;
		}
	}
</style>
