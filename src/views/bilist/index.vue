<template>
	<div>
		<m-header class="header">
			<div>
				<div @click="returnHandler">
					<i class="el-icon-arrow-left" style="color: #ccc; font-size: 26px; cursor: pointer"></i>
				</div>
				<div class="m-head" :content="$l('global.rename')" placement="bottom">
					<span class="header-app-name" style="width: 274px">{{ title }}</span>
				</div>
			</div>
		</m-header>
		<div class="bi-list-btns">
			<el-dropdown trigger="click" ref="dropdown">
				<rvue-button class="el-dropdown-link" type="primary">
					<i class="el-icon-plus"></i>
					创建组件
				</rvue-button>
				<el-dropdown-menu slot="dropdown">
					<div class="title">组件</div>
					<div class="modal-charts">
						<div v-for="item in chartsDefaultList" :key="item">
							<div @click="createChartHandler(item)" class="chart">
								<svg-list :type="item" />
								<div class="chart-tip">
									{{ $t(`RC.${item}`) }}
								</div>
							</div>
						</div>

						<!-- 无法添加浮动样式 -->
						<!-- <svg>
							<use class="codrops-3" xlink:href="#icon-table"></use>
						</svg> -->
					</div>
				</el-dropdown-menu>
			</el-dropdown>

			<div class="mode">
				<div @click="changeMode('pc')" :class="mode === 'pc' ? 'mode-active' : ''">
					<svg
						t="1629364878036"
						class="icon"
						viewBox="0 0 1210 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="2167"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						width="22"
						height="22"
					>
						<path
							d="M1092.654545 0H74.752A74.938182 74.938182 0 0 0 0 74.752V701.905455a74.938182 74.938182 0 0 0 74.752 74.752h466.385455v141.032727H348.532364a41.425455 41.425455 0 0 0-41.285819 41.332363 41.425455 41.425455 0 0 0 41.285819 41.285819h468.433454a41.425455 41.425455 0 0 0 41.285818-41.285819 41.425455 41.425455 0 0 0-41.285818-41.332363H623.709091v-141.032727h468.945454a74.938182 74.938182 0 0 0 74.752-74.752V74.752A74.938182 74.938182 0 0 0 1092.654545 0z m-7.819636 82.618182V693.992727H82.618182V82.618182h1002.216727z"
							fill="#707070"
							p-id="2168"
						></path>
					</svg>
				</div>
				<div @click="changeMode('mobile')" :class="mode === 'mobile' ? 'mode-active' : ''">
					<svg
						t="1629364899889"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="3338"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						width="22"
						height="22"
					>
						<path
							d="M767.516999 1023.032976 256.481977 1023.032976c-30.264281 0-54.753021-23.670096-54.753021-52.862975L201.728956 53.831023c0-29.193903 24.488741-52.865022 54.753021-52.865022l511.035022 0c30.264281 0 54.754045 23.671119 54.754045 52.865022l0 916.337955C822.270021 999.36288 797.78128 1023.032976 767.516999 1023.032976zM511.999488 970.168977c20.141736 0 36.503379-15.774265 36.503379-35.237549 0-19.464307-16.361643-35.254945-36.503379-35.254945-20.142759 0-36.500309 15.792685-36.500309 35.254945C475.498156 954.394712 491.857752 970.168977 511.999488 970.168977zM767.516999 106.695021 749.26531 106.695021 274.733667 106.695021 256.481977 106.695021l0 740.117464 18.251689 0L749.26531 846.812485l18.251689 0L767.516999 106.695021z"
							p-id="3339"
							fill="#707070"
						></path>
					</svg>
				</div>
			</div>
			<div>
				<!-- <rvue-button @click="visible = true">仪表盘主题</rvue-button> -->
				<rvue-button @click="visibleTimePush = true">
					{{ $t("bi.timedpush") }}
				</rvue-button>
				<rvue-button
					type="primary"
					@click="
						() => {
							this.handleSave(layout, layoutM);
							this.$message('保存成功');
						}
					"
					>保存</rvue-button
				>
			</div>
		</div>
		<div :class="mode == 'pc' ? 'pc-layout' : 'mobile-layout'">
			<rvue-grid-layout
				@save="handleSave"
				ref="gridLayout"
				modeE="design"
				:title.sync="title"
				:oldLayout.sync="oldLayout"
				:layout.sync="layout"
				:layoutM.sync="layoutM"
				:theme.sync="theme"
				:mode="mode"
			>
			</rvue-grid-layout>
		</div>

		<bi-dialog :visible.sync="visible" @updateTheme="handleSetTheme" :theme.sync="theme" />
		<timed-push-dialog :visible.sync="visibleTimePush"></timed-push-dialog>
	</div>
