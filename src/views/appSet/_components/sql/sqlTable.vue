<template>
	<div class="sql-table">
		<el-table :data="tableData" border stripe>
			<el-table-column v-for="item in tableTitle" :key="item.fieldId" :prop="item.fieldId" :render-header="(h, obj) => renderHeader(h, obj, item)" :label="item | getLang" align="center">
				<template v-slot:default="scope">
					<div v-if="filterArray(scope.row[item.fieldId])">
						<span v-for="(item, index) in JSON.parse(scope.row[item.fieldId])" :key="index">
							{{ item.name ? item.name : item }}
						</span>
					</div>
					<div v-else>{{ scope.row[item.fieldId] | processStatus(item.type) }}</div>
				</template>
			</el-table-column>
		</el-table>

		<rvue-dialog :visible.sync="dialogVisible" :append-to-body="true">
			<div slot="title" class="dialog-title">
				<div class="dialog-title-line"></div>
				<div class="dialog-title-font">{{ $l("appset.propSetting") }}</div>
			</div>
			<div class="dialog-content">
				<!-- <div class="propItem">
					<rvue-label :label="$t('appset.originType')" />
					<div class="defaultProp">{{ $t(`Rfield.${originType}`) }}</div>
				</div> -->
				<div class="propItem">
					<rvue-label :label="$t('appset.fieldType')" />
					<rvue-select v-model="fieldType" style="width: 217px; display: inline-block; vertical-align: middle">
						<rvue-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></rvue-option>
					</rvue-select>
				</div>
				<div class="propItem">
					<rvue-label :label="$t('appset.originName')" />
					<div class="defaultProp">{{ originName }}</div>
				</div>
				<div class="propItem">
					<rvue-label :label="$t('appset.fieldName')" />
					<rvue-input v-model="fieldName" style="width: 217px; display: inline-block"></rvue-input>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="modifyProp">{{ $t("crud.filter.submitBtn") }}</el-button>
			</div>
		</rvue-dialog>
	</div>
</template>

