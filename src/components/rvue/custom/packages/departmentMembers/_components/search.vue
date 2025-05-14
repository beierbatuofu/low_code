<template>
	<div class="group" style="height: 184px; overflow: auto; margin: 2% 3% 0% 5%">
		<div v-if="nameList.length > 0" :key="reLoadKey" class="total">
			<p class="searchCheck" v-for="(item, index) in nameList" :key="index" style="margin-bottom: 12px" ref="na">
				<span :class="styleNum == index ? 'userStyle' : 'showNone'" v-if="item.avatar">{{ $i18n.t("global.user") }}</span>
				<span :class="roleNum == index ? 'deptStyle' : 'showNone'" v-if="item.operateTypes">{{ $i18n.t("global.roleGroup") }}</span>
				<span :class="deptNum == index ? 'deptStyle' : 'showNone'" v-if="item.dept">{{ $i18n.t("global.dept") }}</span>
				<el-checkbox @change="bindChecked(item)" :label="item" :checked="setChecked(item)" :key="item.id">
					<div v-if="item.avatar != null || item.dept">
						<div class="user-avatar" v-if="item.avatar">
							<img :src="item.avatar" class="avatar-image" />
						</div>
						<div class="user-avatar" v-if="item.avatar == ''">
							<img :src="`${publicPath}img/avatar.svg`" class="no-avatar-image" />
						</div>
						{{ item.name }}
						<div class="fontColor" v-for="(item, index) in item.parentDeptPath" :key="index">
							{{ item }}
						</div>
					</div>
					<div v-else class="singleText">
						<div>{{ item.name }}</div>
					</div>
				</el-checkbox>
			</p>
		</div>
		<div class="noInfo" v-else>{{ $t("global.empty") }}</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Ref, PropSync, Watch, Inject } from "vue-property-decorator";
	import { searchUserList, searchDept, getRoleGroup } from "@/api/flow";

	@Component({})
	export default class extends Vue {
		@Prop({ type: String, default: "" }) searchInfo!: any;
		@Prop({ type: Array, default: [] }) getMonitor!: any[];
		@PropSync("tags", { type: Array, default: {} }) syncTags!: any[];
		@Inject() readonly parent!: any;

		private nameList: any[] = [];
		//提取信息
		private userApi: any[] = [];
		private deptApi: any[] = [];
		private roleApi: any[] = [];
		private searchApi: any = {};
		private reLoadKey = 1;
		//private num:any;
		private setChecked(node: any) {
			let index = this.syncTags.findIndex((item: any) => item.id == node.id);
			return index >= 0;
		}

		private get styleNum() {
			return this.nameList.findIndex((item) => item.avatar);
		}
		private get deptNum() {
			return this.nameList.findIndex((item) => item.dept);
		}

		private get roleNum() {
			return this.nameList.findIndex((item) => item.operateTypes);
		}

		private bindChecked(node: any) {
			let multiple = (this.parent as any).multiple;
			if (multiple) {
				this.getCheckData(node); //多选
			} else {
				this.getRadioData(node); //单选
			}
		}
		private getCheckData(node: any) {
			let index = this.syncTags.findIndex((item: any) => item.id == node.id);

			if (node.avatar != undefined) {
				index < 0
					? this.syncTags.push({
							type: "2",
							id: node.id,
							name: node.name,
							avatar: node.avatar,
							dtUserId: node.dtUserId,
					  })
					: this.syncTags.splice(index, 1);
			}
			if (node.createTime != undefined) {
				if (index !== -1) {
					this.syncTags.splice(index, 1);
				} else {
					this.syncTags.push({
						id: node.id,
						name: node.name,
						type: "0",
						dtUserId: node.id,
					});
				}
			}
			if (node.appCode != undefined) {
				index < 0
					? this.syncTags.push({
							type: "1",
							id: node.id,
							name: node.name,
							code: node.code,
							user: node.users,
					  })
					: this.syncTags.splice(index, 1);
			}
		}

		private getRadioData(node: any) {
			let index = this.syncTags.findIndex((item: any) => item.id == node.id);
			index < 0
				? (this.syncTags = [
						{
							type: "2",
							id: node.id,
							name: node.name,
							avatar: node.avatar,
							dtUserId: node.dtUserId,
						},
				  ])
				: this.syncTags.splice(index, 1);
		}
		//执行成员接口
		private executiveUserInter(username: any) {
			return searchUserList({
				deptId: 0,
				name: username,
				roleId: 0,
			});
		}

		//执行部门接口
		private executiveDeptInter(dept: any) {
			return searchDept({
				deptId: 0,
				name: dept,
			});
		}
		//查询角色组接口
		private excutiveRoleGroup(roleName: any) {
			let appId = this.$route.params.appCode;
			return getRoleGroup(appId, roleName);
		}

		@Watch("getMonitor", { immediate: true, deep: true }) //监听类型的判断
		foo() {
			if (this.getMonitor.indexOf(2) > -1) {
				return (this.searchApi = "dept");
			} else if (this.getMonitor.indexOf(0) > -1) {
				return (this.searchApi = "user");
			} else {
				return (this.searchApi = "deptUser");
			}
		}

		@Watch("searchInfo") //监听输入内容
		searchUserList(node: any) {
			if (node.trim() != "") {
				const searchInfo = node;
				//判断如果是成员
				if (this.searchApi == "user") {
					this.executiveUserInter(searchInfo).then((res) => {
						const { data } = res;
						this.nameList = data.map((item: any) => ({
							...item,
						}));
					});
				} else if (this.searchApi == "dept") {
					//判断如果是部门
					this.executiveDeptInter(searchInfo).then((res) => {
						const { data } = res;
						this.nameList = data.map((item: any) => ({
							...item,
							dept: "1",
						}));
						console.log(this.nameList, "0000");
					});
				} else {
					//同时查询部门,成员,角色组三个接口
					//查成员
					let info = this.executiveUserInter(searchInfo).then((res) => {
						const { data } = res;
						return (this.userApi = data.map((item: any) => ({
							...item,
						})));
					});
					//查部门
					let dep = this.executiveDeptInter(searchInfo).then((res) => {
						const { data } = res;
						return (this.deptApi = data.map((item: any) => ({
							...item,
							dept: "1",
						})));
					});
					//查角色组
					let rol = this.excutiveRoleGroup(searchInfo).then((res) => {
						const { data } = res;
						return (this.roleApi = data.map((item: any) => ({
							...item,
						})));
					});
					Promise.all([info, rol, dep]).then((values) => {
						this.nameList = values.flat();
						console.log(this.nameList, "nameList");
					});
				}
			} else {
				this.nameList = [];
			}
		}

		@Watch("syncTags")
		onChangeSyncTags(n: any) {
			console.log(this.syncTags, "syncTags");
			this.reLoadKey++;
		}
	}
