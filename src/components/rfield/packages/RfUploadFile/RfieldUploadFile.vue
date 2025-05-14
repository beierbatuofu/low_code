<template>
	<div class="upload-file">
		<Upload
			v-if="config.edit"
			:key="fieldId"
			:action="action"
			:multiple="config.multiple"
			:limit="10"
			:headers="uploadData"
			:size="10"
			:objectName="objectName"
			:form="form"
			:fieldId="fieldId"
			:imgList.sync="fileValue"
			@handleChange="handleUpdate"
			@delfile="handleDelfile"
			:bCanPreview="bCanPreview"
			:tableProp="tableProp"
			:columnIndex="columnIndex"
			:isTableDetail="isTableDetail"
			:allReadonly="readonly"
			:prop="fieldId"
			mode="design"
			:width="config.width"
			@change="handleChange"
			:timestamp="timestamp"
			:closeForm="closeForm"
		></Upload>
		<el-button
			size="small"
			:disabled="true"
			v-else
			type="primary"
			class="uploadBtn"
			:style="{ width: Number(config.width) - 25 + 'px', border: disabled ? 'none' : '' }"
			:class="tableProp ? 'uploadBtn-intable upfile-disabled' : 'upfile-disabled'"
		>
			<i class="el-icon-upload"></i>附件
		</el-button>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop, Watch, PropSync } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import { RCall } from "@/utils/RCall";
	import Upload from "@/components/rvue/custom/packages/upload/upload";
	import "./_core/RfUploadFile";

	@Component({
		components: {
			Upload,
		},
	})
	export default class RvueFieldUploadFile extends WidgetField {
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: Boolean, default: true }) closeForm!: boolean;
		public action = "";
		public uploadData = { token: window.localStorage.getItem("token") };
		private objectName = "";
		private bCanPreview = true; //允许预览
		private fileValue: TJson = [];

		private handleDelfile(file: Record<string, string>) {
			this.$emit("delfile", file);
		}

		created() {
			let val = this.value || "";
			this.fileValue = typeof val == "string" && val ? JSON.parse(val) : JSON.parse(JSON.stringify(val));
		}

		@Watch("form", { deep: true })
		onChangeForm() {
			try {
				let val = (<any>this).form[this.tableProp]["data"][this.columnIndex][this.config.fieldId];

				this.fileValue = typeof val == "string" && val ? JSON.parse(val) : JSON.parse(JSON.stringify(val));
			} catch (err) {}
		}
	}
</script>

<style lang="scss" scoped>
	.upfile-disabled {
		width: 280px;
		height: 33px;
		background: #999 !important;
	}
	.upload-file {
		.upload-button {
			width: 260px;
			i {
				padding-right: 10px;
			}
		}
	}
	.no-click {
		pointer-events: none;
	}
</style>
