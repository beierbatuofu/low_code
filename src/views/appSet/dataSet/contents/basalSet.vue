<template>
	<div class="basal-set">
		<div class="edit-name">
			<rvue-label :label="$t('appset.dataSetName')" />
			<!-- <rvue-input  v-model="nameVal"></rvue-input> -->
			<RvueLangInput class="el-form-item" :maxlength="100" style="width: 90%" :field="nameVal" @change="handleChange" />
		</div>
		<div class="set-status">
			<rvue-label :label="$t('appset.setStatus')" />
			<div class="status-tag">
				<el-tag type="success" v-if="setStatus">{{ $t("appset.setSuccess") }}</el-tag>
				<el-tag type="danger" v-else-if="setStatus == false">{{ $t("appset.setError") }}</el-tag>
				<el-tag type="info" v-else>未配置</el-tag>
			</div>
		</div>

		<el-button class="button-del" icon="el-icon-circle-close" @click="delDataSet">删除数据集</el-button>

		<el-button type="primary" class="datasetSave" @click="datasetSave">保存</el-button>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive, Inject, PropSync } from "vue-property-decorator";
	import { delDataset, updateSql } from "@/api/dataset.ts";

	@Component({})
	export default class basalSet extends Vue {
		@PropSync("listColor", { type: String, default: "" }) listColors!: String;
		@Inject("parent") readonly parent!: any;

		@Prop({ type: Object, default: () => {} }) basicConfig!: any;

		@Watch("basicConfig", {
			deep: true,
		})
		basicConfigChange(n: any) {
			this.nameVal = n.name;
			this.setStatus = n.status;
		}

		private nameVal: any = {};
		private setStatus: boolean | null = true;

		private delDataSet() {
			let name = this.basicConfig.name.zh;
			this.$prompt("该数据集已生效，如确认删除，请输入标题名称", `您确定要删除'${name}'吗？`, {
				type: "warning",
				center: true,
				inputValidator: (v) => v === name,
				inputErrorMessage: "输入错误！",
			}).then((value: any) => {
				if (value.value == name) {
					delDataset(this.basicConfig.appCode, this.basicConfig.datasetCode).then((res: TResponse) => {
						this.parent.handleadd(this.basicConfig.appCode);
						this.listColors = "";
						this.$message.success("删除成功");
					});
				} else {
					this.$message.error("删除失败");
				}
			});
		}

		private handleChange(val: any) {
			this.nameVal = val;
		}

		private async datasetSave() {
			let parmas = {
				appCode: this.basicConfig.appCode,
				datasetCode: this.basicConfig.datasetCode,
				name: this.nameVal,
			};
			let res = await updateSql(parmas);
			if (res.code == "0") {
				this.$message.success("保存成功！");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.basal-set {
		padding: 20px;
		position: relative;
		.edit-name {
			width: 200px;
		}
		.set-status {
			margin-top: 10px;
			.status-tag {
				margin-top: 5px;
			}
		}
		.datasetSave {
			@include PositionAbsoulte(20px, 20px, null, null);
			width: 120px;
		}
	}
	::v-deep .rvue-input {
		.el-input {
			margin-top: 5px;
			.el-input__inner {
				font-size: 12px;
				height: 30px;
				line-height: 30px;
			}
		}
	}

	.button-del {
		margin-top: 20px;
		background-color: white !important;
		border-color: #e44e4e !important;
		color: #e44e4e !important;
	}

	.button-del:hover,
	.button-del:active,
	.button-del:focus {
		background-color: #eb7a7a !important;
		border-color: #eb7a7a !important;
		color: white !important;
	}
</style>
