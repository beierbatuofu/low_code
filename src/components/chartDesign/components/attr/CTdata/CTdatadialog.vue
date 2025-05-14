<template>
	<rvue-dialog :visible.sync="visibleSync" top="10vh" width="30%" title="数据源">
		<div class="bidatadialog-container">
			<rvue-tabs v-model="activeName" @tab-click="handleClick">
				<rvue-tab-pane label="表单" name="form"> </rvue-tab-pane>
				<rvue-tab-pane label="数据统计" name="dataset"></rvue-tab-pane>
			</rvue-tabs>
			<ul class="form-list">
				<li class="form-item" :class="item.id == currentSelect ? 'form-item-active' : ''" v-for="item in list" :key="item.id" @click="handleChooseForm(item)">
					<span v-if="item.type != 'D'">{{ formAndDataGetName(item) }}</span>
				</li>
			</ul>
		</div>
		<span slot="footer" class="dialog-footer">
			<rvue-button size="mini" @click="visibleSync = false">取 消</rvue-button>
			<rvue-button size="mini" type="primary" @click="handleSave">确 定</rvue-button>
		</span>
	</rvue-dialog>
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
	import { getFormSingleTest, queryRecursiveTree } from "@/api/form";
	import { getDataset } from "@/api/dataset";
	import BaseAttr from "../../../core/BaseAttr";
	import { FormMapItem, IdRecursiveTreeItem, FormMap, DatasetMapItem } from "./_type/index";
	@Component({
		components: {},
	})
	export default class CTdatadialog extends BaseAttr {
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		@PropSync("formTitle", { type: [String, Object], default: "请选择" }) formTitleSync!: String;
		private activeName: string = "form";
		private list: FormMapItem[] = [];
		private currentSelect: string = "";
		private getFormList() {
			//获取所有表单
			this.$set(this, "list", []);
			queryRecursiveTree(this.$route.params.appCode).then((res: TResponse) => {
				let idRecursiveTree = res.data.idRecursiveTree;

				idRecursiveTree.map((item: IdRecursiveTreeItem) => {
					Object.values(res.data.formMap as FormMap<FormMapItem>).map((element: FormMapItem) => {
						if (item.id === element.id) {
							if (element.type === "P" || element.type === "D") {
							}
							//空文件夹
							else if (element.type === "S" && item.childList.length === 0) {
								//非空文件夹
							} else if (element.type === "S" && item.childList.length !== 0) {
								item.childList.map((sSon: TJson) => {
									Object.values(res.data.formMap as FormMap<FormMapItem>).map((ssSon: FormMapItem) => {
										if (ssSon.id === sSon.id) {
											if (ssSon.type === "P" || ssSon.type === "D") {
											} else {
												this.list.push(ssSon);
											}
										}
									});
								});
							} else {
								this.list.push(element);
							}
						}
					});
				});
			});
		}
		//选择表单
		private handleChooseForm(item: FormMapItem) {
			this.currentSelect = item.id;
		}

		private async handleSave() {
			if (!this.currentSelect) {
				this.$message.error("请选择");
				return;
			}

			let selectItem: unknown = this.list.filter((item: FormMapItem) => {
				return this.currentSelect == item.id;
			})[0];

			this.formTitleSync = this.formAndDataGetName(<FormMapItem | DatasetMapItem>selectItem);
			this.visibleSync = false;
			this.$set(this.data, "dimensions", []);
			this.$set(this.data, "indicators", []);
			this.$set(this.data, "matchRules", []);
			if (this.activeName === "dataset") {
				let datasetConf = <DatasetMapItem>selectItem;
				this.$set(
					(<any>this).formConfig,
					"configList",
					datasetConf.structure.map((ite: Record<string, any>) => ({
						...ite,
						fieldId: ite.fieldIdAsName,
					}))
				);
				this.$set((<any>this).formConfig, "code", datasetConf.datasetCode);
				this.$set((<any>this).formConfig, "id", datasetConf.id);
				this.$set((<any>this).formConfig, "sourceType", "dataset");
				this.$set((<any>this).formConfig, "appCode", datasetConf.appCode);
				this.$set((<any>this).formConfig, "type", datasetConf.type);
				this.$set((<any>this).formConfig, "correspond", datasetConf.correspond);
				this.$set((<any>this).formConfig, "datasetSql", datasetConf.datasetSql);
				this.$set((<any>this).formConfig, "displaySql", datasetConf.displaySql);
				this.$set((<any>this).formConfig, "formName", datasetConf.name);
			} else {
				let formConf = <FormMapItem>selectItem;
				getFormSingleTest(formConf.appCode, formConf.code).then((res: TResponse) => {
					this.$set((<any>this).formConfig, "sourceType", "form");
					this.$set((<any>this).data, "sourceType", "form");
					this.$set((<any>this).data, "sourceCode", res.data.code);
					//重复选择

					if (res.data.structure && this.formConfig.code != res.data.code) {
						this.$set((<any>this).formConfig, "configList", res.data.structure.configList);
						this.$set((<any>this).formConfig, "code", res.data.code);
						this.$set((<any>this).formConfig, "type", res.data.type);
						this.$set((<any>this).formConfig, "formName", res.data.multiLanguage);
						(<any>this).formConfig && this.$set((<any>this).formConfig, "id", res.data.id);
						res.data.structure.subFormCode && this.$set((<any>this).formConfig, "subFormCode", res.data.structure.subFormCode);
						//清空维度指标

						//空表单
					} else if (!res.data.structure && this.formConfig.code != res.data.code) {
						this.$set((<any>this).formConfig, "configList", []);
						this.$set((<any>this).formConfig, "code", res.data.code);
					}
				});
			}
		}
		//获取数据集
		private async getDataSet(appCode: string) {
			let res = await getDataset(appCode);

			this.list = res.data.filter((item: DatasetMapItem) => {
				return item.status === true;
			});
		}
		//表单数据集名字
		private formAndDataGetName(item: FormMapItem | DatasetMapItem): string {
			return item.name instanceof Object ? ((<Title>item.name)[<string>localStorage.getItem("lang")] as string) : item.name;
		}

		//获取表单
		private handleClick(tab: string, e: Event) {
			if (this.activeName === "dataset") {
				this.getDataSet(this.$route.params.appCode);
			} else {
				this.getFormList();
			}
		}
		@Watch("data.sourceCode", { deep: true })
		onChangData(n: string) {
			//初始化赋值
			if (!n) return;
			if (this.data.sourceType == "form") {
				queryRecursiveTree(this.$route.params.appCode).then((res: TResponse) => {
					//拿到当前的数据源

					let sourceData: FormMapItem[] = Object.values(res.data.formMap as FormMap<FormMapItem>).filter((element: FormMapItem) => {
						return element.code == n;
					});
					//数据原被删除--清空数据
					if (sourceData.length == 0 && this.data.sourceType == "form") {
						this.data.dimensions = [];
						this.data.indicators = [];
						this.data.config.data = {};
					}
				});
			} else if (this.data.sourceType == "dataset") {
			}
		}

		@Watch("formConfig.formName")
		onChangeName(n: Title) {
			this.formTitleSync = n instanceof Object ? (n[<string>localStorage.getItem("lang")] as string) : n;
		}

		protected created() {
			this.getFormList();
		}
	}
</script>

<style lang="scss" scoped>
	@import "./_style/index.scss";
</style>
