<template>
	<rvue-dialog title="辅助线设置" :visible.sync="visibleSync" @close="handleColse" @open="handleOpen" top="10vh" width="37%" customClass="markline-dialog">
		<div class="title">辅助线名称</div>
		<el-form :model="form" ref="form">
			<el-form-item prop="name" :rules="[{ required: true, message: '请输入名字', trigger: 'blur' }]">
				<rvue-input v-model="form.name" :maxlength="12" placeholder="请输入辅助线名称，最多12个字符"></rvue-input>
			</el-form-item>
			<div class="title">类型</div>
			<div class="flex">
				<el-form-item class="margin-r" prop="typeValue" :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]">
					<rvue-select-group :config="{ type: 'chart' }" :options="typeOptions" v-model="form.typeValue"></rvue-select-group>
				</el-form-item>

				<el-form-item prop="value" :rules="[{ required: true, message: '请输入数值', trigger: 'blur' }]">
					<rvue-input v-model="form.value" placeholder="请输入数值"></rvue-input>
				</el-form-item>
			</div>
			<!-- <div>显示内容</div> -->
			<!-- <rvue-select-group :config="{ type: 'chart' }" :options="showOptions" v-model="showValue"></rvue-select-group> -->

			<div class="title">颜色</div>
			<el-color-picker v-model="color" size="mini"></el-color-picker>
		</el-form>

		<span slot="footer" class="dialog-footer">
			<rvue-button size="mini" @click="visibleSync = false">取 消</rvue-button>
			<rvue-button size="mini" type="primary" @click="handleSave">确 定</rvue-button>
		</span>
	</rvue-dialog>
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
	import BaseAttr from "../../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTdatadialog extends BaseAttr {
		@Prop({ type: String, default: "add" }) type!: string;
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		// @PropSync("markLineConfigList", { type: Array, default: () => [] }) markLineConfigListSync!: any;

		private showValue = 0;

		private form: any = {
			name: "",
			value: "",
			typeValue: 0,
		};

		private color: string = "#6087FD";
		private typeOptions = [
			{
				value: 0,
				label: "固定值",
			},
		];

		private showOptions = [
			{
				value: 0,
				label: "名称和值",
			},
			{
				value: 1,
				label: "名称",
			},
			{
				value: 2,
				label: "值",
			},
		];

		private handleSave() {
			(<any>this).$refs["form"].validate((valid: boolean) => {
				if (valid) {
					this.setValue();
					this.visibleSync = false;
				} else {
					return false;
				}
			});
		}
		private handleColse() {}

		private setValue() {
			let markLine = {
				lineStyle: {
					normal: {
						color: this.color, // 这儿设置安全基线颜色
					},
				},
				data: [
					{
						yAxis: this.form.value, //值
					},
				],
				label: {
					normal: {
						formatter: this.form.name, // 这儿设置安全基线
					},
				},
			};
			this.$set(this.data.config, "markLine", markLine);
		}
		private handleOpen() {
			if (this.type == "add") {
				this.form.name = "";
				this.color = "";
				this.form.value = "";
			} else {
				this.form.name = this.data.config.markLine.label.normal.formatter;
				this.color = this.data.config.markLine.lineStyle.normal.color;
				this.form.value = this.data.config.markLine.data[0]?.yAxis;
				console.log();
				this.showValue = 2;
				this.form.typeValue = 0;
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .markline-dialog {
		.flex {
			display: flex;
		}
		.title {
			font-weight: bold;
			color: #525d6d;
			margin-bottom: 8px;
		}
		.rvue-input .el-input .el-input__inner {
			border-radius: 2px;
			height: 36px;
			border: 1px solid #dcdfe6;
		}
		.margin-r {
			margin-right: 10px;
		}
		.el-dialog__title {
			font-weight: bold;
		}
	}
</style>