<script lang="tsx">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive } from "vue-property-decorator";

	@Component({
		filters: {
			processStatus: (val: any, type: string) => {
				if (type != "process_status") return val;
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
		},
	})
	export default class sqlTable extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) params!: any;

		private dialogVisible = false;
		private tableTitle: any = [];
		private allKeys: any = {};
		private tableData: any[] = [];

		private originType = "1623057706432_91012";
		private fieldType = "";
		private originName = "";
		private fieldName = "";
		private fieldId = "";
		private typeOptions: any = [
			{
				label: "单行文本",
				value: "input",
			},
			{
				label: "多行文本",
				value: "textarea",
			},
			{
				label: "数字",
				value: "number",
			},
			{
				label: "日期时间",
				value: "datetime",
			},
			{
				label: "成员单选",
				value: "userRadio",
			},
			{
				label: "成员多选",
				value: "user",
			},
			{
				label: "部门单选",
				value: "deptRadio",
			},
			{
				label: "部门多选",
				value: "dept",
			},
			{
				label: "下拉单选框",
				value: "select",
			},
			{
				label: "单选按钮组",
				value: "radio",
			},
			{
				label: "下拉复选框",
				value: "selectMulti",
			},
			{
				label: "复选按钮组",
				value: "checkbox",
			},
      {
				label: "提交人",
				value: "creater",
			},
		];

		// @Watch("params", {
		// 	immediate: true, 
		// 	deep: true,
		// })
		// paramsChange(val: any) {
    //   console.log(val,44444);
		// 	let fieldKey = this.$utils.deepClone(val.correspond);
		// 	let strKey: Record<string, any>[] | undefined | null = this.$utils.deepClone(val.structure);
		// 	let test: any = {};

		// 	for (const key in fieldKey) {
		// 		try {
		// 			let keys: any = key;
		// 			if (key.indexOf("data_") == -1 || key.indexOf("sub_") == -1) {
		// 				keys = key;
		// 				keys && (test[keys] = fieldKey[key]);
		// 				test[keys].oldTitle = fieldKey[key].title;
		// 				test[keys].oldType = fieldKey[key].type;
		// 				if (strKey) {
		// 					let strKeyFind = strKey.find((item: Record<string, any>) => item.fieldId == test[keys].fieldId);
		// 					if (strKeyFind && strKeyFind.title) {
		// 						test[keys].title = strKeyFind.title;
		// 					}
		// 				}

		// 				this.allKeys = test;
		// 			}
		// 		} catch (err) {}
		// 	}
		// }

		// @Watch("data", {
		// 	immediate: true,
		// 	deep: true,
		// })
		// dataChange(val: any) {
    //   console.log(val,7777777);
		// 	let that = this;
		// 	that.tableTitle = [];
		// 	that.tableData = [];
		// 	val.datasetData?.forEach((item: any, index: number) => {
		// 		let obj: any = {};
		// 		for (const key in item) {
		// 			obj = {
		// 				...obj,
		// 				...item[key],
		// 			};
		// 		}

		// 		that.tableData.push(obj);
		// 	});

		// 	let filterArr: any = [];
		// 	val.defaultColumnField?.forEach((item: any) => {
		// 		let obj: any = {};
		// 		let object: any = {};
		// 		if (item.fieldId.indexOf(".") == -1 || item.fieldId.indexOf("`") > -1) {
		// 			object.title = {
		// 				zh: item.fieldId,
		// 				en: item.fieldId,
		// 			};
		// 			object.type = "input";
		// 			object.oldTitle = {
		// 				zh: item.fieldId,
		// 				en: item.fieldId,
		// 			};
		// 			object.oldType = item.type || "input";
		// 			object.fieldId = item.fieldId;
		// 			object.fieldIdAsName = item.fieldIdAsName;
		// 			// that.tableTitle.push(object);
		// 		}

		// 		obj.fieldId = item.fieldId.indexOf("`") > -1 ? item.fieldId : item.fieldId.split(".", -1)[1];
		// 		obj.fieldIdAsName = item.fieldId.indexOf("`") > -1 ? item.fieldIdAsName : item.fieldIdAsName.split(".", -1)[1];

		// 		if (Object.keys(object).length > 0) {
		// 			filterArr.push(object);
		// 		} else {
		// 			filterArr.push(obj);
		// 		}
		// 	});
		// 	// console.log(filterArr,3333);
		// 	filterArr.forEach((item: any) => {
		// 		if (that.allKeys.hasOwnProperty(item.fieldId)) {
		// 			for (let key in that.allKeys) {
		// 				if (key && item.fieldId == key) {
		// 					item = {
		// 						...item,
		// 						...that.allKeys[key],
		// 					};
		// 					item.oldTitle = this.$utils.deepClone(that.allKeys[key].oldTitle);
		// 					item.oldType = that.allKeys[key].oldType;
		// 					if (item.fieldId != item.fieldIdAsName) {
		// 						item.title.zh = item.fieldIdAsName;
		// 						item.title.en = item.fieldIdAsName;
		// 					}
		// 					that.tableTitle.push(item);
		// 				}
		// 			}
		// 		} else {
		// 			that.tableTitle.push(item);
		// 		}
		// 	});
		// }

    @Watch("data", {
			immediate: true,
			deep: true,
		})
    dataChange(val:any){
			let that = this;
			that.tableTitle = [];
			that.tableData = [];
			val.datasetData?.forEach((item: any, index: number) => {
				let obj: any = {};
				for (const key in item) {
					obj = {
						...obj,
						...item[key],
					};
				}

				that.tableData.push(obj);
			});

      let filterArr: any = [];
      val.defaultColumnField?.forEach((item: any) => {
				let obj: any = {};
				let object: any = {};
				if (item.fieldId.indexOf(".") > -1 || item.fieldId.indexOf("`") > -1) {
          let newFieldId = item.fieldId.indexOf("`") > -1 ? item.fieldId : item.fieldId.split(".", -1)[1];
          let newFieldIdAsName =  item.fieldId.indexOf("`") > -1 ? item.fieldIdAsName : item.fieldIdAsName.split(".", -1)[1];
					object.title = {
						zh: newFieldId,
						en: newFieldId,
					};
					object.type = "";
					object.oldTitle = {
						zh: newFieldId,
						en: newFieldId,
					};
					// object.oldType = item.type || "input";
					object.fieldId = newFieldId
		  		object.fieldIdAsName = newFieldIdAsName
					that.tableTitle.push(object);
				}
      })

    }

		@Watch("tableTitle", {
			immediate: true,
			deep: true,
		})
		tableTitleChange(val: any) {
			this.$emit("change", val);
		}

		private filterArray(val: any) {
			try {
				if (Array.isArray(JSON.parse(val)) || Array.isArray(val)) {
					return true;
				} else {
					return false;
				}
			} catch (err) {
				return false;
			}
		}

		private renderHeader(h: any, { column }: any, val: any) {
			// console.log(column, "columncolumncolumncolumn", this.tableTitle);

			return (
				<div>
					<span>{column.label}</span>
					<i class="el-icon-edit-outline" style="color:#6087FD;margin-left:5px;" onClick={() => this.columnEdit(val)}></i>
				</div>
			);
		}

		private columnEdit(val: any) {
      console.log(val,11111111111);
			this.dialogVisible = true;
			this.originType = val.oldType;
			this.fieldType = val.type;
			this.originName = val.oldTitle.zh;
			this.fieldName = val.title.zh;
			this.fieldId = val.fieldId;
		}

		private modifyProp() {
			this.tableTitle.forEach((item: any) => {
				if (item.fieldId == this.fieldId) {
					item.title.zh = this.fieldName;
					item.title.en = this.fieldName;
					// item.oldType = this.originType;
					item.type = this.fieldType ? this.fieldType : item.type;
				}
			});
      
			this.dialogVisible = false;
		}

		protected created() {}
	}
</script>

<style lang="scss" scoped>
	.propItem {
		margin-bottom: 20px;
		text-align: center;
		.defaultProp {
			width: 217px;
			height: 40px;
			line-height: 40px;
			border: 1px solid #e4e7ed;
			display: inline-block;
			vertical-align: middle;
			text-align: left;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			padding: 0 30px;
			background-color: #f5f7fa;
			color: #c0c4cc;
			cursor: not-allowed;
		}
		.widget-config-label {
			margin-right: 40px;
		}
	}

	::v-deep.el-table {
		overflow: auto;
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
