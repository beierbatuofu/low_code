<!--
 * @Author: ben
 * @LastEditTime: 2021-05-24 11:28:53
-->
<template>
	<div class="department-body">
		<el-tabs v-model="activeName" @tab-click="() => {}">
			<el-tab-pane label="应用分组" name="0">
				<Organization :tags.sync="syncTags" :data.sync="dets" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Model, PropSync, Inject } from "vue-property-decorator";
	import { getAllApp } from "@/api/form";
	import { transToTree } from "@/utils/transform";
	import Organization from "./organization.vue";

	@Component({
		components: {
			Organization,
		},
	})
	export default class extends Vue {
		@PropSync("tags", { type: Array, default: {} }) syncTags!: any[];
		@Prop({ type: Boolean, default: true }) multiple!: boolean;

		private activeName: any = "";
		private dets: any[] = [];
		private checkedList: object[] = [];

		public created() {
			this.activeName = "0";
		}

		public mounted() {
			getAllApp().then((res: any) => {
				const { permApps } = res.data;
				// 去除其他分组
				for(let i = 0; i < permApps.length; i++) {
					if(permApps[i].id === "1") {
						permApps.splice(i,1);
						break;
					}
				}
				this.dets = transToTree(permApps);
			});
		}
	}
</script>
<style lang="scss">
	.department-body .el-tabs__content {
		overflow-y: scroll;
	}
</style>