</script>
<style lang="scss">
	// .total>span[.userStyle]{}
	// .total>p:first-child>.userStyle{
	// 		display: block;
	// 	margin-bottom: 5px;
	// 	color:#4c81ff;
	// 	margin:10px 0;
	// }

	.searchCheck > .userStyle,
	.deptStyle,
	.roleStyle {
		display: block;
		margin-bottom: 5px;
		color: #4c81ff;
		margin: 10px 0;
	}
	// .searchCheck>.deptStyle:not(:first-child){
	// 	display: none;
	// }
	.showNone {
		display: none;
	}

	.userStyle + label > .el-checkbox__input {
		line-height: 4;
	}
	.roleStyle + label > .el-checkbox__input {
		line-height: 2.5;
	}
	.deptStyle + label > .el-checkbox__input {
		line-height: 2;
	}
	// .mt{
	// 	margin:10px 0;
	// }
	// .userStyle,.deptStyle,.roleStyle {
	// 	display: block;
	// 	margin-bottom: 5px;
	// 	color:#4c81ff;
	// }
	.noInfo {
		text-align: center;
		margin: 10%;
	}
	//勾选框在右侧,留着以后可能需要用
	// .el-checkbox{
	//     min-width: -webkit-fill-available;
	// }
	.searchCheck .el-checkbox__input {
		vertical-align: top;
		//line-height: 2.5;
		// float: right;
	}
	.fontColor {
		color: #6087fd;
		@include ExtraNotDisplayed;
	}
	.user-avatar {
		display: inline-block;
		margin-top: 5px;
		margin-right: 14px;
		vertical-align: sub;
		width: 30px;
		height: 30px;
		line-height: 30px;

		.avatar-image {
			@include GlobalAvatar(100%, 100%, 50%);
			object-fit: cover;
		}
		.no-avatar-image {
			@include GlobalAvatar(100%, 100%, 50%, #ececea);
		}
	}
	.singleText {
		margin-top: 6px;
	}
</style>
