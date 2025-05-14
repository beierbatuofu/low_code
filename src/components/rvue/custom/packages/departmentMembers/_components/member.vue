<template>
	<div class="member">
		<div class="group" style="height: 200px; overflow: auto">
			<el-tree :data="data" node-key="id" :default-expanded-keys="defaultExpandedKeys" @node-click="bindNodeClick" :props="defaultProps" />
		</div>
		<div class="group" style="height: 200px; overflow: auto">
			<div v-if="records.length > 0" :key="reLoadKey">
				<p v-for="(item, index) in records" :key="index" style="margin-bottom: 5px">
					<el-checkbox @change="bindChecked(item)" :label="item" :checked="setChecked(item)" :key="item.id">
						<div class="user-avatar" v-if="item.avatar != ''">
							<img :src="item.avatar" class="avatar-image" />
						</div>
						<div class="user-avatar" v-else>
							<img :src="`${publicPath}img/avatar.svg`" class="no-avatar-image" />
						</div>
						{{ item.name }}
					</el-checkbox>
				</p>
			</div>
			<div v-else>{{ $t("departmantBody.none") }}</div>
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Watch, PropSync, Inject } from "vue-property-decorator";
	import { getUserList } from "@/api/flow";

	/**
     @data 部门数据
     @tags 存放修改部门人员数据
    **/
	@Component({})
	export default class extends Vue {
		@Prop({ type: Array, default: [] }) data!: any[];
		@Prop({ type: Array, default: {} }) tags!: any[];
		@PropSync("tags", { type: Array, default: {} }) syncTags!: any[];
		@Inject() readonly parent!: any;

		private records: any[] = [];
		private checkedData = [];
		private radioValue = "";
		private reLoadKey = 1;
		private key = 1;

		private get defaultExpandedKeys() {
			try {
				return [this.data[0].id];
			} catch (err) {
				return [];
			}
		}

		private setChecked(node: any) {
			let index = this.syncTags.findIndex((item: any) => item.id == node.id);

			return index >= 0;
		}

		private defaultProps = {
			label: "name",
			children: "childList",
		};

		private getCheckData(node: any) {
			let index = this.syncTags.findIndex((item: any) => item.id == node.id);
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

		private bindChecked(node: any) {
			let multiple = (this.parent as any).multiple;
			if (multiple) {
				this.getCheckData(node);
			} else {
				this.getRadioData(node);
			}
		}

		private bindNodeClick(node: any) {
			const { id: deptId } = node;
			const tags = this.tags;

			getUserList({
				current: 1,
				model: {
					deptId,
					name: "",
					roleId: 0,
				},
				order: "descending",
			}).then((res) => {
				const { data } = res;
				this.records = data.records.map((item: any) => ({
					type: "2",
					...item,
				}));
			});
		}

		@Watch("syncTags")
		onChangeSyncTags(n: any) {
			this.reLoadKey++;
		}
	}
</script>
<style lang="scss">
	.no-avatar-image {
		@include GlobalAvatar(100%, 100%, 50%, #ececea);
	}
</style>
