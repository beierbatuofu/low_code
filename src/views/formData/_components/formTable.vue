<template>
	<div class="form-table">
		<!-- <rvue-button size="mini" :debounce="false" class="full-date" :icon="toggle == 1 ? 'el-icon-date' : 'el-icon-document'" plain @click="handleToggle"></rvue-button> -->
		<el-table
			v-if="toggle == 1"
			@selection-change="handleSelectionChange"
			border
			stripe
			highlight-current-row
			:data="data"
			fit
			max-height="410"
			@row-click="openDetails"
			@sort-change="handleSortChange"
		>
			<template v-if="tableList">
				<el-table-column type="selection"> </el-table-column>
				<el-table-column
					v-for="(col, index) in tableList.tableHeader"
					:key="index"
					align="center"
					class-name="form-data-cell"
					min-width="120"
					:sortable="filterList.indexOf(col.type) > -1 ? 'custom' : false"
					:label="col | getLang"
					:prop="col.fieldId"
					:show-overflow-tooltip="col.type !== 'uploadFile'"
					:resizable="resizableT"
				>
					<template slot="header">
						<span class="column-cell">
							<span :title="col | getLang">{{ col | getLang }}</span>
						</span>
					</template>
					<template slot-scope="scope">
						<div class="column-cell" v-if="!Array.isArray(scope.row[col.fieldId])">
							<!-- 提交人 -->
							<span v-if="(col.fieldId == 'creater' || col.fieldId == 'updater') && scope.row[col.fieldId]">
								{{ scope.row[col.fieldId]["name"] || "" }}
							</span>
							<!-- 流程状态 -->
							<span v-else-if="col.fieldId == 'process_status' && scope.row[col.fieldId] != null">
								{{ process_status[scope.row[col.fieldId]] }}
							</span>
							<!-- 数字 -->
							<span v-else-if="col.type == 'number' && scope.row[col.fieldId] != null">
								{{ (+scope.row[col.fieldId]).toFixed(col.numFormat.decimalDigitsNum) }}
							</span>
							<!-- 时间 -->
							<span v-else-if="col.type == 'datetime' && scope.row[col.fieldId] != null">
								{{ scope.row[col.fieldId].substr(0, col.dateFormat.length) }}
							</span>
							<!-- 地址 -->
							<span v-else-if="col.type == 'address' && scope.row[col.fieldId] != null"> {{ addressToString(scope.row[col.fieldId]) }}</span>
							<!-- 子表格 -->
							<span v-else-if="col.type == 'table'"> 点击查看详情 </span>
							<span v-else>{{ scope.row[col.fieldId] }}</span>
						</div>
						<div class="column-cell" v-else>
							<!-- 附件 -->
							<span class="upload-box" v-if="col.type == 'uploadFile'">
								<rvue-tooltip placement="top" v-for="item of scope.row[col.fieldId]" :key="item.objectName" :content="item.name">
									<span class="fileLogo">
										{{ item.name.split(".").reverse()[0] }}
									</span>
								</rvue-tooltip>
							</span>
							<span v-else v-for="(item, index) of scope.row[col.fieldId]" :key="index">
								{{ item.name || item }}
							</span>
						</div>
					</template>
				</el-table-column>
			</template>
		</el-table>

		<!-- <rvue-fulldate :configlist="configlist" :data="data" v-if="toggle == 2"></rvue-fulldate> -->

		<div class="flex flow-table" v-if="page.total > 5">
			<!-- <el-button type="button" @click="handleCurrentChange(1)">{{ $t("flow.start") }}</el-button> -->
			<el-pagination
				background
				:current-page="page.currentPage"
				:layout="bMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
				:style="bMobile ? '' : 'margin-top:20px;'"
				:total="page.total"
				:page-size="page.pageSize"
				:page-sizes="page.pageSizes"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:pager-count="pageNumber"
				@prev-click="handleCurrentChange(1)"
				@next-click="handleCurrentChange(Math.ceil(page.total / page.pageSize))"
				ref="pagination"
			>
			</el-pagination>
			<!-- <el-button type="button" @click="handleCurrentChange(Math.ceil(page.total /page.pageSize))">{{ $t("flow.end") }}</el-button> -->
		</div>
		<el-empty v-if="!tableList">暂无数据</el-empty>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Inject } from "vue-property-decorator";
	import FullDate from "./fulldate";

	@Component({
		components: {
			"rvue-fulldate": FullDate,
		},
	})
	export default class FormTable extends Vue {
		@Prop({ type: Object, default: () => {} }) tableList!: any;
		@Prop({ type: Array, default: () => [] }) data!: TJson[];
		@Prop({ type: Object, default: () => {} }) page: any;

		private resizableT = true;
		private showTooltip = true;
		private pageNumber = 5;
		private process_status = {
			1: this.$t("flow.doing"),
			9: this.$t("flow.flowSuccess"),
			8: this.$t("flow.stopFlow"),
		};

		// 可排序的字段
		private filterList = ["input", "number", "datetime", "select", "radio", "creater", "create_time", "update_time", "process_status", "userRadio", "deptRadio"];
		private bMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
		private openDetails(row: any) {
			this.$emit("open", row);
		}

		private addressToString(str: string) {
			try {
				let { city, detail, district, province } = JSON.parse(str);

				return `${province}${city}${district}${detail}`;
			} catch (err) {
				return "";
			}
		}

		// pageSize改变
		private handleSizeChange(val: any) {
			this.$emit("change", this.page.currentPage, val);
		}
		//currentPage改变
		private handleCurrentChange(val: any) {
			this.$emit("change", val, this.page.pageSize);
		}

		private handleSortChange({ prop, order }: any) {
			console.log(prop, order, "3413123");
			this.$emit("sort", prop, order);
		}

		private handleSelectionChange(selects: Record<string, any>[]) {
			this.$emit("selectChange", selects);
		}

		private toggle = 1;

		private handleToggle() {
			this.toggle = this.toggle == 1 ? 2 : 1;
		}
	}
