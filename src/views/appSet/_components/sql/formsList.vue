<script lang="tsx">
	import { Component, Watch, Vue } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import { queryRecursiveTree, getFormFields, getAllApp } from "@/api/form.js";
	import { TreeParentData, TreeChildData } from "./SqlCore.ts";

	@Component({})
	export default class FormsList extends Vue {
		private formslist: TJson[] = [];
		private formMap: TJson = {};
		private childlist: TJson[] = [];
		private subFormCodes: TJson[] = [];
		private applist: Record<string, any> = [];
		private curAppCode: string = "";
		private isLoading = false;

		private getFormsList() {}

		private get lang() {
			return localStorage.getItem("lang") || "zh";
		}

		private deepTree(list: TJson[], formMap: TJson) {
			if (!list) return [];
			list.forEach((item: TJson) => {
				let key = item.id;
				let conf = formMap[item.id];
				if (item.childList && item.childList.length > 0) {
					return this.deepTree(item.childList, formMap);
				}

				if (conf?.type == "F" || conf?.type == "C") {
					TreeParentData.ins().options = formMap[key];
					this.formslist.push(TreeParentData.ins().options);
				}
			});
		}

		protected created() {
			this.curAppCode = this.$route.params.appCode;

			getAllApp().then((resp: TResponse) => {
				this.applist = resp.data.permApps.filter((app: Record<string, any>) => app.isApp);
			});

			this.queryFormTree(this.curAppCode);
		}

		private queryFormTree(code: string) {
			this.isLoading = true;
			queryRecursiveTree(code).then((resp: TResponse) => {
				this.formslist = [];
				this.deepTree(resp.data.idRecursiveTree, resp.data.formMap);
				this.isLoading = false;
			});
		}

		private loadFormFields(node: TJson, resolve: (params: TJson[]) => void) {
			let { appCode, formCode } = node.data;
			if (!appCode || !formCode) return resolve([]);
			getFormFields(appCode, formCode).then((resp: TResponse) => {
				let structure = resp.data.structure;
				let subFormCodes = resp.data.structure?.subFormCode || {};
				let configList = [];
				configList.unshift({
					...node.data,
					leaf: true,
				});

				if (structure) {
					configList.push(...TreeChildData.ins().getChildData(node.data, [...structure.configList], subFormCodes));
				}

				resolve(configList);

				//this.childlist.push(...configList);
				//this.$emit("changeChildlist", this.childlist, this.subFormCodes);
			});
		}

		private nodeClick(data: TJson, node: TJson) {
			data.leaf && this.$emit("changeField", data);
		}

		private handleSelect(code: string) {
			this.curAppCode = code;
			this.queryFormTree(this.curAppCode);
		}

		public render(h: CreateElement) {
			let props = {
				data: this.formslist,
				lazy: true,
				load: this.loadFormFields,
				props: {
					isLeaf: "leaf",
				},
			};

			return (
				<div class="dataset-sql-apps">
					<div class="select-app" style={{}}>
						<div class="h4">当前应用</div>
						<rvue-select on={{ change: this.handleSelect }} props={{ filterable: true, value: this.curAppCode }} style={{ flex: 1 }} placeholder="请选择">
							{this.applist.map((opt: Record<string, any>) => (
								<rvue-option
									props={{
										key: opt.code,
										value: opt.code,
										label: (function (params) {
											try {
												return params.multiLanguage(window.localStorage.getItem("lang"));
											} catch (err) {
												return params.name;
											}
										})(opt),
									}}
								></rvue-option>
							))}
						</rvue-select>
					</div>
					<div class="form-tree">
						{this.isLoading ? (
							<div class="loading">
								<i class="el-icon-loading"></i>
							</div>
						) : (
							<div></div>
						)}

						<rvue-tree
							on-node-click={this.nodeClick}
							props={props}
							scopedSlots={{
								default: (scoped: TJson) => {
									let curNode = scoped.slotScope.data;
									let title = curNode.title;
									let type = curNode.type || "data";
									let className = curNode.leaf ? "" : `el-icon-tickets form-type-${curNode.formType}`;
									return (
										<div class={"group " + type} skey={curNode.skey}>
											<i class={className || `leaf-${type}`}></i>
											{curNode.leaf ? (
												<el-tooltip
													class="item"
													effect="dark"
													placement="right"
													props={{
														content: curNode.skey,
													}}
												>
													<span class="leaf-node">{title[this.lang]}</span>
												</el-tooltip>
											) : (
												<span class="leaf-node">{title[this.lang]}</span>
											)}
										</div>
									);
								},
							}}
						></rvue-tree>
					</div>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.form-tree {
		position: relative;
	}
	.select-app {
		padding: 12px 5px;
		margin: 0 2px 5px;
		display: flex;
		flex-direction: column;
		background: #f2f2f2;
		.h4 {
			text-align: center;
			font-size: 16px;
			font-weight: bold;
			color: #333;
			padding-bottom: 3px;
			white-space: nowrap;
		}
	}

	.loading {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		background: rgba(255, 255, 255, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		i {
			color: $color;
			font-size: 20px;
		}
	}
	::v-deep {
		.el-tree-node > .el-tree-node__children {
			overflow: visible;
		}
	}

	[skey="parent_data_id"],
	[skey="id"] {
		color: #000;
	}
	.leaf-node {
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
	}

	.dataset-sql-apps {
		height: calc(100vh - 45px);
		overflow-y: auto;
		border-right: 1px solid #aaaaaa;

		box-sizing: border-box;
	}
	.el-icon-tickets {
		@include PositionRelative(20px, 20px);
		display: inline-block;
		line-height: 20px;
		text-align: center;
		color: #fff;
		margin-right: 5px;
		@include GlobalAvatar(null, null, 3px, #6087fd);
	}
	.group {
		line-height: 30px;
		position: relative;
		&:hover {
			.hover {
				display: block;
			}
		}
		&.data,
		&.table {
			font-weight: bold;
		}
		.hover {
			position: absolute;
			bottom: 10px;
			left: 10px;
			z-index: 2;
			background: rgba(0, 0, 0, 0.6);
			color: #fff;
			display: none;
			width: 200px;
			white-space: normal;
			line-height: 20px;
			padding: 3px;
			box-sizing: border-box;
		}
	}
	.leaf {
		&-data,
		&-table {
			font-weight: bold;
			font-family: element-icons;
			font-style: normal;
			&::before {
				content: "\e78b";
				color: #000;
				margin-right: 2px;
			}
		}
	}
</style>
