<template>
	<div class="form-detail">
		<div class="header" v-if="formTitle"><i class="el-icon-arrow-left return" v-if="isShowReturnIcon" @click="handleClose"></i>{{ formTitle }}</div>
		<rvue-tabs v-model="activeName" class="tabs" v-if="isMobile">
			<rvue-tab-pane label="表单数据" name="a"></rvue-tab-pane>
			<rvue-tab-pane label="流程日志" name="b" v-if="flowLogData.length"></rvue-tab-pane>
		</rvue-tabs>
		<template>
			<div :class="bMobileS ? 'left' : 'leftM'" v-if="activeName == 'a' || !isMobile" :style="{ marginRight: flowLogData && flowLogData.length ? '30%' : '0' }">
				<form-info :flowInfo="flowInfo"></form-info>
				<form-content v-show="!drawer" :mode="mode" :formConf="formConf" @close="handleClose"></form-content>
			</div>

			<div class="right" v-if="activeName == 'b' || !isMobile">
				<flow-log :flowLogData="flowLogData" :style="drawer == true ? 'display:none' : 'display:block'">
					<template #top>
						<rvue-button v-if="formDetailConf.formType == 'F'" size="mini" round @click="handleClick">{{ $t("tableDesign.flowChart") }}</rvue-button>
					</template>
				</flow-log>
			</div>

			<rvue-drawer :visible.sync="drawer" size="100%" :modal="false" class="drawer" style="background: #fff; height: 100vh" :show-close="false">
				<div class="drawer-title" slot="title">
					<i class="el-icon-close return" @click="drawer = false"></i>
					<!-- <div class="ver" v-if="version">{{ $t("tableDesign.processVersion") }}(V{{ version }})</div> -->
					<div class="state" :flow-id="formDetailConf.processId">
						<div class="item"><i class="status_1"></i>已处理</div>
						<div class="item"><i class="status_not"></i>未处理</div>
						<div class="item"><i class="status_3"></i>强制结束</div>
					</div>
				</div>
				<rvue-flow class="rvue-flow" :key="flowkey" :preview="true" :readonly="true" :defaultData="chartData">
					<div slot="cond" slot-scope="scope">
						<div v-for="(group, gIdx) in scope.data.matchRules" class="cond-group">
							<div v-for="(row, rIdx) in group" class="cond-row">
								<div>{{ fieldName(row) }}</div>

								<div class="m">{{ $t(`formDesign.${row.method}`) }}</div>
								<div class="v">{{ judgeValues(row) }}</div>
							</div>

							<div v-if="gIdx != scope.data.matchRules.length - 1" style="padding: 3px 10px; font-weight: 500">或</div>
						</div>
					</div>
					<!-- <div slot="node" slot-scope="scope" style="padding: 3px">
						<span style="margin: 2px" v-for="(group, gIdx) in scope.data.assigneeList" :key="gIdx">
							<rvue-tooltip class="item" effect="dark" :content="group.name">
								<rvue-avatar size="small" v-if="group.avatar" :src="group.avatar"></rvue-avatar>
								<img :src="`${publicPath}img/org.png`" width="28" height="28" v-if="group.type != 2 && !group.avatar" />
								<img style="border-radius: 14px; background: #f5f5f5" :src="`${publicPath}img/avatar.svg`" width="28" height="28" v-if="group.type == 2 && !group.avatar" />
							</rvue-tooltip>
						</span>
					</div> -->
				</rvue-flow>
			</rvue-drawer>
		</template>
		<!-- <template v-else>
			<rvue-empty :desc="$t('global.empty')"></rvue-empty>
		</template> -->
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Provide, PropSync } from "vue-property-decorator";
	import { getFormSingle, getData, saveData, updateData } from "@/api/form";
	import formInfo from "./formInfo";
	import formContent from "./formContent.vue";
	import FlowLog from "./flowLog.vue";
	import FormDetailCore from "./_core/FormDetailCore";
	import rvueFlow from "@/components/rvue/custom/packages/flow/flow.vue";

	@Component({
		components: {
			formInfo,
			formContent,
			FlowLog,
			"rvue-flow": rvueFlow,
		},
	})
	export default class FormDetail extends Vue {
		@Prop({ type: [Number, String], default: 0 }) dataId!: number | string;
		@Prop({ type: String, default: "" }) formCode!: string;
		@Prop({ type: String, default: "normal" }) mode!: "normal" | "manage";

		@Provide("conf")
		formDetailConf: TJson = {
			formType: "C",
			dataId: 0,
			formCode: "",
			appCode: "",
			processId: "",
			formData: {},
		};

		private activeName = "a";
		private flowInfo: TJson = {};
		private formConf: TJson = {};
		private flowLogData: TJson[] = [];
		private chartData: string = "";
		private drawer: boolean = false;
		private isLoading: boolean = false;
		private flowImg: string = "";
		private bMobileS: boolean = true;
		private flowkey: number = 1;

		private get isShowReturnIcon() {
			return window.history.length > 1;
		}

		private fieldName(row: Record<string, any>) {
			let lang = localStorage.getItem("lang") || "zh";
			let configList = this.formConf.structure.configList;

			let tableName = "";
			if (row.parentSubFormTargetFieldCode) {
				let tableConf = configList.find((item: Record<string, any>) => item.fieldId == row.parentSubFormTargetFieldCode);

				if (tableConf) {
					configList = tableConf.children;
					tableName = tableConf?.title[lang] || "" + "-";
				}
			}

			let widgetConf = configList.find((item: Record<string, any>) => item.fieldId == row.targetFieldCode);
			if (!widgetConf) return "已删除";
			return tableName + widgetConf?.title[lang] || "";
		}

		private judgeValues(row: Record<string, any>) {
			let value = row.judgeValues;

			if (row.type == "datetime") {
				return value.join("~");
			}

			if (typeof value[0] == "string" || typeof value[0] == "number") return String(value);

			if (row.type == "number" && row.method == "between") {
				const precision = ".00";
				let min = String(value[0][0]).includes(".") ? String(value[0][0]) : value[0][0] + precision;
				let max = String(value[0][1]).includes(".") ? String(value[0][1]) : value[0][1] + precision;

				if ((value[0][0] != 0 && !value[0][0]) || value[0][0] == "undefined") {
					return "≤" + max;
				}
				if ((value[0][1] != 0 && !value[0][1]) || value[0][1] == "undefined") {
					return "≥" + min;
				}

				return min + "~" + max;
			}

			if (Array.isArray(value)) {
				let names: string[] = [];
				value.forEach((item: Record<string, any>) => names.push(item.name));
				return String(names);
			}
		}

		private handleClose() {
			this.$emit("close");
		}

		private get formTitle() {
			let lang = localStorage.getItem("lang") || "zh";

			return this.formConf.formTitle ? this.formConf.formTitle[lang] : "";
		}

		private get isMobile() {
			return this.$utils.bMobile;
		}

		private handleClick() {
			this.drawer = true;
			this.flowkey++;
			this.$nextTick(() => {
				//	this.registerCanvas(this.chartData);
			});
		}

		@Watch("dataId", { immediate: true })
		onChangeDataId(n: number) {
			let bMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
			if (bMobile) {
				this.bMobileS = false;
			}
			FormDetailCore.ins()
				.getData(this.formCode, Number(this.dataId))
				.then((res) => {
					this.flowInfo = res.flowResp;
					this.formConf = res.formConfResp;

					this.formDetailConf.formData = this.formConf.resFormData;
					this.formDetailConf.formType = res.formType;
					this.formDetailConf.processId = res.formConfResp.process_instance_id;
					this.formDetailConf.dataId = Number(this.dataId);
					this.formDetailConf.formCode = this.$route.query.formCode || this.$route.params.formCode;
					this.formDetailConf.appCode = this.$route.query.appCode || this.$route.params.appCode;
					this.flowLogData = res.flowlogResp;
					this.chartData = res.chartResp;
					this.isLoading = true;
				});
		}
	}
