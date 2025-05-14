<template>
	<div class="publish-wrapper">
		<el-tabs tab-position="left" style="min-height: 200px" @tab-click="handleChange">
			<el-tab-pane
				><span slot="label"
					><i class="el-icon-user"></i>
					{{ $i18n.t("form.formpublish.towardsmembers") }}</span
				>
				<el-row :span="24">
					<div class="pane-head">
						<div class="title">
							<span>{{ $i18n.t("form.formpublish.towardsmembers") }}</span>
							<span class="subtitle">{{
								$i18n.t("form.formpublish.towardsmemberstip")
							}}</span>
						</div>
					</div>
					<div class="pane-header">
						<el-button
							type="primary"
							size="small"
							icon="el-icon-plus"
							@click="openDialogPerm"
							>{{ $i18n.t("form.formpublish.newauthgroup") }}</el-button
						>
					</div>
					<div class="pane-main">
						<div class="main-item" :key="value.id" v-for="value in groups">
							<div class="item-title-line">
								<span class="title">{{ value.name }}</span>
								<div class="title-btn style-red" @click="deleteGroup(value.id)">
									删除
								</div>
								<div class="title-btn style-blue" @click="editGroup(value.id)">
									编辑
								</div>
							</div>
							<div class="sub-title">{{ value.remark }}</div>
							<div class="pane-line">
								<ul class="select-list">
									<li
										class="select-item"
										:key="item.id"
										v-for="item in value.deptList"
									>
										<div class="user-avatar">
											<i class="el-icon-s-grid" style="color: #fa0"></i>
										</div>
										<span class="msg">{{ item.name }}</span>
									</li>
									<li
										class="select-item"
										:key="item.id"
										v-for="item in value.roleList"
									>
										<div class="user-avatar">
											<i
												class="el-icon-user-solid"
												style="color: #248af9"
											></i>
										</div>
										<span class="msg">{{ item.name }}</span>
									</li>
									<li
										class="select-item"
										:key="item.id"
										v-for="item in value.userList"
									>
										<div class="user-avatar">
											<img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
											<i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#6087FD', color: '#fff', borderRadius: '50%' }"></i>
										</div>
										<span class="msg">{{ item.name }}</span>
									</li>
									<el-button
										type="text"
										@click="handleEdit(value.id)"
										:icon="
											value.deptList.length ||
											value.roleList.length ||
											value.userList.length
												? ''
												: 'el-icon-plus'
										"
									>
										{{
											value.deptList.length ||
											value.roleList.length ||
											value.userList.length
												? $i18n.t("form.formpublish.edit")
												: $i18n.t("form.formpublish.clickselectuser")
										}}
									</el-button>
								</ul>
							</div>
						</div>
					</div>
				</el-row>
			</el-tab-pane>

			<el-tab-pane
				><span slot="label"
					><i class="el-icon-s-promotion"></i>
					{{ $i18n.t("form.formpublish.towardspublic") }}</span
				>
				<el-row :span="24">
					<div class="pane-head">
						<div class="title">
							<span>{{ $i18n.t("form.formpublish.towardspublic") }}</span>
							<span class="subtitle">{{
								$i18n.t("form.formpublish.towardspublictip")
							}}</span>
						</div>
					</div>
					<el-col :offset="5" :span="12">
						<el-input v-model="url">
							<template slot="append">
								<el-button @click="copyText" color="primary">{{
									$i18n.t("form.formpublish.copy")
								}}</el-button>
							</template>
						</el-input>
					</el-col>
					<el-col :span="2">
						<el-button type="primary" @click="goto">{{
							$i18n.t("form.formpublish.gostraight")
						}}</el-button>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
		<RvueDepartmentMembers
			:defaultTags.sync="tags"
			:dialogVisible.sync="dialogVisible"
			@closeDialog="bindGetTags"
		/>
		<rvue-dialog
			:visible.sync="addDialogVisible"
			@close="addDialogVisible = false"
			:close-on-click-modal="false"
			:append-to-body="true"
			:destroy-on-close="true"
			:title="`${curId ? '编辑' : '添加'}权限组`"
		>
			<el-form :model="form">
				<div class="auth-content">
					<div class="auth-menu">
						<div
							:class="`menu-item ${activeName === 'name' ? 'select' : ''}`"
							@click="activeName = 'name'"
						>
							{{ $i18n.t("form.formpublish.nameinfo") }}
						</div>
						<div
							:class="`menu-item ${activeName === 'optAuth' ? 'select' : ''}`"
							@click="activeName = 'optAuth'"
						>
							{{ $i18n.t("form.formpublish.opreateauth") }}
						</div>
						<div
							:class="`menu-item ${activeName === 'fieldAuth' ? 'select' : ''}`"
							@click="activeName = 'fieldAuth'"
						>
							{{ $i18n.t("form.formpublish.fieldauth") }}
						</div>
					</div>
					<div class="content-main">
						<div v-if="activeName === 'name'" class="content-pane">
							<div class="desc">{{ $i18n.t("form.formpublish.nameinfotip") }}</div>
							<el-form-item label="">
								<el-input
									placeholder="填写权限组名称"
									v-model="form.name"
									autocomplete="off"
								></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input
									:rows="8"
									type="textarea"
									placeholder="填写描述信息"
									v-model="form.remark"
								></el-input>
							</el-form-item>
						</div>
						<div v-if="activeName === 'optAuth'" class="content-pane">
							<div class="desc">{{ $i18n.t("form.formpublish.opreateauthtip") }}</div>
							<el-form-item label="">
								<el-checkbox-group v-model="form.opt">
									<el-checkbox
										:key="item.id"
										v-for="item in operTypeList"
										:label="item.id"
										>{{ item.name }}</el-checkbox
									>
								</el-checkbox-group>
							</el-form-item>
						</div>
						<div v-if="activeName === 'fieldAuth'" class="content-pane">
							<div class="desc">{{ $i18n.t("form.formpublish.fieldauthtip") }}</div>
							<div class="auth">
								<div class="head">
									<span class="opt">{{ $i18n.t("form.formpublish.field") }}</span>
									<span class="opt view">{{
										$i18n.t("form.formpublish.visible")
									}}</span>
									<span class="opt edit">{{
										$i18n.t("form.formpublish.editable")
									}}</span>
								</div>
								<ul>
									<li class="subform-item" :key="v.id" v-for="v in fieldsList">
										<span>{{ v.label }}</span>
										<el-checkbox class="view" v-model="v.visible"></el-checkbox>
										<el-checkbox
											class="edit"
											v-model="v.editable"
											@change="v.visible = true"
										></el-checkbox>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini"  @click="addDialogVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="submitAdd">保 存</el-button>
			</div>
		</rvue-dialog>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import {
		getPermGroupList,
		getToken,
		getOperTypeList,
		getFields,
		savePermGroup,
		delPermGroup,
		updatePermGroup,
		authPermGroup,
		getPermGroup,
	} from "@/api/form";

	export default Vue.extend({
		name: "FormPublish",
		data() {
			return {
				url: "",
				addDialogVisible: false,
				tags: [],
				dialogVisible: false,
				curId: null,
				groups: [
					/* 	{
						id: 1,
						title: '直接提交数据',
						subtitle: '在此分组内的成员只可以填报数据',
						members: []
					},
					{
						id: 2,
						title: '提交并管理本人数据',
						subtitle: '在此分组内的成员可以填报数据、管理自己填报的数据',
						members: []
					},
					{
						id: 3,
						title: '管理全部数据',
						subtitle: '在此分组内的成员可以管理全部数据、填报数据、但不可以导入数据',
						members: []
					},
					{
						id: 4,
						title: '查看全部数据',
						subtitle: '在此分组内的成员可以查看所有数据',
						members: []
					}, */
				],
				operTypeList: [],
				fieldsList: [],
				activeName: "name",
				form: {
					name: "",
					remark: "",
					opt: [],
				},
			};
		},
		/* activated() {
			getToken(this.$route.params.appCode, this.$route.params.id).then((res: any) => {
				this.url = `http://${document.location.host}/#/ext-link/f/${res.data}`;
			});
		}, */
		activated() {
			this.init();
			this.refresh();
		},
		methods: {
			init() {
				getOperTypeList().then((res: any) => (this.operTypeList = res.data));
				getFields(this.$route.params.appCode, this.$route.params.id).then((res: any) => {
					this.fieldsList = res.data;
				});
			},
			reset() {
				this.curId = null;
				this.activeName = "name";
				this.form = {
					name: "",
					remark: "",
					opt: [],
				};
			},
			refresh() {
				// 查询权限组列表
				getPermGroupList(this.$route.params.id, "F").then((res: any) => {
					this.groups = res.data;
				});
			},
			openDialogPerm() {
				this.reset();
				this.addDialogVisible = true;
			},
			submitAdd() {
				if (!this.form.name) {
					this.$message.warning("权限组名称不能为空");
					return;
				}
				let arr: any = [];
				this.fieldsList.forEach((value: any) => {
					arr.push({
						fieldId: value.id,
						editable: !!value.editable,
						visible: !!value.visible,
					});
				});
				let data = {
					type: "F",
					formCode: this.$route.params.id,
					name: this.form.name,
					remark: this.form.remark,
					operTypeIds: this.form.opt,
					permGroupFields: arr,
				};
				// 编辑权限组
				if (this.curId) {
					updatePermGroup({
						...data,
						id: this.curId,
					}).then((res: any) => {
						if (res.data) {
							this.$message.success("修改权限组成功！");
							this.addDialogVisible = false;
							this.refresh();
						} else {
							this.$message.success("请求失败！");
						}
					});
				} else {
					savePermGroup(data).then((res: any) => {
						if (res.data) {
							this.$message.success("新增权限组成功！");
							this.addDialogVisible = false;
							this.refresh();
						} else {
							this.$message.success("请求失败！");
						}
					});
				}
			},
			deleteGroup(id: any) {
				delPermGroup(id).then((res: any) => {
					if (res.data) {
						this.$message.success("删除权限组成功！");
						this.refresh();
					}
				});
			},
			// 编辑权限组详情
			async editGroup(id: any) {
				this.reset();
				this.curId = id;
				let res = await getPermGroup(id);
				let form = res.data;
				this.form = {
					...form,
					opt: form.operTypeIds,
				};
				// 合并初始字段数组和字段权限数组
				let fieldsList: any = this.fieldsList;
				let permGroupFields = form.permGroupFields;
				for (let i = 0; i < fieldsList.length; i++) {
					for (let j = 0; j < permGroupFields.length; j++) {
						if (fieldsList[i].id === permGroupFields[j].fieldId) {
							fieldsList[i] = { ...fieldsList[i], ...permGroupFields[j] };
						}
					}
				}
				this.fieldsList = fieldsList;
				this.addDialogVisible = true;
			},
			// 编辑成员绑定关系
			handleEdit(id: any) {
				this.dialogVisible = true;
				this.curId = id;
			},
			bindGetTags(tags: any) {
				// 请求接口
				authPermGroup({
					authJson: JSON.stringify(tags),
					id: this.curId,
				}).then((res: any) => {
					if (res.data) {
						this.dialogVisible = false;
						this.$message.success("保存成功！");
						this.refresh();
					}
				});
			},
			handleClick() {},
			handleChange(column: any) {
				if (column.index === "1") {
					getToken(this.$route.params.appCode, this.$route.params.id).then((res: any) => {
						this.url = `http://${document.location.host}/#/ext-link/f/${res.data}`;
					});
				}
			},
			goto() {
				window.open(this.url);
			},
			copyText() {
				(this as any)
					.$Clipboard({
						text: this.url,
					})
					.then(() => {
						this.$message.success("复制成功");
					})
					.catch(() => {
						this.$message.error("复制失败");
					});
			},
		},
	});
