<template>
	<div style="height: 100%">
		<div class="form-data" v-loading="loading" v-if="showTure">
			<header class="form-name">
				<span class="titleName">
					{{ formName }}
					<div class="btnSwitch">
						<rvue-button class="capture" icon="el-icon-scissors" size="mini" @click="handleToImage"></rvue-button>
						<rvue-button v-if="flowType !== 'P'" size="mini" plain @click="exhibit()" :icon="lg ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"> </rvue-button>
						<router-link
							v-if="!isMobile && curPerm.isAppDesign && $route.params.formCode"
							:to="`/${$route.params.tenantId}/appd/${$route.params.appCode}/p/bi/${$route.params.formCode}/dashboard_design/`"
						>
							<el-tooltip placement="bottom">
								<div slot="content" style="text-align: center">{{ curFormType != "P" ? $t("Mheader.editForm") : $t("Mheader.editDashboard") }}</div>
								<rvue-button icon="el-icon-edit" plain class="nav-btn"> </rvue-button>
							</el-tooltip>
						</router-link>
					</div>
				</span>
			</header>

			<rvue-grid-layout modeE="view" ref="layout" :theme.sync="theme" :readyOnly="true" :layoutM.sync="layoutM" :layout.sync="layout" :mode="mode"> </rvue-grid-layout>

			<js-code
				:option="{
					...jsOptions,
					selects,
					query: $refs.form,
				}"
				source="query"
				v-if="Object.keys(jsOptions).length"
				ref="jscode"
			></js-code>
		</div>
		<div v-else class="noInfo">找不到该页面</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Provide } from "vue-property-decorator";

	import { getQueryConf } from "@/api/flowcenter";
	import { getFormSingle, getData, getRightList, saveData, updateData, getFormSingleTest } from "@/api/form";
	import { FormModule } from "@/store/modules/form";
	import { PermissionModule } from "@/store/modules/permission";
	import dataFilter from "@/core/dataFilter";
	import toDatetime from "@/core/toDatetime";
	import RvueGridLayout from "@/components/gridLayout/rvueGridLayout.vue";
	import { isMobile } from "@/utils/global";
	import Jscode from "@/components/jscode/jscode";
	import html2canvas from "html2canvas";

	let queryData: any;
	@Component({
		components: {
			RvueGridLayout,
			"js-code": Jscode,
		},
	})
	export default class biForm extends Vue {
		@Provide() formCode = this.$route.params.formCode;
		@Provide() appCode = this.$route.params.appCode;
		private loading: boolean = true;
		private formQueryData: any = [];
		private lg: boolean = false; //条件查询显示开关
		private dataId = 0;
		private option: any = {};
		private formName: string = "";
		private flowType: string = "";
		private tableList: any = {};
		private data: any = new Array(1);
		private filterRule: any = { isDeleted: false, matchRules: [[]], createTimeBegin: "", createTimeEnd: "", creater: "", sorts: [{ asc: false, column: "create_time" }] };

		private layout: any = []; //仪表盘数据数组
		private layoutM: any = []; //仪表盘数据数组-移动
		private theme: string = "blue";
		private formDetailKey = new Date().getTime();
		private mode: string = isMobile() ? "mobile" : "pc";
		private jsOptions: Record<string, any> = {};
		private selects: Record<string, any>[] = [];
		private showTure: any = true;
		private showForm: any = false;
		private arrType: any = [];
		private get FormName() {
			return FormModule.curFormName;
		}

		private get isMobile() {
			return "ontouchend" in window;
		}

		private get isCurPerm() {
			return PermissionModule.isCurPerm;
		}

		private get curFormType() {
			return FormModule.curFormType;
		}

		private get curPerm() {
			return PermissionModule.curPerm;
		}

		private handleToImage() {
			let opts = { scale: window.devicePixelRatio };
			let el: HTMLElement = (this.$refs.layout as Vue & { $el: HTMLElement }).$el;
			let a = document.createElement("a");
			const loading = this.$loading({
				lock: true,
				text: "生成中",
				spinner: "el-icon-loading",
				background: "rgba(0, 0, 0, 0.7)",
			});

			html2canvas(el, opts).then((canvas: any) => {
				a.href = canvas.toDataURL("image/png");
				a.download = this.formName;
				a.click();
				loading.close();
			});
		}

		protected async created() {
			let formCode = this.$route.params.formCode;
			let { data: rData } = await getRightList({ formCode });
			rData.forEach((item: any) => {
				this.arrType.push(item.type);
			});
			if (this.arrType.includes("8")) {
				this.showForm = true;
			}

			if (localStorage.loginType == "guest" && this.showForm != true) {
				this.showTure = false;
			}
			//getFormSingle换
			Promise.all([getQueryConf(this.formCode), getFormSingle(this.appCode, this.formCode)]).then((values) => {
				//仪表盘

				let { name, type, structure, dstructure } = values[1].data;

				this.formName = name;
				this.flowType = type;

				if (this.flowType === "P") {
					this.layout = structure?.layout;
					this.layoutM = structure?.layoutM;
					this.loading = false;
					return;
				}
			});
		}

		private exhibit() {
			this.lg = !this.lg;
		}
	}
</script>
<style lang="scss" scoped>
	.capture {
		padding: 3px !important;
		border-color: #6087fd;
		background: #6087fd;
		color: #fff;
	}

	.titleName {
		color: #666666;
		font-size: 15px;
	}
	.btnSwitch {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);

		button {
			padding: 3px;
			border-color: $color;
			background: $color;
			color: #fff;
		}
	}
	.btnTitle {
		display: inline-block;
		margin-left: 10px;
		vertical-align: text-top;
	}
	.form-data {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		position: relative;
		overflow: hidden;
		.form-name {
			padding: 8px 10px;
			font-size: 18px;
			background-color: #fff;
			margin: 5px 5px;
			position: relative;
		}
	}
	::v-deep .el-dialog__header {
		background-color: #4c81ff;
		.el-dialog__title,
		.el-dialog__headerbtn .el-dialog__close {
			color: #fff;
		}
	}
	::v-deep .el-dialog {
		margin-bottom: 0px;
		height: 100vh;
	}
	::v-deep .el-dialog__wrapper .el-dialog__body {
		height: calc(100vh - 60px);
	}
	::v-deep .addListDialog {
		.el-dialog__body {
			overflow-y: scroll;
		}
	}
	::v-deep .detail-dialog {
		.el-dialog__body {
			padding: 0;
		}
	}
	::v-deep .el-button--mini {
		padding: 0.3rem 0.6rem;
		margin-right: 10px;
	}
	/* ::v-deep .vue-grid-layout {
		min-width: auto !important;
	} */
</style>