</script>
<style scoped lang="scss">
	::v-deep {
		.status_1,
		.status_2 {
			background: #67c23a !important;
		}
		.status_3 {
			background: rgb(224, 38, 38) !important;
		}
		.status_not {
			background: #a8a8a8 !important;
		}
	}
	.state {
		display: flex;
		justify-content: center;
		font-size: 12px;
		.status_1,
		.status_2 {
			background: #67c23a;
		}
		.status_3 {
			background: rgb(224, 38, 38);
		}
		.status_not {
			background: #a8a8a8 !important;
		}
		.item {
			margin: 0 5px;
			i {
				display: inline-flex;
				width: 10px;
				height: 10px;
				margin-right: 2px;
			}
		}
	}
	.cond-group {
		padding: 5px;
		color: #333;
		font-weight: bold;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.cond-row {
		padding: 2px 5px;
		background: #f4f6f9;
		text-align: justify;
		word-break: break-all;
		& > div {
			display: inline;
			font-size: 13px;
		}
		.m {
			padding: 0 5px;
			color: #a9a9a9;
		}
	}
	.rvue-flow {
		overflow: auto;
	}
	.header {
		text-align: center;
		font-size: 18px;
		padding: 10px;
		background: $color;
		color: #fff;
		position: relative;
		.return {
			position: absolute;
			left: 5px;
			font-size: 26px;
			font-weight: bold;
		}
	}

	.form-detail {
		@include PositionRelative(100%, null);
	}
	.left {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		z-index: 2;
		@include PositionRelative(null, calc(100vh - 140px));
	}
	.right {
		@include PositionAbsoulte(47px, 0, 0, null);
		width: 30%;
		padding: 5px 10px;
		box-sizing: border-box;
		z-index: 1;
	}

	::v-deep {
		.el-timeline-item__node--normal {
			left: 0;
		}
		.drawer-title {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 9999;
			background: #fff;
			.return {
				@include PositionAbsoulte(50%, 0, null, null);
				transform: translateY(-50%);
				font-size: 22px;
				color: #333;
				font-weight: bold;
			}
			.state {
				text-align: center;
				padding: 10px 0;
				height: 40px;
				border-bottom: 1px solid #ccc;
				li {
					@include VertivalAlign(inline-block, top, null, null);
					margin: 0 8px;
				}
			}
			.icon {
				@include VertivalAlign(inline-block, middle, 16px, 16px);
				margin-top: -3px;
				margin-right: 5px;
			}
		}
		// .el-drawer__wrapper {
		// 	position: absolute;
		// }
		.el-drawer__container,
		.el-drawer__body {
			display: block;
			overflow: auto;
		}
		.el-drawer__header {
			padding: 0;
			margin: 0;
		}
		.el-drawer__close-btn {
			@include PositionAbsoulte(50%, 0, null, null);
			transform: translateY(-50%);
		}
		.el-drawer__header {
			@include PositionRelative(null, null);
		}
		.el-tabs__item {
			// padding: 0 5px;
		}
	}

	@media screen and (max-width: 768px) {
		.form-detail {
			height: 100%;
			overflow: hidden;
		}
		.tabs {
			display: block;
			visibility: initial;
			margin: 8px;
			> * {
				display: block;
				visibility: initial;
			}
		}
		.leftM {
			margin: 0;
			width: 100%;
			//height: calc(100vh - 120px);
			overflow: auto;
			padding: 0;
			display: block;
			height: 100%;
		}
		.right {
			@include PositionRelative(100%, null);
			top: 0;
		}
		.form-info {
			width: 100%;
			grid-template-columns: repeat(auto-fill, 100%);
		}
	}
</style>
