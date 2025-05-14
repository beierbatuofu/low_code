<template>
	<div class="data-preview">
		<div v-if="displayTable" class="displayTable">
			<el-table :data="tableData" border stripe max-height="90%" :header-cell-style="{ background: '#f0f9eb', fontSize: '14px', boxSizing: 'border-box' }">
				<el-table-column v-for="(item, index) in tableTitle" :key="index" :prop="item.fieldId" :label="item | getLang" align="center">
					<template v-slot:default="scope">
						<div v-if="filterArray(scope.row[item.fieldId])">
							<span v-for="(item, index) in JSON.parse(scope.row[item.fieldId])" :key="index">
								{{ item.name ? item.name : item }}
							</span>
						</div>
						<div v-else>{{ scope.row[item.fieldId] | processStatus  | filAddress(scope.row[item.fieldId])}}</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:style="{ display: this.total > 5 ? 'block' : 'none' }"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[5, 10, 30, 50]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				class="pagination"
			>
			</el-pagination>
		</div>
		<div v-else class="no-elements">请重新配置sql</div>
	</div>
</template>

<script lang="tsx">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive } from "vue-property-decorator";
	import sqlTable from "../../_components/sql/sqlTable.vue";
	import { runSql } from "@/api/dataset.ts";
	@Component({
		components: {
			sqlTable,
		},
		filters: {
			processStatus: (val: any) => {
				switch (val) {
					case 1:
						return "进行中";
					case 9:
						return "流转完成";
					case 8:
						return "强制结束";
					default:
						return val;
				}
			},
      filAddress:(val: any, type: string)=>{
        try{  
           let address = JSON.parse(type);
           
          if (address && address.hasOwnProperty("city")) {
            return address.province + address.district + address.city + address.detail;
          }else{
            return val;
          }
        }catch(e){
          return val;
        }
      }
		},
	})
	export default class dataPreview extends Vue {
		@Prop({ type: Object, default: () => {} }) basicConfig!: any;

		private tableTitle: any = [];

		private tableData: any[] = [];

		private total: number = 0;
		private pageSize: number = 10;
		private currentPage: number = 1;
		private parmas: any = {};
		private displayTable: boolean = false;

		@Watch("basicConfig", {
			deep: true,
		})
		basicConfigChange(n: any) {
			this.tableTitle = n.structure || [];
			if (!n.datasetSql) {
				this.displayTable = false;
				return;
			}
			this.parmas = {
				datasetCode: n.datasetCode,
				appCode: n.appCode,
				type: n.type,
				correspond: n.correspond,
				datasetSql: n.datasetSql,
				displaySql: n.displaySql,
			};
			this.pageSize = 10;
			this.total = 0;
			this.tableData = [];
      this.currentPage = 1;
			this.getTableData(this.parmas, this.pageSize, this.currentPage);
		}

		private async getTableData(parmas: any, page: number = 5, currentPage: number = 1) {
			this.displayTable = true;
			let { data } = await runSql(parmas, page, currentPage);
			this.tableData = [];
			data.datasetData?.forEach((item: any) => {
				let obj: any = {};
				for (const key in item) {
					obj = {
						...obj,
						...item[key],
					};
				}
				this.tableData.push(obj);
			});

			this.total = +data.total;
		}
		private filterArray(val: any) {
			try {
				if (Array.isArray(JSON.parse(val))) {
					return true;
				} else {
					return false;
				}
			} catch (err) {
				return false;
			}
		}

		private handleSizeChange(val: any) {
			this.pageSize = val;
			this.currentPage = 1;
			this.getTableData(this.parmas, this.pageSize, this.currentPage);
		}
		private handleCurrentChange(val: any) {
			this.currentPage = val;
			this.getTableData(this.parmas, this.pageSize, this.currentPage);
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.el-table::before {
			display: none;
		}
	}
	.pagination {
		margin-top: 20px;
	}
	.data-preview {
		flex: 1;
		// height: 80vh;
		background-color: white;
		overflow: hidden;
		.displayTable {
			height: 100%;
		}
	}

	.no-elements {
		width: 100%;
		color: black;
		line-height: 400px;
		text-align: center;
		color: #9ea6b2;
	}
	.el-pagination {
		text-align: center;
	}

	::v-deep.el-table {
		overflow: auto;
		position: inherit;
		.el-table__row {
			td {
				.cell {
					min-height: 23px;
					div {
						text-overflow: ellipsis !important;
						white-space: nowrap !important;
						overflow: hidden;
					}
				}
			}
		}
	}
</style>
