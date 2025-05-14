
<template>
	<div>
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
</template>
<script lang="ts">
	import { Component, Vue, Prop, Ref, PropSync, Watch, Inject } from "vue-property-decorator";

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
      value: "code"
		};

		private get defaultExpandedKeys() {
			try {
				return [this.data[0].id];
			} catch (err) {
				return [];
			}
		}

		private getCheckData(node: any) {
			let index = this.syncTags.findIndex((d: any) => node.id == d.id);

			if (index !== -1) {
				this.syncTags.splice(index, 1);
			} else {
				this.syncTags.push({
					id: node.id,
					name: node.name,
          isApp: node.isApp,
          code: node.code,
					parentId: node.parentId,
				});
			}
		}

		private getRadioData(node: any) {
			this.syncTags = [{ id: node.id, name: node.name }];
		}

		private bindCheck(node: any) {
			let multiple = (this.parent as any).multiple;
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
