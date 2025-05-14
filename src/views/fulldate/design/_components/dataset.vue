<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import { FormModule } from "@/store/modules/form";
	import { getDataset } from "@/api/dataset";
	import { getFormSingle } from "@/api/form";
	import { getChartData } from "@/api/bi";

	interface TDatatype {
		label: string;
		value: TSourceType;
	}

	@Component
	export default class Dataset extends Vue {
		@Prop({ type: Object, default: () => ({}) }) data!: TFullDateData;
		private datatype: [TDatatype, TDatatype] = [
			{
				label: "普通表单",
				value: "form",
			},
			{
				label: "数据集",
				value: "dataset",
			},
		];

		private formList: Record<string, any>[] = [];
		private datasetList: Record<string, any>[] = [];
		private isLoading: boolean = false;

		private get sourceType() {
			return this.data.sourceType;
		}

		private set sourceType(t: TSourceType) {
			this.data.sourceType = t;
		}

		private get sourceCode() {
			return this.data.sourceCode;
		}

		private set sourceCode(c: string) {
			this.data.sourceCode = c;
		}

		private reset() {
			this.data.dimensions = [];
			this.data.indicators = [];
			this.data.status.codes = [];
			this.data.status.styles = {};
			this.$emit("reset", this.data);
		}

		@Emit("change")
		private emitChange(data: Record<string, any> = {}) {
			return {
				data,
				sourceType: this.sourceType,
				sourceCode: this.sourceCode,
			};
		}

		private handleChangeType(v: TSourceType) {
			this.sourceType = v;
			this.sourceCode = "";
			this.reset();
			this.emitChange();
		}

		private async *getSourceData(type: string, code: string) {
			let data: Record<string, any> | undefined = this.datalist.find((item: Record<string, any>) => item.sourceCode == code);
			let { appCode, code: formCode } = data as Record<string, any>;

			if (this.sourceType == "form") {
				let resp = await getFormSingle(appCode, formCode);
				yield { configList: resp.data.structure?.configList || [] };
			} else {
				yield { configList: data?.structure || [] };
			}

			yield data;
		}

		private async handleChangeData(code: string) {
			this.sourceCode = code;

			let asyncIter = this.getSourceData(this.sourceType, code)[Symbol.asyncIterator]();
			let result: Record<string, any> = {};
			for await (let d of asyncIter) {
				result = { ...d, ...result };
			}

			this.emitChange(result);
		}

		private get datalist() {
			return this.sourceType == "form" ? this.formList : this.datasetList;
		}

		protected render() {
			if (!this.isLoading) return <div></div>;
			return (
				<div class="dataset">
					<rvue-select placeholder="请选择" style="width:130px;margin-right:5px;" props={{ value: this.sourceType }} on={{ change: this.handleChangeType }}>
						{this.datatype.map((opt: Record<"label" | "value", string>, idx: number) => {
							return <rvue-option key={idx} props={opt}></rvue-option>;
						})}
					</rvue-select>

					<rvue-select
						placeholder="请选择"
						props={{ value: this.sourceCode }}
						on={{
							change: (c: string) => {
								this.handleChangeData(c);
								this.reset();
							},
						}}
					>
						{this.datalist.map((opt: Record<string, string>, idx: number) => {
							return <rvue-option key={idx} props={{ value: opt.sourceCode, label: opt.label }}></rvue-option>;
						})}
					</rvue-select>
				</div>
			);
		}
		protected async created() {
			let { appCode } = this.$route.params;
			let lang = window.localStorage.getItem("lang") || "zh";
			Promise.all([FormModule.queryFormsTree(appCode), FormModule.queryDataset(appCode)]).then((resps) => {
				let formlist: Record<string, any>[] = [];
				let datasetlist: Record<string, any>[] = [];

				resps
					.flat()
					.filter((item: Record<string, any>) => ["sql", "F", "C", "S"].includes(item.type))
					.forEach((item: Record<string, any>) => {
						if (item.type == "sql") {
							datasetlist.push({
								...item,
								sourceType: "dataset",
								sourceCode: item.datasetCode,
								label: item.name[lang] || item.name["zh"],
							});
						} else if (item.type == "S") {
							item.children &&
								item.children.forEach((ite: Record<string, any>) => {
									if (ite.type == "F" || ite.type == "C") {
										formlist.push({
											...ite,
											sourceType: "form",
											sourceCode: ite.code,
											label: ite.multiLanguage[lang] || ite.multiLanguage["zh"],
										});
									}
								});
						} else {
							formlist.push({
								...item,
								sourceType: "form",
								sourceCode: item.code,
								label: item.multiLanguage[lang] || item.multiLanguage["zh"],
							});
						}
					});

				this.formList = formlist;
				this.datasetList = datasetlist;
				this.sourceCode && this.handleChangeData(this.sourceCode);
				this.isLoading = true;
				this.$emit("loading");
			});
		}
	}
</script>
<style lang="scss" scoped>
	.dataset {
		display: flex;
		padding-left: 10px;
	}
	::v-deep {
		.el-input--prefix .el-input__inner {
			padding-left: 15px !important;
		}
	}
</style>
