<template>
	<div style="min-height: 100vh; background: hsla(0, 0%, 98%, 0.9)">
		<m-header></m-header>
		<div class="corp">
			<div class="business-tab">
				<div class="tab-header">
					<ul class="tab-header-wrapper">
						<li
							class="tab-header-item"
							:class="{ 'tab-header-active': active === 1 }"
							@click="active = 1"
						>
							{{ $l("platformset.basicinfo") }}
						</li>
						<li
							class="tab-header-item"
							:class="{ 'tab-header-active': active % 10 === 2 }"
							@click="active = 12"
              :title="$l('platformset.authoritymanage')"
						>
							<i class="el-icon-lock"></i> {{ $l("platformset.authoritymanage") }}
						</li>
						<!-- <div id="group" v-show="active % 10 === 2">
							<div
								class="group-item"
								:class="{ 'group-item-active': active === 12 }"
								@click="active = 12"
                :title="$l('platformset.platformanager')"
							>
								{{ $l("platformset.platformanager") }}
							</div>
							<div
								class="group-item"
								:class="{ 'group-item-active': active === 22 }"
								@click="active = 22"
                :title="$l('platformset.appdevelopteam')"
							>
								{{ $l("platformset.appdevelopteam") }}
							</div>
						</div> -->
						<li
							class="tab-header-item"
							:class="{ 'tab-header-active': active === 3 }"
							@click="active = 3"
						>
							{{ $l("platformset.addressbook") }}
						</li>
						<li
							class="tab-header-item"
							:class="{ 'tab-header-active': active === 4 }"
							@click="active = 4"
						>
							{{ $l("platformset.enterpriselog") }}
						</li>
					</ul>
				</div>
			</div>
			<div class="business-container">
				<div v-if="active === 12" class="container-panel">
					<h2>
						{{ $l("platformset.platformanager") }}
						<p class="tip">平台管理员人数上限：30</p>
					</h2>
					<ul class="select-list">
						<li class="select-item add-item" @click="showDeptDialog">
							<i
								class="el-icon-circle-plus-outline"
								:style="{
									fontSize: '22px',
									color: '#4c81ff',
									marginRight: '6px',
								}"></i>
              {{$l('platformset.createmanager')}}
            </li>
            <li class="select-item select-user-item" :key="item.id" v-for="item in tadminList">
              <i v-if="item.dtUserId !== selfUserId" class="el-icon-close close-btn"
                @click="delTAdmin(item.id, item.name)"></i>
              <div class="user-avatar">
                <img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
                <i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#4c81ff', color: '#fff', borderRadius: '50%' }"></i>
              </div>
              <div>
                <p class="name">{{ item.name }}</p>
                <p class="email">{{ item.email }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="active === 22" class="container-panel">
          <h2>
            {{$l('platformset.appdevelopteam')}}
            <p class="tip">应用开发组个数上限：100</p>
          </h2>
          <ul class="select-list">
            <li class="select-item add-item" @click="showDialog">
              <i class="el-icon-circle-plus-outline" :style="{
									fontSize: '22px',
									color: '#4c81ff',
									marginRight: '6px',
								}"></i>
              {{$l('platformset.createdevelopteam')}}
            </li>
            <li class="select-item select-group-item" :key="item.id" v-for="item in agroupList"
              @click="editAppGroup(item)">
              <i class="el-icon-close close-btn" @click.stop="delAppGroup(item.code, item.name)"></i>
              <div class="name">{{ item.name }}</div>
              <div class="avatar-wrapper">
                <div class="user-avatar" :key="i.id" v-for="(i, index) in item.users">
                  <el-tooltip v-if="index < 6" :content="i.name + (i.email || '')">
                    <img v-if="i.avatar" class="avatar-image" :src="i.avatar" />
                    <i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#4c81ff', color: '#fff', borderRadius: '50%' }"></i>
                  </el-tooltip>
                </div>
                <div class="user-count">{{ item.users.length }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 新增/修改应用开发组 -->
    <rvue-dialog :visible="showPermDialog" @close="showPermDialog = false">
      <div slot="title" class="dialog-title">
        <div class="dialog-title-line"></div>
        <div class="dialog-title-font">
          {{ form.code ? $l('platformset.editappdevgroup') : $l('platformset.newappdevgroup') }}
        </div>
      </div>
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="150px" class="appForm">
        <el-form-item :label="$l('platformset.devgroupname')" prop="name">
          <el-input :placeholder="$l('platformset.devgroupname')" maxlength="100" v-model="form.name" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item :label="$l('platformset.appdeveloper')" required>
          <div class="user-list">
            <i class="el-icon-circle-plus-outline" :style="{
								fontSize: '22px',
								color: '#4c81ff',
								marginRight: '6px',
							}"
							@click="dialogVisible = true"
						></i>
						<div class="user-avatar" :key="item.id" v-for="item in tags">
							<img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
							<i
								v-else
								class="el-icon-user-solid"
								:style="{
									fontSize: '20px',
									background: '#4c81ff',
									color: '#fff',
									borderRadius: '50%',
								}"
							></i>
						</div>
					</div>
				</el-form-item>
				<el-form-item :label="$l('platformset.appauthority')" required>
					<div>
						<i
							class="el-icon-circle-plus-outline"
							:style="{ fontSize: '22px', color: '#4c81ff', marginRight: '6px' }"
							@click="treeDialogVisible = true"
						></i>
						<span
							v-for="tag in appCodes"
							:key="tag.name"
							style="margin: 5px; vertical-align: middle"
						>
							<!-- 除去其他分组 -->
							<el-tag v-if="tag.id !== '1'" :type="tag.isApp ? '' : 'warning'">{{
								tag.name
							}}</el-tag>
						</span>
					</div>
					<!-- <el-col :span="11">
          <el-select v-model="form.appGroupList" multiple placeholder="请选择应用分组">
            <el-option 
              v-for="item in appList"
              :key="item.id"
              :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
        <el-cascader
          v-model="form.codeList"
          :options="appList"
          :props="props"
          clearable
          placeholder="请选择应用"></el-cascader>
        </el-col> -->
				</el-form-item>
				<!-- <el-tree
        :data="appList"
        :props="props"
        show-checkbox
        @check-change="handleCheckChange">
      </el-tree> -->
				<el-checkbox-group v-model="form.type">
					<el-checkbox
						label="create"
						name="type"
						:disabled="!appCodes.some((v) => !v.isApp)"
						>{{ $l("platformset.groupcreateauthority") }}</el-checkbox
					>
					<el-checkbox label="delete" name="type">{{
						$l("platformset.appdeleteauthority")
					}}</el-checkbox>
				</el-checkbox-group>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="showPermDialog = false">{{ $l("global.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="saveAppPerm">{{ $l("global.confirm") }}</el-button>
			</div>
		</rvue-dialog>
		<!-- 添加管理员 -->
		<RvueDepartmentMembers
			:defaultTags="[]"
			:dialogVisible.sync="admindialogVisible"
			@closeDialog="bindGetTagsAdmin"
			:hide="[0, 1]"
			:multiple="false"
		/>
		<!-- 添加权限组 -->
		<RvueDepartmentMembers
			:defaultTags.sync="tags"
			:dialogVisible.sync="dialogVisible"
			@closeDialog="bindGetTags"
			:hide="[0, 1]"
		/>

		<!-- 添加应用分组 -->
		<tree
			:defaultTags="appCodes"
			:dialogVisible.sync="treeDialogVisible"
			@closeDialog="bindGetTagsTree"
			:multiple="true"
		/>
	</div>
</template>

<script>
	import MHeader from "@/components/m-header/m-header.vue";
	import {
		getTenantAdminList,
		addTenantAdmin,
		delTenantAdmin,
		getDevGroupList,
		addDevGroup,
		updateDevGroup,
		delDevGroup,
	} from "@/api/tenant";
	import { delPermGroup, getAppTree } from "@/api/form";
	import { UserModule } from "@/store/modules/user";
	import Tree from "./_components/tree.vue";

	export default {
		name: "Corp",
		components: {
			MHeader,
			Tree,
		},
		data() {
			return {
				rules: {
					name: [
						{
							required: true,
							message: "请输入名称",
							trigger: "blur",
						},
					],
					codeList: [
						{
							required: true,
							message: "请添加应用权限",
							trigger: "change",
						},
					],
				},
				selfUserId: UserModule.userInfo.userId,
				active: 1,
				admindialogVisible: false,
				tags: [],
				dialogVisible: false,
				text: "",
				form: {
					type: [
						/* '应用创建权限','应用删除权限' */
					],
				},
				showPermDialog: false,
				tadminList: [],
				agroupList: [],
				appList: [],
				props: {
					value: "code",
					label: "name",
					multiple: true,
				},
				treeDialogVisible: false,
				appCodes: [],
			};
		},
		created() {
			this.getTAdminList();
			this.getAppGroupList();
		},
		methods: {
			// 获取平台管理员列表
			getTAdminList() {
				getTenantAdminList().then((res) => {
					this.tadminList = res.data || [];
				});
			},
			handleCheckChange(data, checked, indeterminate) {
				console.log(data, checked, indeterminate);
			},
			handleClick(tab, event) {
				console.log(tab, event);
			},
			showDeptDialog() {
				if (this.tadminList.length < 30) {
					this.admindialogVisible = true;
				} else {
					this.$message.info("已达平台管理员个数上限： 30个");
				}
			},
			// 新增应用开发组
			showDialog() {
				// if(this.agroupList.length < 100)
				this.form = {
					type: [],
				};
				this.appCodes = [];
				this.tags = [];
				this.showPermDialog = true;
				/* getAppTree()
        .then(res=> {
          this.appList = res.data;
        }) */
			},
			// 修改应用开发组
			editAppGroup(item) {
				this.form = {
					...item,
					type: item.operateTypes,
				};
				this.tags = item.users;
				this.appCodes = item.apps;
				this.showPermDialog = true;
			},
			// 添加平台管理员
			bindGetTagsAdmin(tags) {
        for(let i = 0; i < this.tadminList.length; i++) {
          if(tags[0].dtUserId === this.tadminList[i].dtUserId) {
            this.$message.warning("该成员已存在，请勿重复添加");
            return;
          }
        }
				addTenantAdmin(tags[0].id).then((res) => {
					if (res.data) {
						this.$message.success("添加成功！");
					}
					this.admindialogVisible = false;
					this.getTAdminList();
				});
			},
			// 删除平台管理员
			delTAdmin(id, name) {
				this.$confirm("", `您确定要删除'${name}'管理员吗？`, {
					type: "warning",
					center: true,
				}).then(() => {
					delTenantAdmin(id)
						.then((res) => {
							if (res.data) {
								this.$message.success("删除成功！");
							}
							this.getTAdminList();
						})
						.catch((err) => {
							this.$message.error(err.msg);
						});
				});
			},
			// 获取应用开发组
			getAppGroupList() {
				getDevGroupList().then((res) => {
					this.agroupList = res.data || [];
				});
			},
			// 删除应用开发组
			delAppGroup(id, name) {
				this.$prompt(
					"如确定删除,请输入应用开发组名称",
					`您确定要删除'${name}'应用开发组吗？`,
					{
						type: "warning",
						center: true,
					}
				)
					.then(({ value }) => {
						if (value == name) {
							delDevGroup(id)
								.then((res) => {
									if (res.data) {
										this.$message.success("删除成功！");
									}
									this.getAppGroupList();
								})
								.catch((err) => {
									this.$message.error(err.msg);
								});
						}
					});
			},
			/* saveAppPermGroup({
        name: this.form.name,
        codeList: this.form.codeList.map(v => v = v[1]),
        authJson: JSON.stringify(this.tags),
        operTypeIds: [],
      })
      .then(res => {
        if(res.data) {
          this.$message.success("保存成功！")
        }
        // reset
        this.form = {};
        this.tags = [];
        this.showPermDialog = false;
        this.getAppGroupList();
      }) */
			// 保存权限组
			saveAppPerm() {
				this.$refs.ruleForm.validate((valid) => {
					if (
						valid &&
						this.form.name.trim() &&
						this.tags.length &&
						this.appCodes.length
					) {
						if (this.form.code) {
							updateDevGroup({
								code: this.form.code,
								name: this.form.name.trim(),
								users: this.tags,
								apps: this.appCodes,
								operateTypes: this.form.type,
							}).then((res) => {
								if (res.data) {
									this.$message.success("保存成功！");
									this.showPermDialog = false;
									this.getAppGroupList();
								}
							});
						} else {
							addDevGroup({
								name: this.form.name.trim(),
								users: this.tags,
								apps: this.appCodes.concat([
									{
										id: "1",
										code: "other",
										isApp: false,
										parentId: null,
										name: "其他分组",
									},
								]),
								operateTypes: this.form.type,
							}).then((res) => {
								if (res.data) {
									this.$message.success("保存成功！");
									this.showPermDialog = false;
									this.getAppGroupList();
								}
							});
						}
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			// 添加应用权限
			bindGetTagsTree(tags) {
				console.log("分组、应用", tags);
				if (tags !== null) {
					this.appCodes = tags;
				}
				this.treeDialogVisible = false;
			},
			// 添加权限组成员
			bindGetTags(tags) {
				if (tags !== null) {
					this.tags = tags;
				}
				this.dialogVisible = false;
			},
		},
	};
</script>
<style lang="scss" scoped>
	.corp {
		display: flex;
		align-items: flex-start;
		margin: 20px auto 0;
		box-sizing: border-box;
	}

	#group {
		height: 100px;
		animation: trans 0.2s linear;
		overflow: hidden;

		.group-item {
			@include PositionRelative(null,50px);
			margin-left: 20px;
			padding-left: 30px;
			font-size: 14px;
			line-height: 50px;
			overflow: hidden;
			color: #1f2d3d;
			cursor: pointer;
			align-items: center;
			@include ExtraNotDisplayed();

			&.group-item-active {
				color: #6087FD;
				background-color: #f2f6fc;
			}
		}
	}

	@keyframes trans {
		0% {
			height: 0;
		}

		100% {
			height: 100px;
		}
	}

	.business-tab {
		flex: 0 0 auto;
		background-color: #fff;
		box-shadow: 0 2px 3px 0 rgb(0 0 0 / 5%);

		.tab-header {
			width: 178px;
			padding: 9px 0;
			font-weight: 400;
			font-size: 16px;

			.tab-header-wrapper {
				top: 0;
				right: 0;
				bottom: 0;
				left: 15px;
				white-space: nowrap;
				transition: transform 0.2s ease;

				.tab-header-item {
					@include PositionRelative(null,50px);
					padding-left: 30px;
					font-size: 14px;
					line-height: 50px;
					overflow: hidden;
					color: #1f2d3d;
					cursor: pointer;
					align-items: center;
					@include ExtraNotDisplayed();

					&.tab-header-active {
						color: #6087FD;
						background-color: #f2f6fc;

						&:before {
							@include PositionAbsoulte(0,null,0,0);
							content: "";
							width: 3px;
							height: 50px !important;
							background: #6087FD;
							box-sizing: border-box;
						}
					}
				}
			}
		}
	}

	.business-container {
		flex: 1 1 auto;
		padding: 0 0 20px 20px;

		.container-panel {
			@include GlobalAvatar(null,null,3px,#fff);
			padding: 14px 20px;
			box-shadow: 0 2px 3px 0 rgb(0 0 0 / 5%);

			h2 {
				font-weight: bold;
			}

			.tip {
				visibility: hidden;
				font-size: 12px;
			}

			.select-list {
				display: flex;
				flex-flow: row wrap;

				.select-item {
					@include PositionRelative(250px,60px);
					padding-left: 15px;
					margin: 10px;
					border: 1px solid #eee;

					.user-avatar {
						margin-right: 14px;
						@include VertivalAlign(inline-block,middle,30px,30px);
						line-height: 30px;

						.avatar-image {
							@include GlobalAvatar(100%,100%,50%)
						}
					}

					.name {
						font-size: 16px;
						margin-bottom: 10px;
					}

					.email {
						font-size: 12px;
					}

					.close-btn {
						@include PositionAbsoulte(5px,5px,null,null);
						cursor: pointer;
					}
				}

				.select-user-item {
					display: flex;
					align-items: center;
				}

				.select-group-item {
					cursor: pointer;

					.avatar-wrapper {
						@include PositionRelative(100%,null);
						overflow: hidden;
						.user-count {
							@include PositionAbsoulte(0,5px,null,null);
							line-height: 20px;
							text-align: center;
							font-size: 12px;
							border: 1px solid #ccc;
							@include GlobalAvatar(20px,20px,50%,null);
						}
					}

					.user-avatar {
						margin-right: 12px;
						@include VertivalAlign(inline-block,middle,20px,20px);
						line-height: 20px;

						.avatar-image {
							@include GlobalAvatar(100%,100%,50%)
						}
					}
				}

				.add-item {
					display: flex;
					align-items: center;
					cursor: pointer;
				}
			}
		}
	}

	.user-list {
		display: flex;
		flex-flow: row wrap;
		margin-top: 10px;
		margin-bottom: 10px;

		.user-avatar {
			margin-right: 12px;
			@include VertivalAlign(inline-block,middle,20px,20px);
			line-height: 20px;

			.avatar-image {
			   @include GlobalAvatar(100%,100%,50%)
			}
		}
	}
</style>

<style lang="scss">
  .appForm {
    padding:0 40px;
    .el-form-item {
      .el-form-item__label {
        padding-right: 40px;
      }
    }
    .el-tag {
      display: inline-block;
      max-width: 200px;
      @include ExtraNotDisplayed();
    }
  }
</style>
