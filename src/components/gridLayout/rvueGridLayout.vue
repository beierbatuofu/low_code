//组件地址https://jbaysolutions.github.io/vue-grid-layout/
<template>
	<div>
		<grid-layout
			v-if="syncLayout.length > 0 && mode === 'pc'"
			:layout.sync="syncLayout"
			:col-num="colNum"
			:row-height="20"
			:is-draggable="!readyOnly && isMove"
			:is-resizable="!readyOnly"
			:is-mirrored="false"
			:vertical-compact="true"
			:use-css-transforms="true"
			:auto-size="true"
			:verticalCompact="false"
			:responsive="false"
			@layout-updated="layoutUpdatedEvent"
			@layout-ready="layoutReadyEvent"
		>
			<grid-item
				@resized="resizedEvent"
				v-for="(item, index) in syncLayout"
				:minH="item.type === 'editor' ? 3 : item.type === 'filter' ? 6 : 8"
				:minW="mode === 'pc' ? getcolNum(item) : colNum"
				:x="item.x"
				:y="item.y"
				:w="mode === 'pc' ? item.w : colNum"
				:h="item.h"
				:i="item.i"
				:key="index"
				@container-resized="containerResizedEvent"
			>
				<BiChart
					:modeE="modeE"
					@save="saveHandler"
					@update="updateHandler"
					:mode="mode"
					:readyOnly="readyOnly"
					:ref="'chart' + item.i"
					@copy="copyHandler"
					@delete="deleteHanlder"
					:item="item"
					:theme="theme"
					@ismove="moveHandler"
					:key="item.code"
				/>
			</grid-item>
		</grid-layout>
		<!-- 手机 -->
		<div class="bg" v-if="mode === 'mobile'">
			<grid-layout
				v-if="syncLayoutM.length > 0"
				:layout.sync="syncLayoutM"
				:col-num="colNum"
				:responsive="false"
				:row-height="20"
				:is-draggable="!readyOnly"
				:is-resizable="!readyOnly"
				:is-mirrored="false"
				:vertical-compact="true"
				:margin="[5, 5]"
				:useStyleCursor="false"
				:useCssTransforms="false"
				@layout-updated="layoutUpdatedEvent"
				@layout-ready="layoutReadyEvent"
			>
				<grid-item
					@resized="resizedEvent"
					v-for="item in syncLayoutM"
					:minH="item.type === 'editor' ? 3 : item.type === 'filter' ? 6 : 10"
					:minW="colNum / 2"
					:x="item.x"
					:y="item.y"
					:w="item.w"
					:h="item.h"
					:i="item.i"
					:key="item.code"
					@container-resized="containerResizedEvent"
				>
					<BiChart
						:modeE="modeE"
						@save="saveHandler"
						@update="updateHandler"
						:mode="mode"
						:readyOnly="readyOnly"
						:ref="'chart' + item.i"
						@copy="copyHandler"
						@delete="deleteHanlder"
						:item="item"
						:theme="theme"
						@ismove="moveHandler"
						:key="item.code"
					/>
				</grid-item>
			</grid-layout>
		</div>
		<BiEmpty v-if="showEmpty && syncLayout.length == 0 && $route.name == 'BiDashboard'"></BiEmpty>

		<div style="height: 200px; background: #eee"></div>
	</div>
</template>

