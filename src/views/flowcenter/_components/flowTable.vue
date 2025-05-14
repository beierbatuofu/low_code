<template>
	<div class="flowcenter-wrap">
		<div class="wrap-search">
			<div class="search">
				<div class="search-font">{{ tabTitle }}</div>
				<div class="search-info">
					<el-popover placement="bottom" title="应用" width="300" trigger="click" v-if="$route.params.flag != 'p'">
						<el-select
							@change="searchFuzzy"
							ref="agentSelect"
							v-model="searchName"
							clearable
							filterable
							remote
							:remote-method="remoteMethod"
							:loading="searchLoading"
							style="width: 250px"
							@hook:mounted="cancalReadOnly"
							@visible-change="cancalReadOnly"
						>
							<el-option v-for="item in searchOptions" :key="item.id" :label="item.name" :value="item.code"> </el-option>
						</el-select>
						<div class="info-left info-box" slot="reference">
							<span class="el-icon-search"></span>
							<span>查询</span>
						</div>
					</el-popover>

					<el-popover placement="bottom" width="150" trigger="click" v-model="sortPopoverVisible" popper-class="sort-popover">
						<div class="wrap-sort">
							<div @click="timeOrder(false)">更新时间升序</div>
							<div @click="timeOrder(true)">更新时间降序</div>
						</div>
						<div class="info-right info-box" slot="reference">
							<span class="right-icon">
								<span class="el-icon-caret-top icon-top" :class="{ 'icon-check': !searchOrder }"></span>
								<span class="el-icon-caret-bottom icon-bottom" :class="{ 'icon-check': searchOrder }"></span>
							</span>
							<span class="right-font">排序</span>
						</div>
					</el-popover>
				</div>
			</div>
		</div>
		<div class="container" v-if="list.length > 0">
			<div class="title">
				<!-- <span>
					{{ title }}
				</span> -->

				<!-- <div>
					<span> 筛选 </span>
					<span>最新</span>
				</div> -->
			</div>
			<div class="group" :class="flowClass(item.processStatus)" v-for="(item, index) in list" :key="index" @click="bindClick(item)">
				<div class="flex" style="margin-left: 20px">
					<div class="flex toFlex">
						<!-- <img class="avatar-image" :src="type == 'draft' ? userAvatar : item.createUserAvatar" /> -->
						<rvue-avatar :size="50" :src="type == 'draft' ? userAvatar : item.creatorAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"> </rvue-avatar>
						<div class="user">
							<div class="bolder">{{ $t("flow.startUser") }}</div>
							<div class="name">
								{{ type == "draft" ? userName : item.creatorName }}
							</div>
						</div>
					</div>

					<div class="flex flow-status" style="width: 300px">
						<i style="font-size: 34px; margin-right: 20px" class="el-icon-document"></i>
						<!-- <img class="avatar-image" style="border-radius: 0" src="/img/file.png" /> -->
						<div style="line-height: 20px">
							<div class="bolder" style="margin-bottom: 18px" :title="type == 'draft' ? item.name : item.formName">
								{{ type == "draft" ? item.name : item.formName }}
							</div>
							<div class="name form-name" v-if="flowStatus(item.processStatus)" :class="flowFormName(item.processStatus)" style="width: 70px; text-align: center">
								{{ flowStatus(item.processStatus) }}
							</div>
						</div>
					</div>
					<div class="flex">
						<i style="font-size: 34px; margin-right: 20px" class="el-icon-share"></i>
						<!-- <img class="avatar-image" src="/img/file2.png" /> -->
						<div style="width: 240px; overflow: hidden">
							<div class="bolder" style="margin-bottom: 15px">
								{{ $t("tableDesign.currentNode") }}
							</div>
							<div>
								<span v-if="item.currentNodeStructure" style="margin-right: 20px">{{ type == "draft" ? "开始节点" : getFlowNodeName(item) }}</span>
								<span class="name">{{ type == "draft" ? userName : assigneeList(item.currentNodeAuditInfo) }}</span>
							</div>
						</div>
					</div>
					<div class="timeStyle">
						{{ item.updateTime }}
					</div>
				</div>
			</div>
		</div>

		<!-- <rvue-empty v-else class="flowcenter-empty"></rvue-empty> -->
		<div class="flex flow-table" v-if="total > 5">
			<el-button type="button" @click="handleJumpPage(1)">{{ $t("flow.start") }}</el-button>
			<el-pagination
				background
				:pager-count="pageNumber"
				layout="prev, pager, next"
				:total="total"
				:page-size="size"
				@current-change="handlePageChange"
				ref="pagination"
				:current-page="currentPage"
			>
			</el-pagination>
			<el-button type="button" @click="handleJumpPage(Math.ceil(total / size))">{{ $t("flow.end") }}</el-button>
		</div>
		<!-- <FlowDialog
			@close="handleClose"
			:formCode="formCode"
			:dataId="dataId"
			:visible.sync="visible"
			:detail="detail"
			:nodeDetail="nodeDetail"
			:processId="processId"
			:flowType="getFlow"
			@updateTable="updetaData"
			:processStatus="processStatus"
			:noSameValList="noSameValList"
			:dateTimePropList="dateTimePropList"
		/> -->
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";
	import { getTask, getFlowDetail, getNodeDetail, getMyDraftList, buttonManage, queryFuzzy } from "@/api/flowcenter";
	import FlowDialog from "./flowDialog";
	import todoVue from "../todo.vue";

	//0我的代办 1我发起的 2我处理的 3抄送我的
	enum NumTypes {
		todo = 1,
		create = 2,
		transactors = 3,
		ccUsers = 4,
		draft = 5,
	}

	enum TNodeStatusList {
		"flow.doing" = 1,
		"flow.flowFinish" = 9,
		"flow.stopFlow" = 8,
	}

	@Component({
		components: {
			FlowDialog,
		},
	})
	export default class FlowTable extends Vue {
		@Prop({
			type: String,
			default: "",
		})
		title!: string;

		private list: any[] = [];
		private visible: Boolean = false;
		private detail: any = {};
		private formCode: string = "";
		private dataId: string = "";
		private nodeDetail: any[] = [];
		private currentPage: number = 1;
		private total: number = 1;
		private size: number = 5;
		private processId: string = "";
		private pageNumber: number = 5;
		private searchName: string = "";
		private searchOptions: any[] = [];
		private searchLoading: boolean = false;
		private searchOrder: boolean = true;
		private sortPopoverVisible: boolean = false;

		private processStatus: number = -1;
		private userAvatar = this.$store.getters.userAvatar;
		private userName = this.$store.getters.userName;
		private noSameValList: any = [];
		private dateTimePropList: any = [];

		// @Watch("currentPage", {
		//   immediate: true
		// })
		// onChangeValue(n: any) {
		//   this.getList();
		// }

		protected created() {
			this.getList();
		}

		private flowStatus(node: string | number): any {
			if (this.type == "draft") {
				return this.$t("flow.launchneing");
			}

			return this.$t(TNodeStatusList[Number(node)]);
		}

		private getFlowNodeName(item: Record<string, any>) {
			let lang = window.localStorage.getItem("lang") || "zh";
			if (!item.currentNodeStructure) return "";
			let node = JSON.parse(item.currentNodeStructure);
			return node.title[lang];
		}

		private handleClose() {
			this.getList();
		}

		private get getFlow() {
			return "F";
		}

		private get tabTitle() {
			let str = this.$route.path.split("/").pop();
			let title: any = "";
			switch (str) {
				case "todo":
					title = this.$t("flow.currentTodo");
					break;
				case "create":
					title = this.$t("flow.mylaunch");
					break;
				case "transactors":
					title = this.$t("flow.myhandle");
					break;
				case "ccUsers":
					title = this.$t("flow.carbonCopy");
					break;
				default:
					title = this.$t("flow.currentTodo");
			}

			return title;
		}

		private flowClass(node: string | number) {
			if (this.type == "draft") {
				return "border-or";
			}
			switch (node) {
				case 0:
					return "border-bl";
				case 1:
					return "border-gr";
				case 2:
				case 8:
					return "border-red";
				case 9:
					return "border-or";
				default:
					break;
			}
		}

		private flowFormName(node: string | number) {
			if (this.type == "draft") {
				return "background-or";
			}
			switch (node) {
				case 0:
					return "background-bl";
				case 1:
					return "background-gr";
				case 2:
				case 8:
					return "background-red";
				case 9:
					return "background-or";
				default:
					break;
			}
		}

		private assigneeList(obj: Record<"dept" | "user" | "role", string[]> | null) {
			if (!obj) return "";
			let { dept, user, role } = obj;
			dept = dept || [];
			user = user || [];
			role = role || [];
			let arr = [...dept, ...user, ...role].filter((s: string | null | undefined) => !!s);

			return String(arr);
		}

		private bindClick(item: any) {
			// console.log("bindClick==>", item);
			this.processStatus = item.nodeStatus;
			this.processId = item.processId || "";
			this.formCode = item.formCode || item.form_code;
			this.dataId = item.dataId || item.form_code_id;
			let { tenantId } = this.$route.params;

			this.$router.push({
				path: `/${tenantId}/app/${item.appCode}/p/form/${item.formCode}/${this.dataId}`,
			});

			// buttonManage(item.formCode || item.form_code, item.dataId || item.form_code_id).then((res: any) => {
			// 	let { data } = res;
			// 	let formData: any = {};

			// 	Object.keys(data.formData).forEach((k: string) => {
			// 		let v = data.formData[k];
			// 		if (typeof v == "string" && /^\[.*\]$/.test(v)) {
			// 			// formData[k] = JSON.parse(v);//
			// 			formData[k] = v;
			// 		} else {
			// 			formData[k] = v;
			// 		}
			// 	});
			// 	data.formData = formData;
			// 	let url = this.$route.path;
			// 	let { appCode, formCode, dataId, tenantId } = item;
			// });
			// if (item.processId) {
			// 	getNodeDetail({
			// 		formCode: item.formCode || item.form_code,
			// 		dataId: item.dataId || item.form_code_id,
			// 	}).then((res: TResponse) => {
			// 		if (res.code == 0) {
			// 			this.nodeDetail = res.data;
			// 		}
			// 	});
			// }
		}

		// 提交成功回调
		public onSuccess() {
			// window.location.reload();
			this.visible = false;
			this.getList();
		}
		private type: any = this.$route.path.split("/").pop();
		public getList(appCode: string = "") {
			// let { language } = this.$store.state.lang;
			let type: any = this.$route.path.split("/").pop();
			let key: any = NumTypes[type];
			let query: any = {
				type: key,
				appCode: appCode,
				pageIndex: this.currentPage,
				pageSize: 5,
				orderDesc: this.searchOrder,
			};
			// 应用内流程
			if (this.$route.params.appCode) {
				query.appCode = this.$route.params.appCode;
			}
			if (type !== "draft") {
				getTask(query).then((res: any) => {
					let { data } = res;
					if (!data) return;
					this.list = data.info || [];
					let routeFlag = this.$route.path.split("/").pop() || "todo";
					data.total && (this.total = Number(data.count));
				});
			} else {
				//我的草稿接口
				// getMyDraftList(query.currentPage, query.size).then((res: any) => {
				// 	// console.log(res);
				// 	let { data } = res;
				// 	this.list = data.records || [];
				// 	this.total = Number(data.total);
				// });
			}
		}
		//按照时间排序  倒序：true  升序:false
		private timeOrder(sort: boolean) {
			this.searchOrder = sort;
			this.sortPopoverVisible = false;
			this.getList(this.searchName);
		}

		private searchFuzzy() {
			this.currentPage = 1;
			this.getList(this.searchName);
			this.searchOptions = [];
		}

		private remoteMethod(query: any) {
			if (query.trim() !== "") {
				this.searchLoading = true;
				setTimeout(() => {
					queryFuzzy({ name: query }).then((res: any) => {
						this.searchLoading = false;
						this.searchOptions = res.data;
					});
				}, 300);
			} else {
				// this.searchLoading = false;
				this.currentPage = 1;
				this.searchOptions = [];
			}
		}

		private cancalReadOnly(onOff: any) {
			this.$nextTick(() => {
				if (!onOff) {
					let Selects: any = this.$refs;
					if (Selects.agentSelect) {
						const input: any = Selects.agentSelect.$el.querySelector(".el-input__inner");
						input.removeAttribute("readonly");
					}
				}
			});
		}

		private handlePageChange(e: number) {
			this.currentPage = e;
			this.getList(this.searchName);
		}

		private updetaData() {
			this.getList();
		}

		private handleJumpPage(target: number) {
			this.currentPage = target;
			(<any>this).$refs.pagination.handleCurrentChange(target);
		}
	}
