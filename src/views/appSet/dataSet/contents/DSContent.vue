<template>
	<div class="dataset-content">
		<rvue-tabs v-model="active" @tab-click="handleChange" v-if="listColors != ''">
			<rvue-tab-pane name="dataPreview">
				<span slot="label">{{ $t("appset.dataPreview") }}</span>
				<div>
					<data-preview :basicConfig="basicConfig"></data-preview>
				</div>
			</rvue-tab-pane>
			<rvue-tab-pane name="basalSet">
				<span slot="label">{{ $t("appset.basalSet") }}</span>
				<div>
					<basalSet :basicConfig="basicConfig" :listColor.sync="listColors"></basalSet>
				</div>
			</rvue-tab-pane>
		</rvue-tabs>
		<div class="no-elements" v-else>请选取左侧数据集</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive, PropSync } from "vue-property-decorator";
	import dataPreview from "./dataPreview.vue";
	import basalSet from "./basalSet.vue";

	@Component({
		components: {
			dataPreview,
			basalSet,
		},
	})
	export default class DSContent extends Vue {
		@PropSync("listColor", { type: String, default: "" }) listColors!: String;
		@Prop({ type: Object, default: () => {} }) basicConfig!: any;


    @Watch('basicConfig',{
      deep:true,
      immediate:true
    })
    basicConfigChange(){
      this.active = 'dataPreview'
    }

		private active: string = "dataPreview";

		private handleChange(val: any) {
			// console.log(val,888);
		}
	}
</script>

<style lang="scss" scoped>
	.dataset-content {
		flex: 1;
		background-color: white;
		height: calc(100vh - 120px);
		overflow: auto;

		border-radius: 4px;
	}

	::v-deep .el-tabs {
		.el-tabs__nav {
			margin-left: 20px;

			.el-tabs__item,
			.is-top,
			.is-active {
				padding: 0 20px;
			}
		}
	}

	.no-elements {
		border-radius: 4px;
		width: 100%;
		color: black;
		line-height: 400px;
		text-align: center;
		color: #9ea6b2;
	}
</style>
