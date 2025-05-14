<template>
	<div>
		<rvue-dialog custom-class="detail-dialog" :visible.sync="visibleSync" top="0" width="80%" :fullscreen="true" :title="formName" :closed="clearStorageData" style="overflow: hidden">
			<form-detail v-if="visibleSync" @close="handleClose" :formCode="formCode" :dataId="dataId" :key="dataId"></form-detail>
		</rvue-dialog>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";

	import FormDetail from "@/components/formDetail/formDetail.vue";

	@Component({
		components: {
			FormDetail,
		},
	})
	export default class extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		@Prop({ type: Object, default: () => {} }) detail!: any;
		@Prop({ type: String, default: "" }) formCode!: string;
		@Prop({ type: String, default: "" }) dataId!: string;
		@Prop({ type: String, default: "" }) processId!: string;
		@Prop({ type: String, default: "" }) flowType!: string;
    
		@Prop({ type: Number || String, default: -1 }) processStatus!: string | number;
		@Prop({ type: Array, default: () => [] }) nodeDetail!: any[];
		@Prop({ type: Array, default: () => [] }) noSameValList!: any[];
		@Prop({ type: Array, default: () => [] }) dateTimePropList!: any[];

		private clearStorageData() {
			this.$forceUpdate();
		}

		private handleClose() {
			this.visibleSync = false;
			this.$emit("close");
		}

		private get formName() {
			try {
				return this.detail.form.name;
			} catch (err) {
				return "";
			}
		}
		private updateTable() {
			this.$emit("updateTable");
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep .el-dialog {
		margin-bottom: 0px;
		height: 100vh;
	}
	::v-deep .el-dialog__wrapper .el-dialog__body {
		overflow: hidden !important;
		height: calc(100vh - 60px);
		max-height: calc(100vh - 60px);
	}
  ::v-deep .el-dialog__header {
		background-color: #4c81ff;
		.el-dialog__title,
		.el-dialog__headerbtn .el-dialog__close {
			color: #fff;
		}
	}
  ::v-deep .detail-dialog {
    .group {
      height: 70px;
      padding: 0;
    }
		.el-dialog__body {
			padding: 0;
		}
	}
	.form-data {
		margin: 24px 24px 0;
		overflow: hidden;
	}
</style>