</script>
<style lang="scss">
	.el-tooltip__popper {
		max-width: 220px;
		min-width: 100px;
	}
</style>
<style lang="scss" scoped>
	::v-deep {
		.caret-wrapper {
			flex-direction: row;
		}
		.el-table .sort-caret {
			position: relative;
			top: 0;
			border: none;
			cursor: pointer;
		}

		%sortIcon {
			width: 3px;
			height: 10px;
			background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAxCAYAAADTAynyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPBJREFUeNpiXLlyJQMRgBWI5wOxJ5r4FBYiNS8C4ggscilMBDSDLFiIQzMIcDERsHkxEEfiUfOPhYDmcEL+Y6JEMzYDSNKMbgDJmpENYCFHM8wAdiI0XwXiT7gM6MUTzyCwH4gDgfgnroQSg0fzAajm/1CXYnUBMx6bA4D4IxBzQw3BasBlPM7+COX/xxeISUB8FIj/Qv25Ck0zwcxyA4htgVgHasAtUqKRBcmJlxnIAEwMFIJRA0YNGDVg1IBRA0YNGKEGMOJQy0SsAd+A+BcW8R/EGgBqbKzGIr6ShQTvlgDxHyD2h7Yn1gJxNUCAAQDXaS9dorGz3QAAAABJRU5ErkJggg==")
				no-repeat;
			background-size: cover;
			top: 0;
			position: relative;
			left: 0;

			margin-left: 3px;
		}
		.el-table .caret-wrapper .ascending {
			@extend %sortIcon;
		}

		.ascending .caret-wrapper .ascending {
			background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAxCAYAAADTAynyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOFJREFUeNpi9C7ZyUACqATiHCD+D8RTgbidhQTNC4A4HonfBsQsTGRqhruIGAPm49AMAsyEDJgNxAl45H8yEdCcQsh5uAJxDhAnExM4TJRoxmYASZrRDSBZM7IBhDRfB+KHuAyoI6B5BxAbA/EvXLFQg0fzFSD2hLLlcbmAFY9mMyhbEJcLQAZsx6P5O5T/D18gRgHxHiSxbWiaCabED0DsCsRa0Hx+nZRoRE7K1xjIAEwMFIJRA0YNGDVg1IBRA0YNGKEGgNRxYBFnJ9aAr0D8F4v4P2IN+AVt3qODdoAAAwAwyijmf1suGwAAAABJRU5ErkJggg==")
				no-repeat;
			background-size: cover;
		}

		.el-table .caret-wrapper .descending {
			@extend %sortIcon;
			transform: rotate(180deg);
		}
		.descending .caret-wrapper .descending {
			background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAxCAYAAADTAynyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOFJREFUeNpi9C7ZyUACqATiHCD+D8RTgbidhQTNC4A4HonfBsQsTGRqhruIGAPm49AMAsyEDJgNxAl45H8yEdCcQsh5uAJxDhAnExM4TJRoxmYASZrRDSBZM7IBhDRfB+KHuAyoI6B5BxAbA/EvXLFQg0fzFSD2hLLlcbmAFY9mMyhbEJcLQAZsx6P5O5T/D18gRgHxHiSxbWiaCabED0DsCsRa0Hx+nZRoRE7K1xjIAEwMFIJRA0YNGDVg1IBRA0YNGKEGgNRxYBFnJ9aAr0D8F4v4P2IN+AVt3qODdoAAAwAwyijmf1suGwAAAABJRU5ErkJggg==")
				no-repeat;
			background-size: cover;
		}
	}
	.flex {
		display: flex;
		align-items: center;
		margin-top: 5px;
	}
	.flow-table {
		position: relative;
		justify-content: center;
		.el-icon-arrow-left {
			color: rgb(20, 19, 19) !important;
		}
	}
	.el-table--border {
		border-radius: 2px;
	}
	// @media screen and (max-width: 768px) {
	// 	.el-pagination {
	// 		display: contents;
	// 		::v-deep.el-pagination__total {
	// 			margin-left: 23%;
	// 			margin-right: 9%;
	// 		}
	// 		::v-deep.el-pagination__sizes {
	// 			margin-right: 20%;
	// 		}
	// 		::v-deep.btn-prev {
	// 			padding-top: 30px;
	// 		}
	// 		::v-deep.el-pager {
	// 			padding-top: 20px;
	// 		}
	// 		::v-deep.btn-next {
	// 			padding-top: 30px;
	// 		}
	// 	}
	// }

	.paginationStyle {
		text-align: center;
		margin-bottom: 20px;
		margin-top: 15px;
	}
	.form-table {
		position: relative;
		flex: 1;
		margin: 0 5px;
		padding-bottom: 52px;
		background-color: #fff;
		padding: 0 10px;
		border: #e5e5e5;
	}
	.column-cell,
	.el-table th > .cell {
		@include ExtraNotDisplayed();
	}
	.upload-box .fileLogo {
		margin-right: 4px;
		display: inline-block;
		width: 30px;
		height: 30px;
		text-align: center;
		color: #fff;
		line-height: 30px;
		font-size: 12px;
		font-weight: 600;
		background: url(data:image/png;base64,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);
		background-size: 30px 30px;
	}
	::v-deep .el-table th {
		padding: 2px 0;
		background: #f4f4f4;
	}
	::v-deep .el-table td {
		padding: 3px 0;
	}
	::v-deep .el-table {
		font-size: 12px;
	}
	::v-deep .el-table .cell {
		line-height: 30px;
		min-width: 40px;
	}
	::v-deep .el-table thead .cell {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}
	.full-date {
		position: absolute;
		right: 0px;
		top: -30px;
		padding: 3px !important;
		border-color: $color;
		background: $color;
		color: #fff;
	}
	.form-table {
		position: relative;
	}
</style>
