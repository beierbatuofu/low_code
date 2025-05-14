<template>
	<div class="buttons-box">
		<div v-if="flowType == 'C'">
			<!-- 普通表单 -->
			<!-- 编辑 -->
			<el-button type="primary" @click="handleEdit" icon="el-icon-edit" v-if="!syncedIsEdit" class="button-edit">
				{{ $t("global.edit") }}
			</el-button>
			<!-- 提交 -->
			<el-button type="primary" icon="el-icon-circle-check" @click="handleSubmit" v-if="syncedIsEdit">
				{{ $t("global.submitted", []) }}
			</el-button>
			<!-- 删除 -->
			<el-button type="primary" icon="el-icon-delete" @click="handleDelete" v-if="!syncedIsEdit" class="button-del">
				{{ $t("global.deletion") }}
			</el-button>
		</div>
		<!-- processStatus  0进行中， 1流转成功， 2流转失败， 8终止流程， 9我的草稿 -->
		<div v-if="flowType == 'F' && (processStatus == 2 ? false : true)">
			<!-- 流程表单 -->
			<!-- 在当前审批节点中(创建表单后已提交)，才显示按钮，否则只读 -->
			<div v-if="syncedIsUserAuthority">
				<!-- 通过 -->
				<el-button type="primary" icon="el-icon-check" @click="handleCheck" v-if="!isStart">
					{{ $t("global.pass") }}
				</el-button>
				<!-- 提交 -->
				<el-button type="primary" icon="el-icon-circle-check" @click="handleSubmit" v-if="isStart">
					{{ $t("global.submitted", []) }}
				</el-button>
				<!-- 暂存 -->
				<el-button type="primary" icon="el-icon-folder-checked" @click="handleTS" class="button-edit">
					{{ $t("global.TS") }}
				</el-button>
				<!-- 强制结束 -->
				<el-button type="primary" icon="el-icon-circle-close" @click="handleEnd" class="button-red">
					{{ $t("global.end") }}
				</el-button>

				<!-- 退回 -->
				<el-button type="primary" icon="el-icon-back" @click="handleBack" v-if="!isStart" class="button-edit">
					{{ $t("global.back") }}
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Emit, Vue, Watch, Prop, PropSync } from "vue-property-decorator";

	@Component({})
	export default class buttons extends Vue {
		@PropSync("isUserAuthority", { type: Boolean }) syncedIsUserAuthority!: boolean;
		@Prop({ type: Boolean, default: false }) isStart!: boolean;
		@PropSync("isEdit", { type: Boolean }) syncedIsEdit!: boolean;
		@Prop({ type: String, default: "" }) flowType!: string;
		@Prop({ type: Number || String, default: -1 }) processStatus!: string;

		private type: any = this.$route.path.split("/").pop();

		@Emit("handleSubmit")
		handleSubmit() {}

		@Emit("handleEdit")
		handleEdit() {}

		@Emit("handleTS")
		handleTS() {}

		@Emit("handleEnd")
		handleEnd() {}

		@Emit("handleBack")
		handleBack() {}

		@Emit("handleDelete")
		handleDelete() {}

		@Emit("handleCheck")
		handleCheck() {}
		created() {
			if (this.type == "draft") {
				this.syncedIsEdit = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.buttons-box {
		position: fixed;
		bottom: 10px;
		left: 12%;
		width: 49% !important;
		padding-top: 0 !important;
		margin-top: 0 !important;
		height: 80px;
		border-top: 1px dotted #ccc;
		line-height: 80px;
		background-color: white;
		overflow: hidden;
		z-index: 999;
		> div {
			display: inline-block;
		}
		button {
			margin-top: 0;
		}
	}

	.button-red {
		background-color: #e44e4e !important;
		border-color: #e44e4e !important;
	}
	.button-red:hover,
	.button-red:active,
	.button-red:focus,
	.button-del:hover,
	.button-del:active,
	.button-del:focus {
		background-color: #eb7a7a !important;
		border-color: #eb7a7a !important;
		color: white !important;
	}

	.button-edit {
		background-color: #fff !important;
		border-color: #4c84ff !important;
		color: #4c84ff !important;
	}
	.button-edit:hover,
	.button-edit:active,
	.button-edit:focus {
		background-color: #4c84ff !important;
		border-color: #4c84ff !important;
		color: white !important;
	}

	.button-del {
		background-color: #fff !important;
		border-color: #e44e4e !important;
		color: #e44e4e !important;
	}

	@media screen and (max-width: 768px) {
		.buttons-box {
			position: fixed;
			bottom: 0px;
			left: 0;
			width: 100% !important;
			margin-top: 0 !important;
			padding: 0 10px !important;
			height: 60px;
			border-top: 1px dotted #ccc;
			line-height: 60px;
			background-color: white;
			overflow: hidden;
			z-index: 999;
			> div {
				width: 100%;
				> div {
					width: 100%;
					@include JustityAndFlexWrap(flex,space-around,null,nowrap);
					flex-direction: row;
				}
			}
			button {
				margin-right: 10px;
				font-size: 12px;
			}
			button:last-child {
				margin-right: 0px;
			}
			.el-button {
				padding: 10px;
				display: block;
			}
		}
	}
</style>