</template>

<script lang="ts">
	import { Component, Provide, Vue, Watch } from "vue-property-decorator";
	import { createChartList } from "@/components/chartDesign/core/defaultChartsValue";
	import { getChartList, deleteChart, saveChart } from "@/api/bi";
	import { updateFormSingle, getFormSingleTest } from "@/api/form";
	import MHeader from "@/components/m-header/m-header.vue";
	import BiDialog from "./_components/themeSettingsdialog.vue";
	import RvueGridLayout from "@/components/gridLayout/rvueGridLayout.vue";
	import SvgList from "./_components/svgList.vue";
	import { refreshJump } from "@/utils/global";
	import { ChartModule } from "@/store/modules/chart";
	import timedPush from "./_components/timedPush.vue";

	@Component({
		components: {
			MHeader,
			BiDialog,
			RvueGridLayout,
			SvgList,
			"timed-push-dialog": timedPush,
		},
	})
	export default class BiList extends Vue {
		@Provide("echartType")
		echartType: TJson = ["bar", "line", "pie"]; //echarts全部类型
		private layout: TJson = [];
		private layoutM: TJson = []; //手机配置
		private chartsDefaultList = createChartList;
		private visible: Boolean = false;
		private theme: string = "default";
		private mode: string = "pc";
		private title: string = "";
		private visibleTimePush = false;
		private oldLayout: TJson = []; //操作未保存的
		//修改pc的layout顺序需要保证移动的顺序一致 但是高度还是移动的高度
		@Watch("layout", { deep: true })
		monitorLayout(val: any) {
			if (val.length != this.oldLayout?.length) {
				let fullPath = this.$route.path;
				let supPath = fullPath.substr(0, fullPath.lastIndexOf("bi/"));
				refreshJump(fullPath, this, supPath);
			} else {
				return;
			}
		}

		@Watch("layoutM", { deep: true })
		monitorLayoutM(val: any) {
			console.log(val, 1111);
		}
		private mounted() {
			// let fullPath = this.$route.path;
			// let supPath = fullPath.substr(0, fullPath.lastIndexOf("bi/"));
			// let jumpPath=supPath+'appd/'+this.$route.params.appCode+'/p'
			// refreshJump(fullPath, this, supPath);
			window.onbeforeunload = null;
			window.onpopstate = null;
		}
		private destroyed() {
			window.onbeforeunload = null;
			window.onpopstate = null;
		}
		//设置主题--未显示
		private handleSetTheme(theme: string) {
			this.theme = theme;
		}

		private beforeRouteLeave(to: any, from: any, next: any) {
			ChartModule.SET_List([]);
			next();
		}
		//返回判断当前的仪表盘是否被修改
		private returnHandler() {
			let newLayout = this.$utils.deepClone(this.layout);
			// .map((item: any) => {
			// 	delete item.moved;
			// 	return item;
			// });

			let oldLayout = this.$utils.deepClone(this.oldLayout);
			// .map((item: any) => {
			// 	delete item.moved;
			// 	return item;
			// });

			if (JSON.stringify(oldLayout) !== JSON.stringify(newLayout)) {
				this.$confirm((<any>this).$t("global.isSavePDesign"), "", {
					confirmButtonText: (<any>this).$t("global.confirm"),
					cancelButtonText: (<any>this).$t("global.cancel"),
					type: "warning",
				})
					.then(() => {
						this.handleSave(this.layout, this.layoutM);
						setTimeout(() => {
							this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/`);
						}, 100);
					})
					.catch((action) => {
						this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/`);
					});
			} else {
				this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/`);
			}
		}
		//保存请求接口
		private handleSave(list: any, listM: any) {
			//保存后的
			let tempList = this.$utils.deepClone(list);
			let tempListM = this.$utils.deepClone(listM);

			this.oldLayout?.map((item: any) => {
				//新的里面没有老的
				if (
					!["editor"].includes(item.type) &&
					!tempList
						?.map((newItem: any) => {
							return newItem.code;
						})
						.includes(item.code)
				) {
					//请求删除
					deleteChart(this.$route.params.appCode, this.$route.params.formCode, item.code);
				}
			});

			let data = {
				structure: { layout: tempList?.length > 0 ? tempList : [], theme: this?.theme, layoutM: tempListM?.length > 0 ? tempListM : [] },
				appCode: this.$route.params.appCode,
				code: this.$route.params.formCode,
			};

			//报错表单结构为空
			updateFormSingle(this.$route.params.appCode, this.$route.params.formCode, data).then((res: TResponse) => {
				getFormSingleTest(this.$route.params.appCode, this.$route.params.formCode).then((resL: TResponse) => {
					// this.layout = resL.data.structure?.layout;
					this.oldLayout = this.$utils.deepClone(list);
				});
			});
		}

		private changeMode(mode: string) {
			this.mode = mode;
		}
		//创建报表
		private createChartHandler(type: string) {
			let { appCode, tenantId, formCode } = this.$route.params;
			if (type == "editor") {
				(<any>this.$refs).gridLayout.createEditorHandler();
				(<any>this.$refs).dropdown.hide();
			} else {
				this.handleSave(this.layout, this.layoutM);
				this.$router.push(`/${tenantId}/appd/${appCode}/p/bi/${formCode}/chart/${type}/new`);
			}
		}
	}
</script>

<style scoped lang="scss">
	.bi-list {
		overflow-y: auto;
		overflow-x: hidden;
		padding: 10px;
		box-sizing: border-box;

		.group {
			display: inline-block;
			vertical-align: top;
			margin: 0 0px 10px 0;
			cursor: move;
			width: 33.33%;
			height: 400px;
		}
		h5 {
			text-align: center;
		}
		&-btns {
			padding: 20px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 44px;
		}
	}
	.modal-charts {
		width: 300px;
		@include JustityAndFlexWrap(flex, center, null, wrap);
		::v-deep .chart {
			background: transparent;
			cursor: pointer;
			@include GlobalAvatar(70px, 70px, 4px, null);
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin: 10px;
			svg path {
				fill: #a8b1be;
			}
			&:hover {
				background: #e1eaff;
				color: #6087fd;
				svg path {
					fill: #6087fd;
				}
			}
		}

		.btn-box {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			margin-top: 10px;
			margin-right: 10px;
		}
	}
	.el-dropdown {
		color: white;
		@include GlobalAvatar(null, null, 5px, skyblue);
		cursor: pointer;
		height: 34px;
		.el-dropdown-link {
			@include JustityAndFlexWrap(flex, null, center, null);
			padding: 10px;
		}
	}
	::v-deep .mode {
		display: flex;
		cursor: pointer;
		> div {
			padding: 3px 8px;
			@include JustityAndFlexWrap(flex, null, center, null);
			border-radius: 5px;
			svg path {
				fill: #a8b1be;
			}
			&:hover {
				background: #e1eaff;
				svg path {
					fill: #6087fd;
				}
			}
		}
		> div:nth-child(1) {
			margin-right: 10px;
		}
		.mode-active {
			background: #e1eaff;
			svg path {
				fill: #6087fd;
			}
		}
	}
	.mobile-layout {
		@include JustityAndFlexWrap(flex, center, null, null);
	}
	.pc-layout,
	.mobile-layout {
		margin-top: 100px;
	}

	.drap-btns {
		@include JustityAndFlexWrap(flex, flex-end, null, null);
	}
	.chart-tip {
		padding-top: 10px;
		@include JustityAndFlexWrap(flex, center, center, null);
		font-size: 12px;
		color: #666666;
	}

	.bi-list-btns {
		border-top: 1px solid #e1e1e1;
		position: fixed;
		top: 56px;
		width: 100%;
		z-index: 1111;
		background: white;
	}
	.title {
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.m-head {
		display: inline-flex !important;
		align-items: center;
		color: #444444;
		font-weight: 600;
	}
	.header {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1111;
	}

	::v-deep .el-loading-mask {
		background-color: rgba(255, 255, 255, 1) !important;
	}
</style>
