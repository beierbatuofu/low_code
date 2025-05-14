<template>
	<div id="import-dialog">
		<el-dialog title="导入" :visible="importsVisible" width="70%" center append-to-body @close="$emit('visible')">
			<div class="dialog-content">
				<el-steps space="25%" :active="0" align-center process-status="finish">
					<el-step title="导入Excel"></el-step>
					<el-step title="数据预览"></el-step>
					<el-step title="匹配数据"></el-step>
					<el-step title="导入数据"></el-step>
				</el-steps>
				<div class="content-info">
					<div class="content-info-left">
						<div class="import-settings">
							<h4 style="color: #000; margin-bottom: 20px">导入设置</h4>
							<div>
								<el-radio v-model="radio" label="1">仅新增数据</el-radio>
								<el-radio v-model="radio" label="2">新增和更新数据</el-radio>
							</div>
							<div style="margin-top: 20px; cursor: pointer" @click="templateDownload">标准模板下载</div>
							<div style="margin-top: 20px">
								<el-checkbox v-model="checked">导入数据触发流程</el-checkbox>
							</div>
						</div>
						<div class="explain">
							<h4 style="color: #000; margin-bottom: 20px">说明:</h4>
							<p>1.如需通过导入更新数据，请先导出需要更新的数据并完成修改</p>
							<p>2.系统按照匹配字段来更新数据，匹配字段默认为上传的Excel表中的第一列</p>
							<p>3.文件限制为 5MB 以内的xls、xlsx格式的文件</p>
							<p>4.文件中数据不能超过50000行、200列（若导入为部门成员字段，则不能超过10000行、200列）子表单明细同样占用行数</p>
							<p>5.若勾选「导入的数据触发流程」，则最多允许导入300条数据</p>
						</div>
					</div>
					<div class="content-info-right">
						<el-upload
							class="upload-demo"
							drag
							action="#"
							:multiple="false"
							:http-request="httpRequest"
							:on-change="uplpadChange"
							:on-success="onSuccess"
							:before-upload="beforeUpload"
							accept=".xls,.xlsx"
						>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">点击此处上传Excel</div>
						</el-upload>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync, Inject } from "vue-property-decorator";

	import { exportExcelTemplate, getUploadUrl, importFile, queryImportOrExportProgressInfo, exportFormDataToExcel } from "@/api/form";

	import Xhrs from "@src/components/rvue/custom/packages/upload/core.ts";
	import UpLoading from "@src/components/rvue/custom/packages/upload/_components/uploading.tsx";

	@Component({})
	export default class importDialog extends Vue {
		@Prop({
			type: Boolean,
			default: false,
		})
		importsVisible!: boolean;

		private radio: string = "1";
		private checked: boolean = false;
		private taskId: string = "";
		private loading: any = null;
		private timer: any = null;
		private blobFile: any = {};

		@Watch("importsVisible", {
			immediate: true,
		})
		importsVisibleChange(falg: boolean) {}

		// 模板下载
		private async templateDownload() {
			let { appCode, id } = this.$route.params;
			let { data } = await exportExcelTemplate(appCode, id);
			let a = document.createElement("a");
			a.href = data;
			a.download = "标准模板";
			a.click();
			URL.revokeObjectURL(data);
			a.remove();
		}

		// 文件状态改变时触发
		private uplpadChange(file: any, fileList: any) {
			this.blobFile = file.raw;
			if (fileList && fileList.length > 1) {
				fileList.splice(0, 1);
			}
		}

		private async httpRequest(file: any) {
			let { appCode, id } = this.$route.params;

			this.loading = UpLoading({
				onClosed: () => Xhrs.ins().abort(),
				btnText: <string>this.$t("global.cancelUpload"),
				message: <string>this.$t("global.uploading"),
			});

			try {
				let { data } = await getUploadUrl(id);

				let importData = {
					objectName: data.objectName,
					// fileName:file.file.name,
					isStartProcess: "0",
					appCode: appCode,
					formCode: id,
				};

				let xhr: any = new XMLHttpRequest();

				Xhrs.ins().add({
					xhr,
					objectName: data.objectName,
				});

				xhr.open("put", data.url, true); // 第三个参数为async?，异步/同步
				xhr.setRequestHeader("Content-Type", "application/octet-stream");

				xhr.send(this.blobFile);
				xhr.onreadystatechange = () => {
					if (xhr.readyState == 4) {
						if (xhr.status === 200) {
							importFile(importData).then((res: any) => {
								this.loading.close();
								this.loading = null;
								this.taskId = res.data;
							});
						}
					}
				};
			} catch (err) {
				console.log(err);
			}
		}

		private queryImportOrExportProgressInfo() {
			let { appCode, id } = this.$route.params;
			this.polling(async () => {
				return await queryImportOrExportProgressInfo(appCode, id, this.taskId);
			}, 1000);
			this.loading = UpLoading({
				onClosed: () => clearTimeout(this.timer),
				btnText: "取消",
				message: "导入中",
			});
		}

		private polling(callback: any, delay: number) {
			this.timer = setTimeout(async () => {
				const res = await callback();
				if (res.data.code != "EXCEL_IMPORT_TASK_END") {
					this.polling(callback, delay);
				} else {
					clearTimeout(this.timer);
					this.loading.close();
					this.$emit("visible", true);
					this.$message.success("导入成功");
				}
			}, delay);
		}

		private onProgress(event: any, file: any, fileList: any[]) {}

		private beforeUpload(file: any) {}

		private onSuccess(response: any, file: any, fileList: any) {}

		private submit() {
			this.queryImportOrExportProgressInfo();
		}
	}
</script>

<style lang="scss" scoped>
	.content-info {
		// height: 300px;
		margin: 20px;
		display: flex;

		> div {
			flex: 1;
		}

		.content-info-left {
			padding-right: 10%;

			.explain {
				margin-top: 20px;
				line-height: 20px;
			}
		}

		.content-info-right {
			display: flex;
			justify-content: center;
			align-items: center;

			.upload-demo {
			}
		}
	}
</style>