</script>

<style lang="scss" scoped>
	.publish-wrapper {
		@include PositionRelative(1000px,null);
		margin: 20px auto;
		min-height: 320px;
	}
	.pane-head {
		line-height: 40px;
		.title {
			height: 42px;
			line-height: 42px;
			border-bottom: 1px solid #e0e0e0;
			padding: 0 20px;
			font-size: 16px;
			> span {
				color: #595959;
			}
			> .subtitle {
				font-size: 12px;
				margin-left: 20px;
				color: #ababab;
			}
		}
	}
	.pane-header {
		padding: 15px 20px;
		position: relative;
		&::after {
			content: "";
			height: 1px;
			@include PositionAbsoulte(null,20px,0,20px);
			background: #e0e0e0;
		}
	}
	.pane-main {
		padding: 0 20px;
		overflow-x: hidden;
		overflow-y: auto;
		.main-item {
			padding: 15px 0;
			border-bottom: 1px solid #e0e0e0;
			transition: all 218ms;
			.item-title-line {
				padding: 10px 0 8px;
				overflow: hidden;
				line-height: 20px;
				.title {
					font-size: 14px;
					font-weight: 500;
					color: #212121;
					line-height: 18px;
					@include PositionRelative(495px,null);
					float: left;
					left: 0;
					@include ExtraNotDisplayed();
				}
				.title-btn {
					position: relative;
					float: right;
					right: 0;
					font-size: 12px;
					padding: 0 15px;
					border-left: 1px solid #e0e0e0;
					cursor: pointer;
					transition: color 218ms;
					&:last-child {
						border-left: none;
					}
					&.style-red {
						color: #e64340;
					}
					&.style-blue {
						color: #178cdf;
					}
				}
			}
			.sub-title {
				font-size: 12px;
				line-height: 18px;
				color: grey;
				margin-bottom: 5px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				word-break: break-all;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
			}
			.pane-line {
				line-height: 22px;
				.select-list {
					height: 80px;
					margin-bottom: 10px;
					overflow: auto;
					.select-item {
						display: inline-block;
						line-height: 30px;
						margin: 5px 0 0 5px;
						padding: 0 10px;
						@include GlobalAvatar(null,null,1px,#f3f6fc);
						font-size: 14px;
						.user-avatar {
							margin-right: 4px;
							@include VertivalAlign(inline-block,middle,20px,20px);
							line-height: 20px;
							.avatar-image {
								@include GlobalAvatar(100%,100%,50%)
							}
						}
					}
				}
			}
		}
	}

	.auth-content {
		@include PositionRelative(null,360px);
		border-bottom: 1px solid #e9e9e9;
		.auth-menu {
			width: 100px;
			height: 100%;
			padding-top: 15px;
			background-color: #fafafa;
			.menu-item {
				height: 36px;
				line-height: 36px;
				text-align: center;
				cursor: pointer;
				@include ExtraNotDisplayed();
				padding: 0 5px;
				&:hover {
					background-color: #fff;
					color: #6087FD;
				}
				&.select {
					background-color: #fff;
					color: #6087FD;
				}
			}
		}
		.content-main {
			@include PositionAbsoulte(100px,0,0,0);
			overflow: auto;
			padding: 0 20px;
		}
	}
	.content-pane {
		.desc {
			line-height: 32px;
			color: #91a1b7;
		}
		.auth {
			overflow: auto;
			.head {
				@include PositionRelative(null,30px);
				border-top: solid 1px #ddd;
				padding: 0 8px;
				border-bottom: solid 1px #ddd;
				background: #fafafa;
				line-height: 30px;
				.opt {
					text-align: center;
					@include PositionAbsoulte(0,null,null,null);
					&.view {
						width: 60px;
						right: 150px;
					}
					&.edit {
						width: 60px;
						right: 30px;
					}
				}
			}
			ul > li {
				position: relative;
				border-top: 1px solid #e9e9e9;
				padding: 10px 200px 10px 8px;
				min-height: 40px;
				&:first-child {
					border-top: none;
				}
				span {
					line-height: 20px;
					margin: 0;
					word-break: break-all;
					font-size: 13px;
				}
				.el-checkbox {
					@include PositionAbsoulte(0,null,null,null);
					height: 14px;
					line-height: 14px;
					font-size: 14px;
					margin: auto;
					bottom: 0;
					text-align: center;
					&.view {
						width: 60px;
						right: 150px;
					}
					&.edit {
						width: 60px;
						right: 30px;
					}
				}
			}
		}
	}
</style>
