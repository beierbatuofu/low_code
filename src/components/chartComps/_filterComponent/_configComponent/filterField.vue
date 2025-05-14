<template>
	<div class="marginb30">
		<rvue-label required :label="$t('chartDesign.ff')" />

		<div v-for="(item, index) in checkedReports" :key="item.reportCode" class="reportItem">
			<div class="formName">{{ getName(item.title) }}</div>
			<div class="formName">{{ $t("chartDesign.ds") }}:{{ getSoureName(item).length == 0 ? "请选择该报表的数据源" : getSoureName(item) }}</div>

			<rvue-select :disabled="getDisableHandler(item, index)" v-model="data.config.checkedReports[index]['selectField']" clearable @change="selectChangeHandler($event, item, index)">
				<template slot="empty">
					<div class="empty">{{ $t("chartDesign.nonField") }}</div>
				</template>
				<rvue-option :label="getName(itemF.title)" :value="itemF.fieldId" v-for="itemF in getConfigFilterList(item.configList)" :key="itemF.fieldId"></rvue-option>
			</rvue-select>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	import { ReportListItem } from "./_type";

	@Component({
		components: {},
	})
	export default class FilterField extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) filterForm!: any;

		// private get getConfigList() {
		// 	return (item: Record<string, any>) => {
		// 		let list: Record<string, any>[] = [];
		// 		item.configList.forEach((item: Record<string, any>) => {
		// 			if (!["separator", "tab", "table"].includes(item.type)) {
		// 				list.push(item);
		// 			}
		// 			if (item.type == "table") {
		// 				let { children, ...attr } = item;

		// 				let child = children.map((ite: Record<string, any>) => ({
		// 					...ite,
		// 					title: {
		// 						zh: item.title.zh + "." + ite.title.zh,
		// 						en: item.title.en + "." + ite.title.en,
		// 					},
		// 					parent: attr,
		// 				}));
		// 				list.push(...child);
		// 			}
		// 		});

		// 		return list;
		// 	};
		// }
		//选中的报表所有信息
		private get checkedReports() {
			let list: any = [];
			if (!this.data?.config.reportLists) return [];

			this.data?.config?.reportLists.map((rItem: any) => {
				this.data.config.checkedReports.map((cItem: any) => {
					if (rItem.reportCode == cItem.reportCode) {
						list.push({
							...rItem,
							...cItem,
						});
					}
				});
			});
			return list;
		}

		private getName(name: string | Record<string, any>) {
			if (typeof name == "undefined") return "";
			let n = typeof name == "string" ? name : name[<string>localStorage.getItem("lang")];
			return n;
		}
		//根据filedtype选类型
		private getConfigFilterList(configList: Record<string, any>) {
			if (!configList) return [];
			return configList.filter((item: any) => {
				return item.type == this.data.config.fieldType;
			});
		}
		private getDisableHandler(item: ReportListItem, index: number) {
			if (!this.data.config.fieldType) return true;
			return false;
		}
		//数据源名字
		private getSoureName(item: any) {
			if (typeof item == "string") return [];
			return item.sourceType == "form"
				? `${this.$t("chartDesign.form")}_` + item.sourceName[<string>localStorage.getItem("lang")]
				: `${this.$t("chartDesign.dataset")}_` + item.sourceName[<string>localStorage.getItem("lang")];
		}
		//选中字段
		private selectChangeHandler(fieldId: string, item: any, index: number) {
			let fidKey = item.sourceType == "dataset" ? "fieldIdAsName" : "fieldId";
			let selectFid: string = "";
			item.configList.map((item: any) => {
				if (fieldId == item.fieldId) {
					selectFid = item[fidKey];
					if (item.parent) {
						//改变当前的选中parentFieldId
						this.$set(this.data.config.checkedReports[index], "parentFieldId", item.parent.fieldId);
					} else {
						this.$set(this.data.config.checkedReports[index], "parentFieldId", "");
					}
				}
			});

			//清空选择方法
			this.$set(this.data.config, "selectDefaultMethod", "");
			for (const key in this.filterForm) {
				delete this.filterForm[key];
			}

			//改变当前的选中fieldid
			this.$set(this.data.config.checkedReports[index], "selectField", selectFid);
			console.log(this.data.config.checkedReports, fieldId);
		}
	}
</script>

<style lang="scss" scoped>
	.show {
		border: 1px solid rgba(209, 209, 209, 1);
		background: rgba(241, 241, 241, 1);
		color: #888888;
		height: 30px;
	}
	.flex {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.reportItem {
		margin-bottom: 10px;
	}
	.marginb30 {
		margin-bottom: 30px;
	}
	.empty {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		color: red;
		font-size: 14px;
	}
	.formName {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		margin-bottom: 8px;
	}
</style>
