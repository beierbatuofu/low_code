<template>
	<div>
		<rvue-dialog
			class="di-dialog"
			@open="openHandler"
			:title="mode === 'indicators' ? $t(`chartDesign.IndicatorSetting`) : $t(`chartDesign.DimensionSetting`)"
			:visible.sync="visibleSync"
			width="30%"
		>
			<div class="title">{{ $t(`chartDesign.sort`) }}</div>
			<el-radio-group v-model="sort">
				<el-radio label="none">{{ $t(`chartDesign.default`) }}</el-radio>
				<el-radio label="asc">{{ $t(`chartDesign.asc`) }}</el-radio>
				<el-radio label="desc">{{ $t(`chartDesign.desc`) }}</el-radio>
			</el-radio-group>
			<div v-if="mode === 'indicators'" class="gatherMethod-container">
				<div class="title">{{ $t(`chartDesign.method`) }}</div>

				<el-select class="input" v-model="gatherMethod" placeholder="请选择">
					<el-option v-for="item in gatherMethods" :key="item.value" :label="$t(`chartDesign.${item.label}`)" :value="item.value"> </el-option>
				</el-select>
			</div>
			<!-- 特殊字段显示 时间 -->
			<div v-show="fieldGatherMethods.includes(item.dataTypeEnum) && mode === 'dimensions'" class="gatherMethod-container">
				<div class="title">{{ $t(`chartDesign.method`) }}</div>
				<el-select class="input" v-model="fieldGatherMethod" placeholder="请选择">
					<el-option v-for="item in fieldGatherMethodsOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
			</div>
			<!-- 特殊字段显示 复选 -->
			<div v-show="fieldCheck.includes(item.dataTypeEnum) && mode === 'dimensions'" class="gatherMethod-container">
				<div class="title">汇总方式</div>

				<el-select class="input" v-model="fieldCheckMethod" :disabled="mutDisabledHandler()" placeholder="请选择">
					<el-option v-for="item in fieldGatherMethodsOptions" :key="item.value" :label="$t(`chartDesign.${item.label}`)" :value="item.value"> </el-option>
				</el-select>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="visibleSync = false">取 消</el-button>
				<el-button size="mini" type="primary" @click="handleSure">确 定</el-button>
			</span>
		</rvue-dialog>
		<!-- 指标 -->
	</div>
</template>
<script lang="ts">
	import { gatherMethods, fieldGatherMethodOptions, fieldGatherMethods, fieldCheck } from "../components/attr/CTdi/_core/methods";
	import { Vue, Component, PropSync, Prop, Watch, Inject } from "vue-property-decorator";
	import BaseAttr from "../core/BaseAttr";

	interface di {
		code: string;
		dataTypeEnum: string;
		sort: string;
		tagCode: string;
		title: { en: string; zh: string };
		method?: string;
	}

	@Component({
		components: {},
	})
	export default class CTdata extends BaseAttr {
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		@Prop({ type: String, default: "" }) mode!: string;
		@Prop({ type: Object, default: () => {} }) item!: any;
		@Inject() readonly checkMethodsField!: TJson;
		private gatherMethod = this.item.method || "";
		private gatherMethods: TJson = [];
		private sort: string = "none";
		private fieldGatherMethod = this.item.dateTimeSummary || ""; //时间日期汇总方式
		private fieldCheckMethod = this.item.method || ""; //复选汇总方式
		private fieldGatherMethods: any = fieldGatherMethods;
		private fieldCheck: any = fieldCheck;

		@Watch("item.dataTypeEnum", { immediate: true })
		onChangeType() {
			this.gatherMethods = (<TJson>gatherMethods)[this.item.dataTypeEnum];
		}

		@Watch("item.sort", { immediate: true })
		onChangeSort(n: string) {
			this.sort = n;
		}

		private handleSure(): void {
			this.data.indicators.forEach((ite: di, index: number) => {
				this.$set(this.data["indicators"][index], "sort", "none");
			});
			this.data.dimensions.forEach((ite: di, index: number) => {
				this.$set(this.data["dimensions"][index], "sort", "none");
			});
			//重置当前的为默认值
			this.data[this.mode].forEach((element: di, index: number) => {
				//汇总方式赋值
				if (this.item.code == element.code) {
					this.$set(this.data[this.mode][index], "sort", this.sort);
					this.mode === "indicators" && this.$set(this.data[this.mode][index], "method", this.gatherMethod);

					//维度汇总方式
					if (this.mode === "dimensions") {
						if (this.checkMethodsField.includes(this.item.dataTypeEnum)) {
							this.$set(this.data[this.mode][index], "method", this.fieldCheckMethod);
						} else if (this.fieldGatherMethods.includes(this.item.dataTypeEnum)) {
							this.$set(this.data[this.mode][index], "dateTimeSummary", this.fieldGatherMethod);
						}
					}
				}
			});

			this.visibleSync = false;
		}

		private openHandler() {
			this.fieldCheckMethod = this.item.method;
		}

		private mutDisabledHandler() {
			//禁止第二维度复选 汇总方式
			if (this.data.dimensions[1] && fieldCheck.includes(this.data.dimensions[1].dataTypeEnum) && this.item.code == this.data.dimensions[1].code) {
				return true;
			} else {
				return false;
			}
		}

		private get fieldGatherMethodsOptions() {
			return (<any>fieldGatherMethodOptions)[this.item.dataTypeEnum];
		}
	}
</script>
<style lang="scss" scoped>
	.gatherMethod-container {
		margin-top: 20px;
	}
	::v-deep .di-dialog {
		.el-dialog__title {
			font-size: 16px;
			font-weight: bold;
		}
		.title {
			color: #525d6d;
			margin-bottom: 8px;
			font-weight: 600;
		}
	}
	.input {
		height: 36px;
		border-radius: 2px;
		::v-deep .el-input__inner {
			border-radius: 2px;
			border: 1px solid #dcdfe6;
		}
		::v-deep input {
			height: 36px;
		}
	}
</style>