</script>
<style lang="scss">
	.flowcenter-empty {
		@include PositionAbsoulte(50%, null, null, 50%);
		transform: translate(-50%, -50%);
	}

	.flowcenter {
		&-wrap {
			width: 100%;
			min-height: calc(100vh - 56px);
			background: #f5f5f7;

			.title {
				line-height: 50px;
				font-size: 14px;

				.count {
					color: #f0ad4e;
				}
			}

			.container {
				max-width: 1100px;
				margin: 0 auto;
				padding-bottom: 5vh;
				padding-top: 1vh;

				// height: 610px;
			}

			.container > .group {
				margin-bottom: 20px;
			}

			.border-red {
				border-left: 5px solid #e64f4f;
			}

			.border-bl {
				border-left: 5px solid #4d82ff;
			}

			.border-or {
				border-left: 5px solid #f5a63d;
			}

			.border-gr {
				border-left: 5px solid #60c160;
			}

			.background-red {
				color: #e64f4f !important;
				background: rgba(230, 79, 79, 0.25);
			}

			.background-bl {
				color: #4d82ff !important;
				background: rgba(77, 130, 255, 0.25);
			}

			.background-or {
				color: #f5a63d !important;
				background: rgba(245, 166, 61, 0.25);
			}

			.background-gr {
				color: #60c160 !important;
				background: rgba(96, 193, 96, 0.25);
			}

			.group {
				background: #fff;
				font-size: 14px;
				padding: 10px 20px;
				//margin-bottom:20px;
				box-sizing: border-box;
				// box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
				border-radius: 3px;
				@include PositionRelative(null, 100px);
				cursor: pointer;

				&:hover {
					box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
				}

				.avatar-image {
					vertical-align: top;
					@include GlobalAvatar(50px, 50px, 50%);
					margin: 0 10px;
				}

				.name {
					width: 155px;
					display: inline-block;
					@include ExtraNotDisplayed();
					vertical-align: bottom;
					color: #3471ff;
				}

				.node {
					color: coral;
					background: #eee;
					border-radius: 30px;
					padding: 10px 30px;
					margin: 0 20px 0 10px;
				}

				.user {
					width: 200px;
					line-height: 40px;
					padding-left: 20px;

					img {
						@include VertivalAlign(null, top, 40px, 40px);
						border-radius: 50%;
						margin: 0 10px;
					}
				}

				.state {
					width: 350px;

					.info {
						height: 80px;
						padding: 10px 0;
						box-sizing: border-box;
						@include JustityAndFlexWrap(flex, space-between, null, null);
						flex-direction: column;

						& > div {
							@include ExtraNotDisplayed();

							&:last-child {
								color: #91a1b7;
							}
						}
					}
				}

				.brief {
					width: 350px;
					font-size: 12px;

					ul {
						height: 80px;
						padding: 10px 0;
						@include JustityAndFlexWrap(flex, space-between, null, null);
						flex-direction: column;
						color: #91a1b7;

						span {
							color: #000;
						}
					}
				}
			}

			.group-b {
				@include JustityAndFlexWrap(flex, space-between, null, null);
				margin-top: 10px;

				.group-b-title {
					margin-bottom: 5px;
					color: #999;
				}
			}
		}

		.el-tabs__content {
			height: auto;
		}
	}

	.flex {
		display: flex;
		//margin-top: 10px;
		align-items: center;
	}

	.flow-table {
		position: relative;
		justify-content: center;

		.el-icon-arrow-left {
			color: rgb(20, 19, 19) !important;
		}
	}

	.bolder {
		font-weight: bold;
		@include ExtraNotDisplayed();
		width: 200px;
	}

	.el-tabs__nav-wrap {
		bottom: -1px;
	}

	.timeStyle {
		flex: 1;
		text-align: center;
	}

	.wrap-search {
		width: 100%;
		height: 50px;
		background: #fff;
		// z-index: 101;
		line-height: 50px;
		// position: relative;
		// top: -1px;

		.search {
			max-width: 1100px;
			margin: 0 auto;

			.search-font {
				float: left;
			}

			.search-info {
				float: right;

				.info-box {
					display: inline-block;
					cursor: pointer;

					span {
						margin-right: 8px;
					}
				}

				.info-left {
					margin-right: 20px;
				}
				.info-right {
					.right-icon {
						display: inline-block;
						position: relative;
						width: 20px;
						height: 20px;
						margin-right: 0;
						span {
							position: absolute;
							top: 4px;
							color: #ccc;
						}
						.icon-bottom {
							top: 12px;
						}
						.icon-check {
							color: #409eff;
						}
					}
					.right-font {
						display: inline-block;
					}
				}
			}
		}
	}
	.wrap-sort {
		> div {
			text-align: center;
			// margin-bottom: 5px;
			height: 30px;
			cursor: pointer;
		}
		div:last-child {
			// margin-top: 10px;
		}
		div:hover {
			background-color: #ecf5ff;
			color: #66b1ff;
		}
	}

	.sort-popover {
		padding: 6px 0;
		line-height: 30px;
	}
</style>
