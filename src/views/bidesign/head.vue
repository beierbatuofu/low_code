<template>
	<div class="bidead-container">
		<div class="l">
			<div @click="retrunHandler">
				<i class="el-icon-arrow-left" style="color: #ccc; font-size: 26px; cursor: pointer"></i>
			</div>
			<span>{{ title }}</span>
		</div>
		<div class="flex btn">
			<rvue-button type="primary" size="mini" @click="handleSave">保存</rvue-button>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, Emit, Prop, Inject } from "vue-property-decorator";

	@Component({})
	export default class BiHead extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) oldData!: any;
		@Prop({ type: Boolean, default: false }) isClickSave!: any;
		@Prop({ type: Number, default: 0 }) resCount!: any;
		@Prop({ type: Object, default: () => {} }) formConfig!: any;
		@Prop({ type: Object, default: () => ({}) }) headTitle!: Record<string, string>;

		private get title() {
			if (Object.keys(this.headTitle).length == 0) return "未命名";

			return this.headTitle[<string>localStorage.getItem("lang")];
		}
		private handleSave() {
			this.$emit("save");
		}

		private retrunHandler() {
			let temp = this.$utils.deepClone(this.data);

			delete temp.data;
			delete temp.tip;

			//变化了
			if (!this.isClickSave && (JSON.stringify(temp.title) !== JSON.stringify(this.oldData.title) || JSON.stringify(temp.config) !== JSON.stringify(this.oldData.config) || this.resCount > 2)) {
				this.$confirm((<any>this).$t("global.isSaveChartDesign"), "", {
					confirmButtonText: (<any>this).$t("global.confirm"),
					cancelButtonText: (<any>this).$t("global.cancel"),
					type: "warning",
				})
					.then(() => {
						if (!this.formConfig.code && this.$route.params.type != "filter") {
							this.$message("数据源为空");
							return;
						}

						this.$emit("save", () => {
							this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/bi/${this.$route.params.formCode}/dashboard_design/`);
						});
					})
					.catch(() => {
						this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/bi/${this.$route.params.formCode}/dashboard_design/`);
					});
			} else {
				this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/bi/${this.$route.params.formCode}/dashboard_design/`);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./_style/head.scss";
</style>
