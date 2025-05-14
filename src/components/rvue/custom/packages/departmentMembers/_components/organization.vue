<!--
 * @Author: ben
 * @LastEditTime: 2021-05-27 10:15:52
-->
<template>
	<div class="member">
		<div class="group" style="height: 200px; overflow: auto">
			<el-tree
				:data="data"
				node-key="id"
				show-checkbox
				:check-on-click-node="true"
				:check-strictly="true"
				:props="defaultProps"
				:default-expanded-keys="defaultExpandedKeys"
				@check="bindCheck"
				ref="tree"
			></el-tree>
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Ref, PropSync, Watch, Inject } from "vue-property-decorator";
	import { Tree } from "element-ui";

	/**
     @data 部门数据
     @tags 存放修改部门人员数据
    **/
	@Component({})
	export default class extends Vue {
		@Prop({ type: Array, default: () => [] }) data!: any[];
		@PropSync("tags", { type: Array, default: () => [] }) syncTags!: any[];
		@Ref("tree") readonly refTree!: any;
		@Inject() readonly parent!: any;

		private defaultProps = {
			label: "name",
			children: "childList",
		};

		private get defaultExpandedKeys() {
			try {
				return [this.data[0].id];
			} catch (err) {
				return [];
			}
		}

		private getCheckData(node: any) {
			let tags = this.syncTags || [];
			let index = tags.findIndex((d: any) => node.id == d.id);
			console.log(index);
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

		private getRadioData(node: any) {
			let index = this.syncTags.findIndex((d: any) => node.id == d.id);
			if (index !== -1) {
				this.syncTags.splice(index, 1);
			} else {
				this.syncTags = [{ id: node.id, name: node.name, type: "0" }];
			}
		}

		private bindCheck(node: any) {
			let multiple = (this.parent as any).multiple;
			console.log(multiple, "eoeo");

			if (multiple) {
				this.getCheckData(node);
			} else {
				this.getRadioData(node);
			}
		}

		@Watch("syncTags", { immediate: true })
		private onChangeSyncTags(n: any) {
			let keys: any[] = [];
			n.forEach((item: any) => {
				keys.push(item.id);
			});
			this.$nextTick(() => {
				(<any>this).$refs.tree.setCheckedKeys(keys, true);
			});
		}
	}
</script>