<script lang="ts">
	import { Component, PropSync, Vue, Prop, Inject, Watch } from "vue-property-decorator";
	import { deleteChart, saveChart, getChartStr } from "@/api/bi";
	import { updateFormSingle, getFormSingle, getFormSingleTest } from "@/api/form";
	import { FormModule } from "@/store/modules/form";
	import { guid } from "@/utils/global";
	import BiChart from "./biChart.vue";
	import BiEmpty from "./biEmpty1.vue";
	import VueGridLayout from "vue-grid-layout";
	import { ChartModule } from "@/store/modules/chart";
	import { FilterListItem, ReportListItem, Rules } from "@/components/chartComps/_filterComponent/_configComponent/_type";

	@Component({
		components: {
			GridLayout: VueGridLayout.GridLayout,
			GridItem: VueGridLayout.GridItem,
			BiChart,
			BiEmpty,
		},
	})
	export default class RvueGridLayout extends Vue {
		@Inject({ default: () => ["bar", "line", "pie"] }) echartType!: any;
		@PropSync("layout", { default: () => [], type: Array }) syncLayout!: any;
		@PropSync("layoutM", { default: () => [], type: Array }) syncLayoutM!: any;
		@PropSync("oldLayout", { default: () => [], type: Array }) syncOldLayout!: any;
		@PropSync("title", { default: "", type: String }) syncTitle!: any;
		@PropSync("theme", { type: String, default: "eduardo" }) themeSync!: String;
		@Prop({ type: String, default: "pc" }) mode!: string;
		@Prop({ type: Boolean, default: false }) readyOnly!: boolean;
		@Prop({ type: String, default: "view" }) modeE!: string; //访问还是编辑

		private layoutMap: TJson = [];
		private layoutMMap: TJson = [];
		private colNum: number = 12;
		private showEmpty: boolean = false;
		private isMove: boolean = false;
		get filterList() {
			return ChartModule.filterList;
		}

		//复制==新建一个
		private copyHandler(dataQuery: TJson, item: TJson) {
			let newDataQuery = this.$utils.deepClone(dataQuery);
			let oldUid = dataQuery.config.uid;
			delete newDataQuery.code;
			newDataQuery.config.uid = guid();
			var reg = new RegExp("" + oldUid + "");
			newDataQuery.type == "raw_data" && (newDataQuery.config.codeJ = newDataQuery.config.codeJ.replace(reg, newDataQuery.config.uid));

			if (item.type !== "editor") {
				saveChart(this.$route.params.appCode, this.$route.params.formCode, newDataQuery).then((res: TResponse) => {
					let newItem = this.$utils.deepClone(item);
					delete newItem.x;
					delete newItem.y;
					let layoutItem = this.addItem(
						item.w,
						item.h,
						{
							...newItem,
							type: dataQuery.type,
							code: res.data.code,
							i: res.data.code,
							title: res.data.title,
						},
						"pc"
					);
					let layoutItemM = this.addItem(
						12,
						item.h,
						{
							...newItem,
							w: 12,
							type: dataQuery.type,
							code: res.data.code,
							i: res.data.code,
							title: res.data.title,
						},
						"m"
					);

					this.syncLayout.push(layoutItem);

					this.syncLayoutM.push({ ...layoutItemM });
				});
			} else {
				let id = new Date().getTime();
				let layoutItem = this.addItem(
					item.w,
					item.h,
					{
						type: item.type,
						code: id,
						w: item.w,
						h: item.h,
						i: id,
						html: item.html,
						title: {
							zh: "富文本",
							en: "editor",
						},
					},
					"pc"
				);
				let layoutItemM = this.addItem(
					12,
					item.h,
					{
						type: item.type,
						code: id,
						w: 12,
						h: item.h,
						i: id,
						html: item.html,
						title: {
							zh: "富文本",
							en: "editor",
						},
					},
					"m"
				);

				this.syncLayout.push(layoutItem);

				this.syncLayoutM.push(layoutItemM);
			}
			this.layoutMap = this.genereatePlaneArr(this.syncLayout);
			this.layoutMMap = this.genereatePlaneArr(this.syncLayoutM);
		}
		private deleteHanlder(chart: TJson) {
			let tempList = (<any>this).syncLayout.filter((item: any) => item.i !== chart.i);
			let tempListM = (<any>this).syncLayoutM.filter((item: any) => item.i !== chart.i);
			(<any>this).syncLayout = tempList;
			(<any>this).syncLayoutM = tempListM;
			this.layoutMap = this.genereatePlaneArr(tempList);
			this.layoutMMap = this.genereatePlaneArr(tempListM);
		}
		//item改变大小触发
		private resizedEvent(i: string, newH: number, newW: number, newHPx: number, newWPx: number) {
			(<any>this).$refs["chart" + i][0].resize(newWPx - 20, newHPx);
			(<any>this).$refs["chart" + i][0].getMinflag(newWPx, newHPx, newW);
		}
		//container改变大小触发
		private containerResizedEvent(i: string, newH: number, newW: number, newHPx: number, newWPx: number) {
			(<any>this).$refs["chart" + i][0].resize(newWPx, newHPx);
		}
		//更新回调

		private updateHandler(n: string, code: string) {
			this.syncLayout.map((item: TJson) => {
				if (item.code === code) {
					item.html = n;
				}
			});
			this.syncLayoutM.map((item: TJson) => {
				if (item.code === code) {
					item.html = n;
				}
			});
		}
		// 区域检测 x,y 二维数据地图起始坐标点  w,h 检测区域宽高
		private regionalTest(x: any, y: any, w: any, h: any, m: string) {
			// 定义返回 x,y 偏移 及 是否有空位置
			let offsetX = 0,
				offsetY = 0,
				res = true;
			// 按区域循环检测 二维数组地图
			for (let r = 0; r < w; r++) {
				for (let c = 0; c <= h; c++) {
					let point;
					if (m == "pc") {
						point = this.layoutMap[y + r] ? this.layoutMap[y + r][x + c] : 0;
					} else {
						point = this.layoutMMap[y + r] ? this.layoutMMap[y + r][x + c] : 0;
					}

					// 如该点被占据 记录偏移值
					if (point === 1) {
						res = false;
						offsetX = offsetX > x + c ? offsetX : x + c;
						offsetY = offsetY > y + r ? offsetY : y + r;
					}
				}
			}

			return {
				result: res,
				offsetX: offsetX,
				x: x,
				y: y,
			};
		}

		// 生成二维数组地图
		private genereatePlaneArr(data: any) {
			var map = [];
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					var one = data[i];
					// 循环行
					for (var r = one.y; r < one.y + one.h; r++) {
						// 循环列
						for (var c = one.x; c < one.x + one.w; c++) {
							// 检修当前行是否存在
							if (!map[r]) {
								map[r] = new Array(this.colNum);

								for (let i = 0; i < this.colNum; i++) {
									map[r][i] = 0;
								}
							}
							// 占据为1
							map[r][c] = 1;
						}
					}
				}
			}
			return map;
		}

		private addItem(w: number, h: number, data: TJson, m: string) {
			var itemW = w;
			var itemH = h;
			var addItem = {
				x: 0,
				y: 0,
				w: itemW,
				h: itemH,
				...data,
			};
			let len = m == "pc" ? this.layoutMap.length : this.layoutMMap.length;
			if (len) {
				for (let r = 0, rLen = len; r < rLen; r++) {
					for (let c = 0; c <= this.colNum - itemW; c++) {
						let res = this.regionalTest(c, r, itemW, rLen > r + itemH ? itemH : rLen - r, m);
						if (res.result) {
							// 更新添加数据内容
							addItem = {
								x: res.x,
								y: res.y,
								w: itemW,
								h: itemH,
								...data,
							};

							c = this.colNum + 1;
							r = rLen + 1;
						} else {
							c = res.offsetX;
						}
					}
				}
			}
			// 更新二维数组地图
			for (let itemR = 0; itemR < itemH; itemR++) {
				for (let itemC = 0; itemC < itemW; itemC++) {
					if (m == "pc") {
						// 如果没有该行，初始化
						if (!this.layoutMap[addItem.y + itemR]) {
							this.layoutMap[addItem.y + itemR] = new Array(this.colNum);
							for (let i = 0; i < this.colNum; i++) {
								this.layoutMap[addItem.y + itemR][i] = 0;
							}
						}
						// 标记点
						this.layoutMap[addItem.y + itemR][addItem.x + itemC] = 1;
					} else {
						// 如果没有该行，初始化
						if (!this.layoutMMap[addItem.y + itemR]) {
							this.layoutMMap[addItem.y + itemR] = new Array(this.colNum);
							for (let i = 0; i < this.colNum; i++) {
								this.layoutMMap[addItem.y + itemR][i] = 0;
							}
						}
						// 标记点
						this.layoutMMap[addItem.y + itemR][addItem.x + itemC] = 1;
					}
				}
			}

			// 添加数据
			console.log(addItem.x, m);
			return addItem;
		}

		layoutReadyEvent(newLayout: any) {
			console.log("走着了");
			this.layoutMap = this.genereatePlaneArr(this.syncLayout);
			this.layoutMMap = this.genereatePlaneArr(this.syncLayoutM);
		}
		layoutUpdatedEvent(newLayout: any) {
			this.layoutMap = this.genereatePlaneArr(this.syncLayout);
			this.layoutMMap = this.genereatePlaneArr(this.syncLayoutM);
		}

		private saveHandler() {
			let tempList = this.$utils.deepClone(this.syncLayout);
			let tempListM = this.$utils.deepClone(this.syncLayoutM);
			this.$emit("save", tempList, tempListM);
		}
		//富文本创建
		private createEditorHandler() {
			let id = new Date().getTime().toString();
			let layoutItem = this.addItem(
				3,
				8,
				{
					type: "editor",
					code: id,
					i: id,
					html: "<h2>I am Example</h2>",
					title: {
						zh: "富文本",
						en: "editor",
					},
				},
				"pc"
			);
			let layoutItemM = this.addItem(
				12,
				8,
				{
					type: "editor",
					code: id,
					i: id,
					html: "<h2>I am Example</h2>",
					title: {
						zh: "富文本",
						en: "editor",
					},
				},
				"m"
			);
			this.syncLayout.push(layoutItem);
			this.syncLayoutM.push({ ...layoutItemM, w: 12 });
		}

		private moveHandler(b: boolean) {
			this.isMove = b;
		}
		//最小宽度
		private getcolNum(item: any) {
			if (item.type === "table") {
				return this.colNum / 2;
			} else if (item.type === "filter") {
				return 4;
			} else {
				return 3;
			}
		}
		//给报表请求接口合成dashboardFilters 然后请求
		private addfilterItem(filterItem: any, filterId: string) {
			let context = filterItem.filterForm[Object.keys(filterItem.filterForm)[0]];
			let newFilterList: FilterListItem[] = this.filterList.map((item: FilterListItem) => {
				//修改匹配规则
				if (
					item.matchRules.find((rule: Rules) => {
						return rule.id == filterId;
					})
				) {
					let matchRules = item.matchRules.map((ruleItem: Rules) => {
						if (ruleItem.id == filterId) {
							let rule: Rules = {
								dataType: 0,
								judgeValues: Array.isArray(context) ? context : [context],
								method: filterItem.selectDefaultMethod,
								targetFieldCode: ruleItem.targetFieldCode,
								type: filterItem.fieldType,
								id: filterId,
								sourceCode: ruleItem.sourceCode,
							};
							//赋值父id
							filterItem.checkedReports.map((cItem: any) => {
								if (ruleItem.targetFieldCode == cItem.selectField) {
									if (cItem.parentFieldId) {
										rule.parentSubFormTargetFieldCode = cItem.parentFieldId;
									}
								}
							});

							return rule;
						} else {
							return ruleItem;
						}
					});

					return {
						...item,
						matchRules,
					};
				} else {
					return item;
				}
			});
			//新建匹配规则
			let formCodeList = newFilterList.map((item: FilterListItem) => {
				return item.formCode;
			});

			filterItem.checkedReports.map((item: ReportListItem) => {
				//报表code不存在的情况
				if (!formCodeList.includes(item.reportCode)) {
					let rule: Rules = {
						dataType: 0,
						judgeValues: Array.isArray(context) ? context : [context],
						method: filterItem.selectDefaultMethod,
						targetFieldCode: item.selectField,
						type: filterItem.fieldType,
						id: filterId,
						sourceCode: item.sourceCode,
					};
					//赋值父id
					filterItem.checkedReports.map((cItem: any) => {
						if (item.selectField == cItem.selectField) {
							if (cItem.parentFieldId) {
								rule.parentSubFormTargetFieldCode = cItem.parentFieldId;
							}
						}
					});
					newFilterList.push({
						formCode: item.reportCode,
						matchRules: [rule],
					});
				}
				//同报表添加匹配规则--多个筛选器选同个报表
				newFilterList.map((itemFilter: FilterListItem) => {
					//同一个报表的
					if (itemFilter.formCode == item.reportCode) {
						let filterIdList = itemFilter.matchRules.map((rules: Rules) => {
							return rules.id;
						});
						//matchrules没有筛选器id就添加
						if (!filterIdList.includes(filterId)) {
							let rule: Rules = {
								dataType: 0,
								judgeValues: Array.isArray(context) ? context : [context],
								method: filterItem.selectDefaultMethod,
								targetFieldCode: item.selectField,
								type: filterItem.fieldType,
								id: filterId,
								sourceCode: item.sourceCode,
							};
							//赋值父id
							filterItem.checkedReports.map((cItem: any) => {
								if (item.selectField == cItem.selectField) {
									if (cItem.parentFieldId) {
										rule.parentSubFormTargetFieldCode = cItem.parentFieldId;
									}
								}
							});

							itemFilter.matchRules.push(rule);
						}
					}
				});
			});

			ChartModule.SET_List(newFilterList); // 请求筛选
		}

		@Watch("mode")
		onChangeMode(n: string) {
			this.layoutMap = this.genereatePlaneArr(this.syncLayout);
			this.layoutMMap = this.genereatePlaneArr(this.syncLayoutM);
		}
		//请求仪表盘结构
		protected created() {
			FormModule.queryFormsTree(this.$route.params.appCode);
			//请求排序和主题结构
			if (this.$route.name === "BiDashboard") {
				getFormSingleTest(this.$route.params.appCode, this.$route.params.formCode).then((resL: TResponse) => {
					this.themeSync = resL.data.structure?.theme;
					this.syncLayout = resL.data.structure?.layout ? resL.data.structure?.layout : [];
					//先走一遍把筛选器弄好
					console.log(resL.data.structure, "esL.data.structure");
					resL.data.structure?.layout.map((item: any, index: number) => {
						if (item.type == "filter") {
							getChartStr(this.$route.params.appCode, this.$route.params.formCode, item.code).then((res: TResponse) => {
								this.addfilterItem(res.data.config, res.data.code);
							});
						}
					});

					this.syncLayoutM = resL.data.structure?.layoutM ? resL.data.structure?.layoutM : [];

					this.syncOldLayout = this.$utils.deepClone(resL.data.structure?.layout);
					this.syncTitle = resL.data.name;
					this.showEmpty = true;
				});
			} else {
				getFormSingle(this.$route.params.appCode, this.$route.params.formCode).then((resL: TResponse) => {
					this.themeSync = resL.data.structure?.theme;
					this.syncLayout = resL.data.structure?.layout;
					// this.syncLayoutM = this.$utils.deepClone(resL.data.structure?.layoutM);
					// console.log(this.syncLayoutM, "this.syncLayoutM");
					this.syncOldLayout = this.$utils.deepClone(resL.data.structure?.layout);
					this.syncTitle = resL.data.name;
					this.showEmpty = true;
				});
			}
			this.modeE == "design" && (this.isMove = true);
		}
	}
</script>
<style lang="scss" scoped>
	.flex {
		@include JustityAndFlexWrap(flex, center, center, null);
	}
	.vue-grid-item {
		background: white;
		transition: none;
		// overflow: hidden;
		border-radius: 4px;
		box-shadow: #d1d1d1 2px 2px 4px;
	}
	.vue-grid-layout {
		background: #eee;
	}

	.pointer {
		cursor: pointer;
	}
	::v-deep.bg {
		background: #eee;
		min-width: 400px;
		overflow: hidden;
		max-width: 500px;
	}
	@media (max-width: 600px) {
		.bg {
			background: #eee;
			min-width: auto;
			padding: 0;
		}
	}
</style>
