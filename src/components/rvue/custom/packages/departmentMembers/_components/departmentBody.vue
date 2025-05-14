<!--
 * @Author: ben
 * @LastEditTime: 2022-04-08 13:50:41
-->
<template>
	<div class="department-body">
		<!-- <el-input suffix-icon="el-icon-search" clearable class="elIput" v-model="srarchContent" placeholder="快速查询" size="medium"  @focus="changeSearch()" @input="searchInfo()"/> -->
		<el-tabs v-model="activeName" @tab-click="() => {}">
			<el-tab-pane :label="$t('departmantBody.organizationalStructure')" :name="String(names[0])" v-if="getHide(0)">
				<Organization :label="$t('global.dept')" :tags.sync="syncTags" :data.sync="dets" />
			</el-tab-pane>
			<el-tab-pane :label="$t('global.member')" :name="String(names[2])" v-if="getHide(2)">
				<Member :data.sync="dets" :tags.sync="syncTags" />
			</el-tab-pane>
			<el-tab-pane :label="$t('global.roleGroup')" :name="String(names[1])" v-if="getHide(1)">
				<Role :data.sync="roledets" :tags.sync="syncTags" />
			</el-tab-pane>
			<el-tab-pane name="searchTab">
				<Search :data.sync="dets" :tags.sync="syncTags" :getMonitor="monitor" :searchInfo="srarchContent" />
			</el-tab-pane>
		</el-tabs>
		<rvue-input class="search" suffix-icon="el-icon-search" clearable @focus="foc()" @blur="bul()" v-model="srarchContent" placeholder="搜索查询" size="small" @input="searchInfo"></rvue-input>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Model, PropSync, Provide, Inject } from "vue-property-decorator";
	import { getDet, getRoleGroup } from "@/api/flow";
	import Member from "./member.vue";
	import Organization from "./organization.vue";
	import Search from "./search.vue";
	import Role from "./role.vue";
	import { Module } from "vuex-module-decorators";

	@Component({
		components: {
			Member,
			Organization,
			Search,
			Role,
		},
	})
	export default class extends Vue {
		@PropSync("tags", { type: Array, default: () => [] }) syncTags!: any[];
		@Prop({ type: Boolean, default: true }) multiple!: boolean;
		@Prop({ type: [String, Array, Number], default: -1 }) hide!: any;
		@Provide("parent") parent = this;

		private activeName: any = "";
		private elIput = false;
		private dets: any[] = [];
		private roledets: any[] = [];
		private checkedList: object[] = [];
		private names = [0, 1, 2];
		private searchTab: any = ""; //切换到搜索的tab上
		private srarchContent: any = ""; //搜索内容
		private monitor: any = [];
		private showImg: any = true;

		private get resetHides() {
			return Array.isArray(this.hide) ? this.hide : [this.hide];
		}

		private getHide(idx: number) {
			let hides = this.resetHides;
			return !hides.includes(idx);
		}
		//通过focus切换搜索tab页
		// private changeSearch() {
		// 	this.activeName = "searchTab";
		// }
		//参考简道云 搜索框focus后输入框变长
		private foc() {
			this.elIput = true;
			this.showImg = false;
		}
		private bul() {
			this.elIput = false;
			this.showImg = true;
			//	this.srarchContent=null;//鼠标点击其他--输入框清空
		}
		private enter() {}
		//所有相关信息内容
		private searchInfo() {
			if (this.srarchContent.trim() != "") {
				this.activeName = "searchTab";
			} else {
				if (this.monitor.indexOf(0) > -1) {
					this.activeName = String(this.names[2]);
				} else {
					this.activeName = String(this.names[0]);
				}
			}
		}

		private created() {
			const names = this.names.concat();

			let hides = this.resetHides;
			hides.forEach((idx: number | string) => {
				names.splice(names.indexOf(Number(idx)), 1);
			});
			//TODO
			this.monitor = hides;
			names.length > 1 && names.splice(names.indexOf(Number(1)), 1);
			this.activeName = String(names[0]); //默认选中高亮
		}
		public mounted() {
			//角色组
			let appId = this.$route.params.appCode;
			let data = "";
			getRoleGroup(appId, data).then((res) => {
				const { data } = res;
				this.roledets = data;
			});

			getDet({
				deptId: 0,
			}).then((res) => {
				const { data } = res;
				this.dets = data;
			});
		}
	}
</script>
<style lang="scss" scoped>
	.department-body {
		position: relative;
	}
	.search {
		position: absolute;
		top: 7px;
		right: 10px;
		z-index: 2;
		width: 200px !important;
	}
	::v-deep.el-tabs {
		.el-tabs__content {
			height: 200px;
		}
	}

	::v-deep {
		.el-tabs__header {
			margin: 0 !important;
		}
		.el-input__inner {
			border-radius: 20px !important;
		}
	}

	::v-deep.el-input {
		.el-input__prefix,
		.el-input__suffix {
			right: 7%;
			top: -255px;
			z-index: 2;
		}
	}
</style>
